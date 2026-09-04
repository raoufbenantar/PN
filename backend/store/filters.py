import django_filters

from .models import Order, Product


class ProductFilter(django_filters.FilterSet):
    """Explicit filter allowlist for product catalogue."""
    category = django_filters.CharFilter(lookup_expr='exact')
    is_active = django_filters.BooleanFilter(lookup_expr='exact')

    class Meta:
        model = Product
        fields = ['category', 'is_active']


class OrderFilter(django_filters.FilterSet):
    """Explicit filter allowlist for order management (staff-only)."""
    status = django_filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = Order
        fields = ['status']
