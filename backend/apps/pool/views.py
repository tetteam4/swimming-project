from django.shortcuts import get_object_or_404, render
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import PoolFilter, ShopFilter
from .models import Pool, Shop
from .pagination import CustomerUserPagination
from .serializers import PoolSerializer, ShopSerializer


class PoolViewSet(viewsets.ModelViewSet):
    serializer_class = PoolSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomerUserPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = PoolFilter

    def get_queryset(self):
        return Pool.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShopViewSet(viewsets.ModelViewSet):
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomerUserPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ShopFilter

    def get_queryset(self):
        return Shop.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShopDetailAPIView(APIView):
    def patch(self, request, pk):
        shop = get_object_or_404(Shop, pk=pk)
        serializer = ShopSerializer(shop, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
