"""
Admin configuration for the core app.
"""
import json

from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe

# Make pygments optional
try:
    from pygments import highlight
    from pygments.lexers import JsonLexer
    from pygments.formatters import HtmlFormatter
    PYGMENTS_AVAILABLE = True
except ImportError:
    PYGMENTS_AVAILABLE = False

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """
    Admin configuration for the AuditLog model.
    """
    list_display = ('timestamp', 'user_email', 'action', 'model_name', 'object_id', 'ip_address')
    list_filter = ('action', 'model_name', 'timestamp')
    search_fields = ('user__email', 'object_id', 'details')
    readonly_fields = (
        'timestamp', 'user', 'action', 'model_name', 'object_id',
        'details_display', 'ip_address', 'user_agent'
    )
    fieldsets = (
        ('Audit Information', {
            'fields': ('timestamp', 'user', 'action', 'model_name', 'object_id')
        }),
        ('Details', {
            'fields': ('details_display',)
        }),
        ('Request Information', {
            'fields': ('ip_address', 'user_agent')
        }),
    )

    def user_email(self, obj):
        """Return the user's email or 'System' if no user is associated."""
        return obj.user.email if obj.user else 'System'
    
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def details_display(self, obj):
        """Display the details as formatted and highlighted JSON if pygments is available, otherwise as plain text."""
        # Convert the details to a pretty-printed JSON string
        json_str = json.dumps(obj.details, indent=2, sort_keys=True)
        
        if PYGMENTS_AVAILABLE:
            # Highlight the JSON if pygments is available
            formatter = HtmlFormatter(style='colorful')
            highlighted = highlight(json_str, JsonLexer(), formatter)
            style = "<style>{}</style><br>".format(formatter.get_style_defs())
            return mark_safe(style + highlighted)
        else:
            # Return as pre-formatted text if pygments is not available
            return format_html('<pre style="white-space: pre-wrap;">{}</pre>', json_str)
    
    details_display.short_description = 'Details (JSON)'
