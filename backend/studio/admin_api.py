from datetime import datetime, timedelta

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.db.models import Count, Max, Q, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from django.utils.text import slugify
from rest_framework.decorators import api_view
from rest_framework.response import Response

from catalog.api import catalog_queryset
from catalog.models import Category, Product, ProductImage, Variant
from studio.api import serialize_order, text
from studio.models import CustomRequest, Order, OrderLine, StitchSignup, StudioSettings
from studio.storage import ShelfError, store_photo

OPEN = {Order.Status.PENDING, Order.Status.STITCHING, Order.Status.SHIPPED}


def closed(request):
    user = getattr(request, "user", None)
    if not user or not user.is_authenticated or not user.is_staff:
        return Response({"detail": "The studio desk is closed."}, status=403)
    return None


def owner_payload(user):
    return {"name": user.first_name or user.email, "email": user.email}


def money_rows(orders):
    return [
        {
            "id": order.id,
            "number": order.number,
            "status": order.status,
            "name": order.name,
            "email": order.email,
            "subtotal_cents": order.subtotal_cents,
            "created_at": order.created_at.isoformat(),
            "pieces": sum(line.quantity for line in order.lines.all()),
        }
        for order in orders
    ]


def parse_day(value):
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        return None


def report_queryset(params):
    today = timezone.localdate()
    start = parse_day(params.get("from")) or today.replace(day=1)
    end = parse_day(params.get("to")) or today
    if end < start:
        start, end = end, start
    orders = Order.objects.filter(created_at__date__gte=start, created_at__date__lte=end).prefetch_related("lines")
    status = text(params.get("status"))
    if status in Order.Status.values:
        orders = orders.filter(status=status)
    return start, end, orders.order_by("-created_at", "-id")


def unique_slug(name, current_id=None):
    base = slugify(name)[:70] or "piece"
    slug = base
    number = 2
    while Product.objects.filter(slug=slug).exclude(pk=current_id).exists():
        slug = f"{base}-{number}"
        number += 1
    return slug


def read_variants(product):
    colors = []
    sizes = []
    for variant in product.variants.all():
        if variant.option == Variant.Option.COLOR:
            colors.append({"name": variant.name, "hex": variant.hex})
        else:
            sizes.append({"name": variant.name, "stock": variant.stock})
    return colors, sizes


def serialize_admin_product(product):
    images = list(product.images.all())
    colors, sizes = read_variants(product)
    return {
        "id": product.id,
        "slug": product.slug,
        "name": product.name,
        "price_cents": product.price_cents,
        "category": product.category.name,
        "fiber": product.fiber,
        "description": product.description,
        "hidden": product.hidden,
        "image": images[0].src if images else "",
        "colors": colors,
        "sizes": sizes,
    }


def replace_variants(product, colors, sizes):
    product.variants.all().delete()
    rows = []
    for index, color in enumerate(colors or []):
        name = text(color.get("name"))
        if not name:
            continue
        rows.append(
            Variant(
                product=product,
                option=Variant.Option.COLOR,
                name=name[:40],
                hex=text(color.get("hex"))[:7],
                position=index,
            )
        )
    for index, size in enumerate(sizes or []):
        name = text(size.get("name"))
        if not name:
            continue
        raw_stock = size.get("stock")
        stock = None
        if raw_stock not in (None, ""):
            try:
                stock = max(0, int(raw_stock))
            except (TypeError, ValueError):
                return "Stock should be a number, or left open for made to order."
        rows.append(
            Variant(
                product=product,
                option=Variant.Option.SIZE,
                name=name[:40],
                stock=stock,
                position=index,
            )
        )
    Variant.objects.bulk_create(rows)
    return None


def write_product(request, product=None):
    body = request.data
    name = text(body.get("name"))
    fiber = text(body.get("fiber")) or "Cotton"
    description = text(body.get("description"))
    category_name = text(body.get("category"))
    hidden = bool(body.get("hidden"))
    errors = {}
    if not name:
        errors["name"] = "Name the piece."
    category = Category.objects.filter(name__iexact=category_name).first()
    if category is None:
        errors["category"] = "Choose a category from the shop."
    try:
        price_cents = int(body.get("price_cents"))
    except (TypeError, ValueError):
        price_cents = 0
    if price_cents < 1:
        errors["price"] = "Add a price."
    if not description:
        errors["description"] = "Tell a little about the piece."
    raw_image = str(body.get("image") or "").strip()
    if raw_image.startswith("data:"):
        errors["image"] = "Drop the photo again so it can be stored on the shelf."
    elif raw_image and not (raw_image.startswith("https://") or raw_image.startswith("/images/")):
        errors["image"] = "That photo address is not one we can show."
    for size in body.get("sizes") or []:
        raw_stock = size.get("stock")
        if raw_stock in (None, ""):
            continue
        try:
            int(raw_stock)
        except (TypeError, ValueError):
            errors["sizes"] = "Stock should be a number, or left open for made to order."
    if errors:
        return None, Response(errors, status=400)

    creating = product is None
    if creating:
        product = Product(
            category=category,
            slug=unique_slug(name),
            meta=f"{fiber.lower()} · handmade",
            sticker="",
            timing="stitched when you order",
            care_short="Hand wash, dry flat",
            care="Hand wash cool, reshape gently, and dry flat.",
            ships="Delivery in 10–15 working days",
            story=description,
            measurements="",
            position=Product.objects.count(),
        )
    product.category = category
    product.name = name
    product.fiber = fiber
    product.description = description
    product.price_cents = price_cents
    product.hidden = hidden
    if not creating and product.story == "":
        product.story = description
    product.save()

    problem = replace_variants(product, body.get("colors") or [], body.get("sizes") or [])
    if problem:
        return None, Response({"sizes": problem}, status=400)

    image = raw_image
    if image:
        product.images.all().delete()
        ProductImage.objects.create(product=product, src=str(image), alt=name, position=0)
    product = catalog_queryset(include_hidden=True).get(pk=product.pk)
    return product, None


