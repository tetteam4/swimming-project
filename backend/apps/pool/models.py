# Create your models here.
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Pool(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=300)
    num_people = models.PositiveBigIntegerField()
    cabinet_number = models.PositiveSmallIntegerField()
    total_pay = models.DecimalField(max_digits=12, decimal_places=2)

    is_calculated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - with  {self.num_people} number of people"


class Shop(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    pool_customer = models.ForeignKey(
        Pool, on_delete=models.PROTECT, related_name="shop_items"
    )

    list = models.JSONField(default=dict)
    total = models.DecimalField(decimal_places=2, max_digits=12)
    is_calculated = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name}"

    def save(self, *args, **kwargs):

        if self.list:
            self.total = sum(Decimal(value) for value in self.list.values())

        else:
            self.total = Decimal("0.00")

        super().save(*args, **kwargs)
