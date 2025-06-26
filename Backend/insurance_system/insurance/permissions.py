from rest_framework.permissions import BasePermission

class IsCompanyUserOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or getattr(request.user, 'is_superadmin', False):
            return True
        return obj.company == request.user.company
