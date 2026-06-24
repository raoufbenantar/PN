from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend

from .filters import ExpeditionFilter
from .models import Expedition
from .serializers import (
    ExpeditionCreateSerializer,
    ExpeditionDetailSerializer,
    ExpeditionListSerializer,
)


class MaxLengthSearchFilter(SearchFilter):
    """SearchFilter that rejects queries longer than 200 characters (DoS guard)."""
    MAX_SEARCH_LENGTH = 200

    def filter_queryset(self, request, queryset, view):
        search_param = request.query_params.get(self.search_param, '')
        if len(search_param) > self.MAX_SEARCH_LENGTH:
            return queryset.none()  # return empty, don't hit the DB
        return super().filter_queryset(request, queryset, view)


class ExpeditionViewSet(viewsets.ModelViewSet):
    """CRUD endpoint for expeditions. Public read, admin-only write."""
    queryset = Expedition.objects.filter(is_published=True)
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, MaxLengthSearchFilter, OrderingFilter]
    filterset_class = ExpeditionFilter
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['title', 'price_dzd', 'duration_days', 'created_at']

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return []  # public read
        return [IsAdminUser()]

    def get_queryset(self):
        qs = super().get_queryset()
        # Staff see ALL expeditions (published + unpublished)
        if self.request.user.is_staff:
            return Expedition.objects.all()
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return ExpeditionCreateSerializer
        if self.action == 'list':
            return ExpeditionListSerializer
        return ExpeditionDetailSerializer