@api_view(["GET"])
def admin_session(request):
    refusal = closed(request)
    if refusal:
        return refusal
    return Response(owner_payload(request.user))


@api_view(["POST"])
def admin_login(request):
    email = text(request.data.get("email")).lower()
    password = str(request.data.get("password") or "")
    user = authenticate(request, username=email, password=password)
    if user is None or not user.is_staff:
        return Response({"detail": "That email and password do not open the studio."}, status=400)
    login(request, user)
    return Response(owner_payload(user))


@api_view(["GET"])
def dashboard(request):
    refusal = closed(request)
    if refusal:
        return refusal
    today = timezone.localdate()
    month_start = today.replace(day=1)
    month_orders = Order.objects.filter(created_at__date__gte=month_start, created_at__date__lte=today)
    revenue = month_orders.exclude(status=Order.Status.CANCELLED).aggregate(cents=Sum("subtotal_cents"))["cents"] or 0
    start = today - timedelta(days=29)
    daily = {}
    for row in (
        Order.objects.filter(created_at__date__gte=start, created_at__date__lte=today)
        .exclude(status=Order.Status.CANCELLED)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(cents=Sum("subtotal_cents"))
    ):
        day = row["day"]
        if isinstance(day, datetime):
            day = day.date()
        daily[day] = row["cents"] or 0
    series = []
    for offset in range(30):
        day = start + timedelta(days=offset)
        series.append({"date": day.isoformat(), "cents": daily.get(day, 0)})
    status_counts = {row["status"]: row["count"] for row in Order.objects.values("status").annotate(count=Count("id"))}
    latest = Order.objects.prefetch_related("lines").order_by("-created_at", "-id")[:5]
    top = (
        OrderLine.objects.values("slug", "name")
        .annotate(pieces=Sum("quantity"), image=Max("image"))
        .order_by("-pieces", "name")[:5]
    )
    settings = StudioSettings.load()
    return Response(
        {
            "revenue_cents": revenue,
            "orders_this_month": month_orders.count(),
            "open_orders": Order.objects.filter(status__in=OPEN).count(),
            "customers": User.objects.filter(is_staff=False).count(),
            "revenue": series,
            "statuses": [{"status": status, "count": status_counts.get(status, 0)} for status in Order.Status.values],
            "latest": money_rows(latest),
            "top_pieces": list(top),
            "announcement": settings.announcement,
            "gift_wrap_cents": settings.gift_wrap_cents,
        }
    )


@api_view(["PATCH"])
def update_settings(request):
    refusal = closed(request)
    if refusal:
        return refusal
    settings = StudioSettings.load()
    announcement = text(request.data.get("announcement"))
    if not announcement:
        return Response({"announcement": "Write the line for the top of the shop."}, status=400)
    try:
        gift_wrap_cents = int(request.data.get("gift_wrap_cents"))
    except (TypeError, ValueError):
        gift_wrap_cents = -1
    if gift_wrap_cents < 0:
        return Response({"gift_wrap": "Add a gift-wrap amount."}, status=400)
    settings.announcement = announcement[:180]
    settings.gift_wrap_cents = gift_wrap_cents
    settings.save()
    return Response({"announcement": settings.announcement, "gift_wrap_cents": settings.gift_wrap_cents})


@api_view(["GET", "POST"])
def admin_products(request):
    refusal = closed(request)
    if refusal:
        return refusal
    if request.method == "POST":
        product, error = write_product(request)
        if error:
            return error
        return Response(serialize_admin_product(product), status=201)
    products = [serialize_admin_product(product) for product in catalog_queryset(include_hidden=True)]
    return Response(
        {
            "products": products,
            "categories": list(Category.objects.order_by("position", "name").values_list("name", flat=True)),
        }
    )


