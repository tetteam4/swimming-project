import random
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from apps.pool.models import Pool, Shop


User = get_user_model()


class Command(BaseCommand):
    help = "Generate 500 test data entries for Pool and Shop models"

    def handle(self, *args, **kwargs):
        users = list(User.objects.all())
        if not users:
            self.stdout.write(self.style.ERROR("No users found. Please create some users first."))
            return

        # Create 500 Pool instances
        pools = []
        for i in range(500):
            user = random.choice(users)
            pool = Pool(
                user=user,
                name=f"Pool Test {i+1}",
                num_people=random.randint(1, 100),
                cabinet_number=random.randint(1, 50),
                total_pay=Decimal(random.uniform(1000, 10000)).quantize(Decimal("0.01")),
            )
            pools.append(pool)
        Pool.objects.bulk_create(pools)
        self.stdout.write(self.style.SUCCESS("Created 500 Pool entries."))

        # Refresh pools list after bulk_create
        pools = list(Pool.objects.all())

        # Create 500 Shop instances
        for i in range(500):
            user = random.choice(users)
            pool_customer = random.choice(pools)
            items = {
                f"item_{j}": str(Decimal(random.uniform(1, 100)).quantize(Decimal("0.01")))
                for j in range(random.randint(1, 5))
            }
            shop = Shop(
                user=user,
                pool_customer=pool_customer,
                list=items,
            )
            # Save each Shop to calculate total in save()
            shop.save()

        self.stdout.write(self.style.SUCCESS("Created 500 Shop entries."))
