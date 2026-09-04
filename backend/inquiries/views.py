from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from django_filters.rest_framework import DjangoFilterBackend

from .filters import InquiryFilter
from .models import Inquiry
from .permissions import IsStaffOrCreateOnly
from .serializers import InquirySerializer, InquiryTicketSerializer


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

    def get_permissions(self):
        # The ticket action is readable by any authenticated user; everything
        # else keeps the default staff-or-create policy.
        if self.action == 'ticket':
            return [IsAuthenticated()]
        return super().get_permissions()

    @action(detail=True, methods=['get'], url_path='ticket')
    def ticket(self, request, pk=None):
        """
        Return a computed 'selfie ticket' for a CONFIRMED inquiry.
        Returns 404 (with a clear detail message) when the inquiry is not
        confirmed yet, to avoid leaking whether the id exists.
        """
        inquiry = get_object_or_404(Inquiry, pk=pk)
        if inquiry.status != 'confirmed':
            return Response(
                {'detail': 'No ticket available yet — this inquiry is not confirmed.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = InquiryTicketSerializer(inquiry, context={'request': request})
        data = serializer.data
        if inquiry.expedition is None:
            data['expedition_title'] = None
        return Response(data)
