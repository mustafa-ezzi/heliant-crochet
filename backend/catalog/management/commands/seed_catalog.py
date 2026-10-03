from django.core.management.base import BaseCommand

from catalog.seed import seed_catalog


class Command(BaseCommand):
    help = "Load the four Heliant Hook pieces into PostgreSQL."

    def handle(self, *args, **options):
        seed_catalog()
        self.stdout.write(self.style.SUCCESS("Catalog seeded."))