@api_view(["GET", "PATCH", "DELETE"])
def admin_product_detail(request, product_id):
    refusal = closed(request)
    if refusal:
        return refusal
    product = catalog_queryset(include_hidden=True).filter(pk=product_id).first()
    if product is None:
        return Response({"detail": "That piece is not on the desk."}, status=404)
    if request.method == "GET":
        return Response(serialize_admin_product(product))
    if request.method == "DELETE":
        if OrderLine.objects.filter(slug=product.slug).exists():
            product.hidden = True
            product.save(update_fields=["hidden"])
            return Response(
                {
                    "hidden": True,
                    "detail": "This piece is on a past order, so it stays in the books and leaves the shop.",
                }
            )
        product.delete()
        return Response({"deleted": True})
    product, error = write_product(request, product)
    if error:
        return error
    return Response(serialize_admin_product(product))


@api_view(["GET"])
def admin_orders(request):
    refusal = closed(request)
    if refusal:
        return refusal
    orders = Order.objects.prefetch_related("lines").order_by("-created_at", "-id")
    status = text(request.GET.get("status"))
    if status in Order.Status.values:
        orders = orders.filter(status=status)
    return Response(money_rows(orders))


def admin_order_body(order):
    body = serialize_order(order)
    body.update(
        {
            "phone": order.phone,
            "method": order.method,
            "street": order.street,
            "city": order.city,
            "region": order.region,
            "postal": order.postal,
            "created_at": order.created_at.isoformat(),
        }
    )
    return body


@api_view(["GET", "PATCH"])
def admin_order_detail(request, order_id):
    refusal = closed(request)
    if refusal:
        return refusal
    order = Order.objects.prefetch_related("lines").filter(pk=order_id).first()
    if order is None:
        return Response({"detail": "That order is not on the desk."}, status=404)
    if request.method == "PATCH":
        status = text(request.data.get("status"))
        if status not in Order.Status.values:
            return Response({"status": "Choose a status from the list."}, status=400)
        order.status = status
        order.save(update_fields=["status"])
    return Response(admin_order_body(order))


def customer_rows():
    rows = (
        User.objects.filter(is_staff=False)
        .annotate(
            orders_count=Count("orders"),
            spent_cents=Sum("orders__subtotal_cents", filter=~Q(orders__status=Order.Status.CANCELLED)),
            last_order=Max("orders__created_at"),
        )
        .order_by("-last_order", "email")
    )
    return [
        {
            "id": user.id,
            "name": user.first_name or user.email,
            "email": user.email,
            "orders_count": user.orders_count,
            "spent_cents": user.spent_cents or 0,
            "last_order": user.last_order.isoformat() if user.last_order else None,
        }
        for user in rows
    ]


@api_view(["GET"])
def admin_customers(request):
    refusal = closed(request)
    if refusal:
        return refusal
    return Response(
        {
            "customers": customer_rows(),
            "custom_requests": [
                {
                    "id": item.id,
                    "name": item.name,
                    "email": item.email,
                    "want": item.want,
                    "created_at": item.created_at.isoformat(),
                }
                for item in CustomRequest.objects.order_by("-created_at", "-id")[:12]
            ],
            "stitch_list": [
                {"id": item.id, "email": item.email, "created_at": item.created_at.isoformat()}
                for item in StitchSignup.objects.order_by("-created_at", "-id")[:12]
            ],
        }
    )


@api_view(["GET"])
def admin_customer_detail(request, user_id):
    refusal = closed(request)
    if refusal:
        return refusal
    user = User.objects.filter(pk=user_id, is_staff=False).first()
    if user is None:
        return Response({"detail": "That customer is not on the desk."}, status=404)
    orders = Order.objects.filter(customer=user).prefetch_related("lines").order_by("-created_at", "-id")
    return Response(
        {
            "id": user.id,
            "name": user.first_name or user.email,
            "email": user.email,
            "orders": money_rows(orders),
        }
    )


@api_view(["GET"])
def admin_reports(request):
    refusal = closed(request)
    if refusal:
        return refusal
    start, end, orders = report_queryset(request.GET)
    rows = list(orders)
    countable = [order for order in rows if order.status != Order.Status.CANCELLED]
    revenue = sum(order.subtotal_cents for order in countable)
    pieces = sum(sum(line.quantity for line in order.lines.all()) for order in countable)
    daily = {}
    for order in countable:
        day = timezone.localtime(order.created_at).date()
        daily[day] = daily.get(day, 0) + order.subtotal_cents
    series = []
    cursor = start
    while cursor <= end:
        series.append({"date": cursor.isoformat(), "cents": daily.get(cursor, 0)})
        cursor += timedelta(days=1)
    return Response(
        {
            "from": start.isoformat(),
            "to": end.isoformat(),
            "orders_count": len(rows),
            "revenue_cents": revenue,
            "average_cents": round(revenue / len(countable)) if countable else 0,
            "pieces": pieces,
            "revenue": series,
            "orders": money_rows(rows),
        }
    )


@api_view(["POST"])
def upload_product_photo(request):
    refusal = closed(request)
    if refusal:
        return refusal
    uploaded = request.FILES.get("file")
    if uploaded is None:
        return Response({"detail": "Choose a photo first."}, status=400)
    try:
        url = store_photo(uploaded)
    except ShelfError as error:
        return Response({"detail": error.message}, status=error.status)
    return Response({"url": url}, status=201)
