from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=40, unique=True)
    slug = models.SlugField(max_length=40, unique=True)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position", "name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, related_name="products", on_delete=models.PROTECT)
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=80, unique=True)
    meta = models.CharField(max_length=160)
    price_cents = models.PositiveIntegerField()
    sticker = models.CharField(max_length=40, blank=True)
    timing = models.CharField(max_length=80)
    description = models.TextField()
    fiber = models.CharField(max_length=80)
    care_short = models.CharField(max_length=80)
    care = models.TextField()
    ships = models.CharField(max_length=80)
    story = models.TextField()
    measurements = models.TextField()
    position = models.PositiveSmallIntegerField(default=0)
    hidden = models.BooleanField(default=False)

    class Meta:
        ordering = ["position", "name"]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    src = models.TextField()
    alt = models.CharField(max_length=160, blank=True)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]


class Variant(models.Model):
    class Option(models.TextChoices):
        COLOR = "color", "Color"
        SIZE = "size", "Size"

    product = models.ForeignKey(Product, related_name="variants", on_delete=models.CASCADE)
    option = models.CharField(max_length=16, choices=Option.choices)
    name = models.CharField(max_length=40)
    hex = models.CharField(max_length=7, blank=True)
    stock = models.PositiveIntegerField(null=True, blank=True)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]
