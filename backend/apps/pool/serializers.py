from decimal import Decimal, InvalidOperation

from rest_framework import serializers

from .models import Pool, Shop


class ShopSerializer(serializers.ModelSerializer):
    total = serializers.CharField(read_only=True)

    class Meta:
        model = Shop
        fields = ["id", "pool_customer", "list", "is_calculated", "total", "created_at"]


class PoolSerializer(serializers.ModelSerializer):
    shop_items = ShopSerializer(many=True, read_only=True)
    total_shop = serializers.SerializerMethodField()
    totals = serializers.SerializerMethodField()
    tools = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Pool
        fields = [
            "id",
            "name",
            "num_people",
            "cabinet_number",
            "total_pay",
            "is_calculated",
            "rent",
            "tools",
            "shop_items",
            "total_shop",
            "totals",
            "created_at",
        ]

    def get_total_shop(self, obj):
        total = Decimal("0.00")
        for item in obj.shop_items.all():
            total += Decimal(item.total)
        return str(total)

    def get_totals(self, obj):
        total_shop = Decimal(self.get_total_shop(obj))
        total_pay = Decimal(obj.total_pay)
        rent_total = Decimal("0.00")

        # Safely sum all values in rent field
        if isinstance(obj.rent, dict):
            for value in obj.rent.values():
                try:
                    rent_total += Decimal(value)
                except (TypeError, ValueError, InvalidOperation):
                    continue  # skip if value is not numeric

        grand_total = total_pay + total_shop + rent_total
        return str(grand_total)
