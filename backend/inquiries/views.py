from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.throttling import ScopedRateThrottle
from django_filters.rest_framework import DjangoFilterBackend

from .filters import InquiryFilter
from .models import Inquiry
from .permissions import IsStaffOrCreateOnly
from .serializers import InquirySerializer


class InquiryViewSet(viewsets.ModelViewSet):
    """
    Public can only CREATE (POST).
    Staff can LIST, RETRIEVE, UPDATE, DELETE.

    Throttled at 3 requests/hour for anonymous POST to prevent spam.
    """
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [IsStaffOrCreateOnly]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'inquiry_create'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = InquiryFilter
    search_fields = ['name', 'email', 'phone', 'message']
    ordering_fields = ['created_at', 'status']

    # ── Hardened HTTP method allowlist ─────────────────────────────
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_throttles(self):
        """Only throttle POST (create); staff operations are unrestricted."""
        if self.action == 'create':
            return [throttle() for throttle in self.throttle_classes]
        return []
