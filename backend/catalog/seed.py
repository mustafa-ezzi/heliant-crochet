from catalog.models import Category, Product, ProductImage, Variant

CATEGORIES = ["Wear", "Home", "Baby", "Custom"]

PRODUCTS = [
    {
        "slug": "daisy-day-bag",
        "name": "Daisy day bag",
        "meta": "cotton blend · one of a kind",
        "price_cents": 8400,
        "sticker": "New drop",
        "image": "/images/heliant-hero-bag.jpg",
        "category": "Wear",
        "timing": "ready to ship",
        "description": "A shoulder bag with a daisy worked into the front. It holds a book, a wallet, and the small things you reach for all day.",
        "fiber": "Cotton blend",
        "care_short": "Hand wash, dry flat",
        "care": "Hand wash cool, reshape gently, and dry flat. Keep it out of the dryer.",
        "ships": "Delivery in 10–15 working days",
        "story": "This bag started as a sample on the table and stayed, because the daisy sat just right. The piece in the photo is the one you are looking at.",
        "measurements": "Day is about 28 cm wide and 22 cm tall, with a strap that sits at the hip. Mini is a smaller body on the same strap.",
        "colors": [
            {"name": "Lilac", "hex": "#c9a6e0"},
            {"name": "Cream", "hex": "#f4e4d4"},
            {"name": "Rose", "hex": "#e7a3c4"},
        ],
        "sizes": ["Mini", "Day"],
    },
    {
        "slug": "petal-bucket-hat",
        "name": "Petal bucket hat",
        "meta": "soft cotton · made to order",
        "price_cents": 5800,
        "sticker": "Made to order",
        "image": "/images/crochet-bucket-hat.jpg",
        "category": "Wear",
        "timing": "stitched when you order",
        "description": "A soft bucket hat with a petal brim. It shades a walk and folds into a bag when you come indoors.",
        "fiber": "Soft cotton",
        "care_short": "Hand wash, dry flat",
        "care": "Hand wash cool, reshape the brim, and dry flat.",
        "ships": "Delivery in 10–15 working days",
        "story": "The brim is worked a little wider than a usual bucket, so it reads as a petal instead of a visor. Each hat is stitched after you choose the size.",
        "measurements": "S fits about 54–55 cm, M about 56–57 cm, and L about 58–59 cm. The brim is about 7 cm.",
        "colors": [
            {"name": "Blush", "hex": "#f3c6d4"},
            {"name": "Lilac", "hex": "#c9a6e0"},
            {"name": "Butter", "hex": "#f6e3a1"},
        ],
        "sizes": ["S", "M", "L"],
    },
    {
        "slug": "flower-patch-cushion",
        "name": "Flower patch cushion",
        "meta": "wool blend · ready to ship",
        "price_cents": 7200,
        "sticker": "Last one",
        "image": "/images/crochet-cushion.jpg",
        "category": "Home",
        "timing": "ready to ship",
        "description": "A square cushion with a small flower patch on one face. It sits on a chair or at the end of a sofa.",
        "fiber": "Wool blend",
        "care_short": "Spot clean or hand wash",
        "care": "Spot clean, or hand wash cool and dry flat. The wool will bloom a little as it dries.",
        "ships": "Delivery in 10–15 working days",
        "story": "The flower is a separate patch, stitched on after the cushion face is finished. This is the last one in this colorway.",
        "measurements": "16 in is 40 cm square. 18 in is 46 cm square. A plain insert is not included.",
        "colors": [
            {"name": "Lilac", "hex": "#c9a6e0"},
            {"name": "Cream", "hex": "#f4e4d4"},
        ],
        "sizes": ["16 in", "18 in"],
    },
    {
        "slug": "lilac-market-tote",
        "name": "Lilac market tote",
        "meta": "recycled cotton · custom",
        "price_cents": 7600,
        "sticker": "Custom",
        "image": "/images/crochet-studio.jpg",
        "category": "Custom",
        "timing": "stitched when you order",
        "description": "A market tote worked in the colors you choose. The body is open, the handles reach a shoulder, and no two are the same stitch for stitch.",
        "fiber": "Recycled cotton",
        "care_short": "Hand wash, dry flat",
        "care": "Hand wash cool, reshape gently, and dry flat.",
        "ships": "Delivery in 10–15 working days",
        "story": "Tell us the colors and the size, and the tote is stitched for that note. The studio photo is a pair of hands at the table, which is where yours will start.",
        "measurements": "Market is about 38 cm wide and 36 cm tall. Weekender is a deeper body, about 42 cm wide and 40 cm tall.",
        "colors": [
            {"name": "Lilac", "hex": "#c9a6e0"},
            {"name": "Sage", "hex": "#c5d6b0"},
            {"name": "Cream", "hex": "#f4e4d4"},
        ],
        "sizes": ["Market", "Weekender"],
    },
]


def seed_catalog():
    categories = {}
    for position, name in enumerate(CATEGORIES):
        category, _ = Category.objects.update_or_create(
            slug=name.lower(),
            defaults={"name": name, "position": position},
        )
        categories[name] = category

    for position, item in enumerate(PRODUCTS):
        product, _ = Product.objects.update_or_create(
            slug=item["slug"],
            defaults={
                "category": categories[item["category"]],
                "name": item["name"],
                "meta": item["meta"],
                "price_cents": item["price_cents"],
                "sticker": item["sticker"],
                "timing": item["timing"],
                "description": item["description"],
                "fiber": item["fiber"],
                "care_short": item["care_short"],
                "care": item["care"],
                "ships": item["ships"],
                "story": item["story"],
                "measurements": item["measurements"],
                "position": position,
            },
        )
        product.images.all().delete()
        product.variants.all().delete()
        ProductImage.objects.create(product=product, src=item["image"], alt=item["name"], position=0)
        for index, color in enumerate(item["colors"]):
            Variant.objects.create(
                product=product,
                option=Variant.Option.COLOR,
                name=color["name"],
                hex=color["hex"],
                position=index,
            )
        for index, size in enumerate(item["sizes"]):
            Variant.objects.create(
                product=product,
                option=Variant.Option.SIZE,
                name=size,
                position=index,
            )
