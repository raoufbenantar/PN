from rest_framework import permissions


class IsStaffOrCreateOnly(permissions.BasePermission):
    """
    Custom permission:
    - Anyone (authenticated or not) can CREATE (POST).
    - Only staff users can LIST, RETRIEVE, UPDATE, DELETE.
    """

    def has_permission(self, request, view):
        # Allow anyone to create
        if request.method == 'POST':
            return True
        # Staff-only for everything else
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )

    def has_object_permission(self, request, view, obj):
        # Staff can do anything on individual objects
        if request.user and request.user.is_authenticated and request.user.is_staff:
            return True
        # Non-staff cannot access individual objects at all
        return False
