from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PoolViewSet, ShopDetailAPIView, ShopViewSet

router = DefaultRouter()
router.register("pools", PoolViewSet, basename="pool")
router.register("shops", ShopViewSet, basename="shop")


urlpatterns = [
    path("api/", include(router.urls)),
    path("shops/<int:pk>/", ShopDetailAPIView.as_view(), name="shop-detail"),
]
