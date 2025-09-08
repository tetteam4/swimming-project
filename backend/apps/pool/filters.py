import django_filters

from .models import Pool, Shop


class PoolFilter(django_filters.FilterSet):
    class Meta:
        model = Pool

        exclude = ["rent", "tools"]


class ShopFilter(django_filters.FilterSet):
    class Meta:
        model = Shop
        exclude = ["list"]
