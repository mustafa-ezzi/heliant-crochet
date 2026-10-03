import random
import re

from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response

from catalog.models import Product, ProductImage
from studio.models import ContactMessage, CustomRequest, Order, OrderLine, StitchSignup, StudioSettings
EMAIL = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def text(value):
    return str(value or "").strip()


def serialize_order(order):
    return {
        "id": order.id,
        "number": order.number,
        "status": order.status,
        "sample": order.sample,
        "name": order.name,
        "email": order.email,
        "note": order.note,
        "gift_wrap": order.gift_wrap,
        "gift_wrap_cents": order.gift_wrap_cents,
        "subtotal_cents": order.subtotal_cents,
        "lines": [
            {
                "slug": line.slug,
                "name": line.name,
                "image": line.image,
                "color": line.color,
                "size": line.size,
                "quantity": line.quantity,
                "unit_price_cents": line.unit_price_cents,
            }
            for line in order.lines.all()
        ],
    }


def fresh_number():
    for _ in range(12):
        number = f"HH-{random.randint(1000, 9999)}"
        if not Order.objects.filter(number=number).exists():
            return number
    return f"HH-{Order.objects.count() + 10000}"


@api_view(["GET"])
def studio_settings(request):
    settings = StudioSettings.load()
    return Response(
        {
            "announcement": settings.announcement,
            "gift_wrap_cents": settings.gift_wrap_cents,
        }
    )


@api_view(["POST"])
def create_order(request):
    body = request.data
    name = text(body.get("name"))
    email = text(body.get("email"))
    phone = text(body.get("phone"))
    method = text(body.get("method")) or Order.Method.SHIP
    note = text(body.get("note"))
    gift_wrap = bool(body.get("gift_wrap"))
    lines = body.get("lines")
    errors = {}
    if not name:
        errors["name"] = "Add the name for this order."
    if not EMAIL.match(email):
        errors["email"] = "That email does not look complete."
    if len("".join(ch for ch in phone if ch.isdigit())) < 7:
        errors["phone"] = "Add a phone number we can reach."
    if method not in {Order.Method.SHIP, Order.Method.PICKUP}:
        errors["method"] = "Choose shipping or pickup."
    if not isinstance(lines, list) or not lines:
        errors["lines"] = "The bag is empty."
    street = text(body.get("street"))
    city = text(body.get("city"))
    region = text(body.get("region"))
    postal = text(body.get("postal"))
    if method == Order.Method.SHIP:
        if not street:
            errors["street"] = "Add a street so we know where to send it."
        if not city:
            errors["city"] = "Add a city."
        if not region:
            errors["region"] = "Add a state or region."
        if not postal:
            errors["postal"] = "Add a postal code."
    if errors:
        return Response(errors, status=400)

    prepared = []
    goods = 0
    for raw in lines:
        slug = text(raw.get("slug"))
        product = Product.objects.filter(slug=slug).first()
        if product is None:
            return Response({"detail": "One piece is no longer on the table."}, status=400)
        try:
            quantity = int(raw.get("quantity"))
        except (TypeError, ValueError):
            quantity = 0
        if quantity < 1 or quantity > 20:
            return Response({"detail": "Choose a quantity between 1 and 20."}, status=400)
        image = ProductImage.objects.filter(product=product).order_by("position", "id").first()
        prepared.append(
            {
                "slug": product.slug,
                "name": product.name,
                "image": image.src if image else "",
                "color": text(raw.get("color")) or "Lilac",
                "size": text(raw.get("size")) or "One size",
                "quantity": quantity,
                "unit_price_cents": product.price_cents,
            }
        )
        goods += product.price_cents * quantity

    gift_cents = StudioSettings.load().gift_wrap_cents if gift_wrap else 0
    with transaction.atomic():
        order = Order.objects.create(
            number=fresh_number(),
            status=Order.Status.PENDING,
            name=name,
            email=email,
            phone=phone,
            method=method,
            street=street,
            city=city,
            region=region,
            postal=postal,
            note=note,
            gift_wrap=gift_wrap,
            gift_wrap_cents=gift_cents,
            subtotal_cents=goods + gift_cents,
            sample=True,
            customer=request.user if getattr(request.user, "is_authenticated", False) else None,
        )
        OrderLine.objects.bulk_create(OrderLine(order=order, **line) for line in prepared)
    order = Order.objects.prefetch_related("lines").get(pk=order.pk)
    return Response(serialize_order(order), status=201)


@api_view(["GET"])
def order_detail(request, order_id):
    order = Order.objects.prefetch_related("lines").filter(pk=order_id).first()
    if order is None:
        return Response({"detail": "Not found."}, status=404)
    return Response(serialize_order(order))


@api_view(["POST"])
def create_contact(request):
    body = request.data
    name = text(body.get("name"))
    email = text(body.get("email"))
    topic = text(body.get("topic")) or ContactMessage.Topic.HELLO
    message = text(body.get("message"))
    errors = {}
    if not name:
        errors["name"] = "Add your name so we know who to write."
    if not EMAIL.match(email):
        errors["email"] = "That email does not look complete."
    if topic not in {choice.value for choice in ContactMessage.Topic}:
        errors["topic"] = "Choose a topic."
    if not message:
        errors["message"] = "Add a note so we know how to help."
    if errors:
        return Response(errors, status=400)
    note = ContactMessage.objects.create(name=name, email=email, topic=topic, message=message)
    return Response({"id": note.id}, status=201)


@api_view(["POST"])
def create_custom(request):
    body = request.data
    name = text(body.get("name"))
    email = text(body.get("email"))
    want = text(body.get("want"))
    errors = {}
    if not name:
        errors["name"] = "Add your name so we know who to write."
    if not EMAIL.match(email):
        errors["email"] = "That email does not look complete."
    if not want:
        errors["want"] = "Tell us what you would like made."
    if errors:
        return Response(errors, status=400)
    request_row = CustomRequest.objects.create(
        name=name,
        email=email,
        want=want,
        colors=text(body.get("colors")),
        size=text(body.get("size")),
        timing=text(body.get("timing")),
        photo=text(body.get("photo")),
    )
    return Response({"id": request_row.id}, status=201)


@api_view(["POST"])
def create_stitch(request):
    email = text(request.data.get("email"))
    if not EMAIL.match(email):
        return Response({"email": "That email does not look complete."}, status=400)
    signup = StitchSignup.objects.create(email=email)
    return Response({"id": signup.id}, status=201)
