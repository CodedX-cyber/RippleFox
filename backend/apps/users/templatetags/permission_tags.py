"""
Template tags for checking permissions in templates.
"""
from django import template
from django.contrib.auth import get_user_model
from apps.users.permissions import has_permission as check_permission

register = template.Library()
User = get_user_model()

@register.filter
def has_permission(user, permission_codename):
    """Check if user has the specified permission."""
    if not user.is_authenticated:
        return False
    return check_permission(user, permission_codename)

@register.filter
def has_role(user, role_name):
    """Check if user has the specified role."""
    if not user.is_authenticated:
        return False
    return user.groups.filter(name__iexact=role_name.upper()).exists()

@register.filter
def has_any_role(user, role_names):
    """Check if user has any of the specified roles."""
    if not user.is_authenticated:
        return False
    return user.groups.filter(name__in=[r.upper() for r in role_names.split(',')]).exists()
