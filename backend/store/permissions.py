from rest_framework import permissions


class IsStaffOrCreateOnly(permissions.BasePermission):
    """
    - Anyone (authenticated or not) can CREATE an order (POST).
    - Only staff users can LIST, RETRIEVE, UPDATE, DELETE.
    Mirrors inquiries.permissions.IsStaffOrCreateOnly.
    """

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )

    def has_object_permission(self, request, view, obj):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )
