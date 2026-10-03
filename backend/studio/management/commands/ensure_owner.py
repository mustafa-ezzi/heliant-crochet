from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Make sure the studio owner can open the React admin."

    def handle(self, *args, **options):
        email = "studio@helianthook.studio"
        user, created = User.objects.get_or_create(
            username=email,
            defaults={"email": email, "first_name": "Studio", "is_staff": True},
        )
        user.email = email
        user.first_name = user.first_name or "Studio"
        user.is_staff = True
        if created:
            user.set_password("stitch-the-studio")
        user.save()
        self.stdout.write("Studio owner is ready.")
