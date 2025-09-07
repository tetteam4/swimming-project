import django_filters

from .models import Pool, Shop


class PoolFilter(django_filters.FilterSet):
    class Meta:
        model = Pool
        fields = "__all__"


class ShopFilter(django_filters.FilterSet):
    class Meta:
        model = Shop
        fields = "__all__"
        exclude = ["list"]
