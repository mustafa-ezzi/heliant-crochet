from django.contrib.auth.models import User
from django.db import models


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        STITCHING = "stitching", "Stitching"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    class Method(models.TextChoices):
        SHIP = "ship", "Ship"
        PICKUP = "pickup", "Local pickup"

    number = models.CharField(max_length=16, unique=True)
    customer = models.ForeignKey(User, related_name="orders", null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40)
    method = models.CharField(max_length=16, choices=Method.choices)
    street = models.CharField(max_length=160, blank=True)
    city = models.CharField(max_length=80, blank=True)
    region = models.CharField(max_length=80, blank=True)
    postal = models.CharField(max_length=20, blank=True)
    note = models.TextField(blank=True)
    gift_wrap = models.BooleanField(default=False)
    gift_wrap_cents = models.PositiveIntegerField(default=0)
    subtotal_cents = models.PositiveIntegerField()
    sample = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.number


class OrderLine(models.Model):
    order = models.ForeignKey(Order, related_name="lines", on_delete=models.CASCADE)
    slug = models.SlugField(max_length=80)
    name = models.CharField(max_length=120)
    image = models.CharField(max_length=255, blank=True)
    color = models.CharField(max_length=40)
    size = models.CharField(max_length=40)
    quantity = models.PositiveIntegerField()
    unit_price_cents = models.PositiveIntegerField()


class ContactMessage(models.Model):
    class Topic(models.TextChoices):
        ORDER = "order", "Order"
        CUSTOM = "custom", "Custom"
        WHOLESALE = "wholesale", "Wholesale"
        HELLO = "hello", "Hello"

    name = models.CharField(max_length=120)
    email = models.EmailField()
    topic = models.CharField(max_length=20, choices=Topic.choices, default=Topic.HELLO)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class CustomRequest(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    want = models.TextField()
    colors = models.CharField(max_length=160, blank=True)
    size = models.CharField(max_length=160, blank=True)
    timing = models.CharField(max_length=160, blank=True)
    photo = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


SHOP_FONTS = ("studio", "fraunces", "nunito", "playfair", "cormorant", "quicksand")


class StudioSettings(models.Model):
    announcement = models.CharField(
        max_length=180,
        default="Made to order in small batches · delivery in 10–15 working days",
    )
    gift_wrap_cents = models.PositiveIntegerField(default=600)
    font = models.CharField(max_length=32, default="studio")

    @classmethod
    def load(cls):
        settings, _created = cls.objects.get_or_create(pk=1)
        return settings


class StitchSignup(models.Model):
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
