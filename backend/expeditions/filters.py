import django_filters

from .models import Expedition


class ExpeditionFilter(django_filters.FilterSet):
    """Explicit filter allowlist — only these fields are queryable."""
    category = django_filters.CharFilter(lookup_expr='exact')
    difficulty = django_filters.CharFilter(lookup_expr='exact')
    location = django_filters.CharFilter(lookup_expr='icontains')
    min_price = django_filters.NumberFilter(
        field_name='price_dzd', lookup_expr='gte'
    )
    max_price = django_filters.NumberFilter(
        field_name='price_dzd', lookup_expr='lte'
    )
    min_duration = django_filters.NumberFilter(
        field_name='duration_days', lookup_expr='gte'
    )

    class Meta:
        model = Expedition
        fields = ['category', 'difficulty', 'location']
