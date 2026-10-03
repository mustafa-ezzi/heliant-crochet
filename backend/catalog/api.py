from django.db.models import Prefetch
from rest_framework.decorators import api_view
from rest_framework.response import Response

from catalog.models import Product, ProductImage, Variant


def catalog_queryset(*, include_hidden=False):
    products = Product.objects.select_related("category")
    if not include_hidden:
        products = products.filter(hidden=False)
    return (
        products
        .prefetch_related(
            Prefetch("images", queryset=ProductImage.objects.order_by("position", "id")),
            Prefetch("variants", queryset=Variant.objects.order_by("position", "id")),
        )
        .order_by("position", "id")
    )


def serialize_product(product):
    images = list(product.images.all())
    colors = []
    sizes = []
    for variant in product.variants.all():
        if variant.option == Variant.Option.COLOR:
            colors.append({"name": variant.name, "hex": variant.hex})
        else:
            sizes.append(variant.name)
    return {
        "slug": product.slug,
        "name": product.name,
        "meta": product.meta,
        "price_cents": product.price_cents,
        "sticker": product.sticker,
        "image": images[0].src if images else "",
        "images": [image.src for image in images],
        "category": product.category.name,
        "timing": product.timing,
        "description": product.description,
        "fiber": product.fiber,
        "care_short": product.care_short,
        "care": product.care,
        "ships": product.ships,
        "story": product.story,
        "measurements": product.measurements,
        "colors": colors,
        "sizes": sizes,
        "position": product.position,
    }


@api_view(["GET"])
def product_list(request):
    return Response([serialize_product(product) for product in catalog_queryset()])


@api_view(["GET"])
def product_detail(request, slug):
    product = catalog_queryset().filter(slug=slug).first()
    if product is None:
        return Response({"detail": "Not found."}, status=404)
    return Response(serialize_product(product))
