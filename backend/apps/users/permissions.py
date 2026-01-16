"""
Custom permissions and roles for the Ripple Fox application.
"""
from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
from rest_framework import permissions

# Role names
ROLE_CEO = 'ceo'
ROLE_CTO = 'cto'
ROLE_CFO = 'cfo'
ROLE_HR = 'hr'
ROLE_IT_ADMIN = 'it_admin'
ROLE_IT_SUPPORT = 'it_support'
ROLE_MANAGER = 'manager'
ROLE_STAFF = 'staff'
ROLE_ADMIN_STAFF = 'admin_staff'

# Department names
DEPARTMENT_IT = 'it'
DEPARTMENT_HR = 'hr'
DEPARTMENT_FINANCE = 'finance'
DEPARTMENT_ADMIN = 'administration'
DEPARTMENT_OPERATIONS = 'operations'

# Permission codenames
# User permissions
CAN_VIEW_USER = 'can_view_user'
CAN_ADD_USER = 'can_add_user'
CAN_EDIT_USER = 'can_edit_user'
CAN_DELETE_USER = 'can_delete_user'
CAN_MANAGE_USERS = 'can_manage_users'

# Department permissions
CAN_MANAGE_DEPARTMENT = 'can_manage_department'

# System settings permissions
CAN_MANAGE_SETTINGS = 'can_manage_settings'

# Report permissions
CAN_VIEW_REPORTS = 'can_view_reports'
CAN_GENERATE_REPORTS = 'can_generate_reports'
CAN_EXPORT_REPORTS = 'can_export_reports'

# Role to permissions mapping
ROLE_PERMISSIONS = {
    ROLE_CEO: [
        CAN_VIEW_USER, CAN_ADD_USER, CAN_EDIT_USER, CAN_DELETE_USER, CAN_MANAGE_USERS,
        CAN_MANAGE_DEPARTMENT, CAN_MANAGE_SETTINGS,
        CAN_VIEW_REPORTS, CAN_GENERATE_REPORTS, CAN_EXPORT_REPORTS
    ],
    ROLE_CTO: [
        CAN_VIEW_USER, CAN_ADD_USER, CAN_EDIT_USER, CAN_MANAGE_USERS,
        CAN_MANAGE_DEPARTMENT, CAN_MANAGE_SETTINGS,
        CAN_VIEW_REPORTS, CAN_GENERATE_REPORTS, CAN_EXPORT_REPORTS
    ],
    ROLE_CFO: [
        CAN_VIEW_USER, CAN_VIEW_REPORTS, CAN_GENERATE_REPORTS, CAN_EXPORT_REPORTS
    ],
    ROLE_HR: [
        CAN_VIEW_USER, CAN_ADD_USER, CAN_EDIT_USER, CAN_MANAGE_USERS,
        CAN_VIEW_REPORTS, CAN_GENERATE_REPORTS
    ],
    ROLE_IT_ADMIN: [
        CAN_VIEW_USER, CAN_ADD_USER, CAN_EDIT_USER, CAN_DELETE_USER, CAN_MANAGE_USERS,
        CAN_MANAGE_SETTINGS, CAN_VIEW_REPORTS
    ],
    ROLE_IT_SUPPORT: [
        CAN_VIEW_USER, CAN_EDIT_USER
    ],
    ROLE_MANAGER: [
        CAN_VIEW_USER, CAN_EDIT_USER,
        CAN_VIEW_REPORTS
    ],
    ROLE_STAFF: [
        CAN_VIEW_USER
    ],
    ROLE_ADMIN_STAFF: [
        CAN_VIEW_USER, CAN_ADD_USER, CAN_EDIT_USER, CAN_MANAGE_USERS,
        CAN_VIEW_REPORTS
    ]
}

def create_groups():
    """Create all role groups with their respective permissions."""
    # Create content type for custom permissions
    content_type = ContentType.objects.get_for_model(Group)
    
    # Create all permissions
    for codename, name in [
        (CAN_VIEW_USER, 'Can view user'),
        (CAN_ADD_USER, 'Can add user'),
        (CAN_EDIT_USER, 'Can edit user'),
        (CAN_DELETE_USER, 'Can delete user'),
        (CAN_MANAGE_USERS, 'Can manage users'),
        (CAN_MANAGE_DEPARTMENT, 'Can manage department'),
        (CAN_MANAGE_SETTINGS, 'Can manage system settings'),
        (CAN_VIEW_REPORTS, 'Can view reports'),
        (CAN_GENERATE_REPORTS, 'Can generate reports'),
        (CAN_EXPORT_REPORTS, 'Can export reports'),
    ]:
        Permission.objects.get_or_create(
            codename=codename,
            content_type=content_type,
            defaults={'name': name}
        )
    
    # Create role groups and assign permissions
    for role_name, permissions in ROLE_PERMISSIONS.items():
        group, created = Group.objects.get_or_create(name=role_name.upper())
        if created or True:  # Always update permissions
            # Clear existing permissions
            group.permissions.clear()
            # Add new permissions
            for perm_codename in permissions:
                try:
                    perm = Permission.objects.get(
                        codename=perm_codename,
                        content_type=content_type
                    )
                    group.permissions.add(perm)
                except Permission.DoesNotExist:
                    continue
    
    return Group.objects.all()

def get_user_roles(user):
    """Get all roles for a user."""
    return [group.name.lower() for group in user.groups.all()]

def has_role(user, role_name):
    """Check if user has the specified role."""
    return user.groups.filter(name__iexact=role_name).exists()

def has_any_role(user, role_names):
    """Check if user has any of the specified roles."""
    return user.groups.filter(name__in=[r.upper() for r in role_names]).exists()

def has_permission(user, permission_codename):
    """Check if user has the specified permission."""
    return user.has_perm(f'auth.{permission_codename}') or user.is_superuser

# REST Framework Permission Classes
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user or request.user.is_staff

class CanManageUsers(permissions.BasePermission):
    """
    Custom permission to check if user can manage other users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (
                request.user.is_staff or 
                has_permission(request.user, CAN_MANAGE_USERS)
            )
        )

class CanViewReports(permissions.BasePermission):
    """
    Custom permission to check if user can view reports.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (
                request.user.is_staff or 
                has_permission(request.user, CAN_VIEW_REPORTS)
            )
        )

class CanManageSettings(permissions.BasePermission):
    """
    Custom permission to check if user can manage settings.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (
                request.user.is_staff or 
                has_permission(request.user, CAN_MANAGE_SETTINGS)
            )
        )
