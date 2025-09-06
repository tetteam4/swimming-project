from decimal import Decimal

from rest_framework import serializers

from .models import Pool, Shop


class ShopSerializer(serializers.ModelSerializer):
    total = serializers.CharField(read_only=True)

    class Meta:
        model = Shop
        fields = ["id", "pool_customer", "list", "is_calculated", "total"]


class PoolSerializer(serializers.ModelSerializer):
    shop_items = ShopSerializer(many=True, read_only=True)
    total_shop = serializers.SerializerMethodField()
    totals = serializers.SerializerMethodField()

    class Meta:
        model = Pool
        fields = [
            "id",
            "name",
            "num_people",
            "cabinet_number",
            "total_pay",
            "is_calculated",
            "shop_items",
            "total_shop",
            "totals",
        ]

    def get_total_shop(self, obj):
        total = Decimal("0.00")
        for item in obj.shop_items.all():
            # Ensure item.total is treated as Decimal
            total += Decimal(item.total)
        return str(total)

    def get_totals(self, obj):
        total_shop = Decimal(self.get_total_shop(obj))
        total_pay = Decimal(obj.total_pay)
        return str(total_pay + total_shop)
