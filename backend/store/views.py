from django.db import transaction
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAdminUser
from rest_framework.throttling import ScopedRateThrottle

from .filters import OrderFilter, ProductFilter
from .models import Order, Product, ProductImage, ProductVariant
from .permissions import IsStaffOrCreateOnly
from .serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    ProductImageSerializer,
    ProductSerializer,
    ProductVariantSerializer,
    ProductWriteSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    """Public read, admin write. Detail lookup by slug."""
    queryset = Product.objects.filter(is_active=True)
    lookup_field = 'slug'
    permission_classes = [IsAdminUser]
    # Public read / admin write
    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return []
        return [IsAdminUser()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_staff:
            return Product.objects.all()
        return qs.prefetch_related('images', 'variants')

    def get_serializer_class(self):
        if self.action == 'create':
            return ProductWriteSerializer
        if self.action in ('update', 'partial_update'):
            return ProductWriteSerializer
        return ProductSerializer

    # Public catalog filtering + search
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']


class ProductImageViewSet(viewsets.ModelViewSet):
    """Admin-only CRUD for product gallery images."""
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product']


class ProductVariantViewSet(viewsets.ModelViewSet):
    """Admin-only CRUD for product variants + stock."""
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product']


class OrderViewSet(viewsets.ModelViewSet):
    """
    Public can CREATE (POST) a new order (throttled). Staff can LIST, RETRIEVE,
    UPDATE (confirm/cancel), DELETE. Mirrors inquiries.InquiryViewSet.
    """
    queryset = Order.objects.prefetch_related('items__variant__product').all()
    serializer_class = OrderSerializer
    permission_classes = [IsStaffOrCreateOnly]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'order_create'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = OrderFilter
    search_fields = ['full_name', 'phone_number']
    ordering_fields = ['created_at', 'status']
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def get_throttles(self):
        """Only throttle POST (create); staff operations are unrestricted."""
        if self.action == 'create':
            return [throttle() for throttle in self.throttle_classes]
        return []

    def perform_create(self, serializer):
        serializer.save()  # create() handles the atomic stock decrement

    def perform_update(self, serializer):
        instance = serializer.instance
        new_status = serializer.validated_data.get('status', instance.status)

        # Restore stock exactly once when the order transitions INTO 'cancelled'
        # (from 'new' or 'confirmed'). The stock_restored guard makes this
        # idempotent — re-saving an already-cancelled order won't double-restock.
        became_cancelled = (
            new_status == 'cancelled'
            and instance.status != 'cancelled'
            and not instance.stock_restored
        )

        with transaction.atomic():
            order = serializer.save()
            if became_cancelled:
                for item in order.items.select_related('variant'):
                    ProductVariant.objects.filter(pk=item.variant_id).update(
                        stock=F('stock') + item.quantity
                    )
                order.stock_restored = True
                order.save(update_fields=['stock_restored'])
