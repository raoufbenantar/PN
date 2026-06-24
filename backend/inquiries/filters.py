import django_filters

from .models import Inquiry


class InquiryFilter(django_filters.FilterSet):
    """Explicit filter allowlist for inquiry management (staff-only)."""
    status = django_filters.CharFilter(lookup_expr='exact')
    expedition = django_filters.NumberFilter(lookup_expr='exact')

    class Meta:
        model = Inquiry
        fields = ['status', 'expedition']
