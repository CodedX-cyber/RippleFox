"""
Admin configuration for the users app.

This module provides admin configuration for the users app, including
configuration for the User, UserProfile, and UserActivity models.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, UserProfile, UserActivity


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for the custom User model."""
    
    list_display = (
        'email', 
        'first_name', 
        'last_name', 
        'is_staff', 
        'is_active', 
        'is_verified', 
        'date_joined'
    )
    list_filter = (
        'is_staff', 
        'is_active', 
        'is_verified', 
        'is_superuser'
    )
    search_fields = (
        'email', 
        'first_name', 
        'last_name'
    )
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (
            _('Personal Info'), 
            {'fields': ('first_name', 'last_name', 'phone_number', 'profile_picture')}
        ),
        (_('Preferences'), {'fields': ('language', 'timezone')}),
        (
            _('Status'), 
            {'fields': ('is_active', 'is_verified', 'is_staff', 'is_superuser')}
        ),
        (
            _('Security'), 
            {'fields': ('last_login', 'failed_login_attempts', 'account_locked_until')}
        ),
        (_('Important dates'), {'fields': ('date_joined', 'updated_at')}),
        (
            _('Permissions'), 
            {
                'classes': ('collapse',),
                'fields': ('groups', 'user_permissions'),
            }
        ),
    )
    
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active'),
            },
        ),
    )
    
    readonly_fields = ('last_login', 'date_joined', 'updated_at')
    filter_horizontal = ('groups', 'user_permissions')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin configuration for UserProfile model."""
    
    list_display = (
        'user', 
        'city', 
        'country', 
        'created_at'
    )
    list_filter = (
        'country', 
        'email_notifications', 
        'marketing_emails'
    )
    search_fields = (
        'user__email', 
        'user__first_name', 
        'user__last_name', 
        'city', 
        'country'
    )
    raw_id_fields = ('user',)
    
    fieldsets = (
        (
            None,
            {'fields': ('user', 'bio', 'date_of_birth')}
        ),
        (
            _('Contact Information'),
            {'fields': ('address', 'city', 'state', 'country', 'postal_code')}
        ),
        (
            _('Social Media'),
            {'fields': ('website', 'twitter', 'linkedin')}
        ),
        (
            _('Preferences'),
            {'fields': ('email_notifications', 'marketing_emails')}
        ),
        (
            _('Metadata'),
            {
                'fields': ('created_at', 'updated_at'),
                'classes': ('collapse',)
            }
        ),
    )
    
    readonly_fields = ('created_at', 'updated_at')

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    """Admin configuration for UserActivity model."""
    
    list_display = (
        'user', 
        'ip_address', 
        'login_time', 
        'last_activity', 
        'logout_time', 
        'is_active'
    )
    list_filter = (
        'is_active', 
        'login_time', 
        'last_activity'
    )
    search_fields = (
        'user__email', 
        'user__first_name', 
        'user__last_name', 
        'ip_address'
    )
    date_hierarchy = 'login_time'
    
    fieldsets = (
        (
            None,
            {'fields': ('user', 'session_key', 'ip_address', 'user_agent')}
        ),
        (
            _('Activity Times'),
            {'fields': ('login_time', 'last_activity', 'logout_time')}
        ),
        (
            _('Status'),
            {'fields': ('is_active',)}
        ),
    )
    
    readonly_fields = ('login_time', 'last_activity', 'logout_time')
    
    def has_add_permission(self, request):
        """Disable adding new UserActivity records from admin."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Disable changing UserActivity records from admin."""
        return False
