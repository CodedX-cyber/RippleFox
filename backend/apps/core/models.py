"""
Core models for the Volt Conglomerate platform.
"""
import uuid

from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    """
    Abstract base model that provides common fields for all models.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        """Meta options for BaseModel."""
        abstract = True
        ordering = ['-created_at']

    def __str__(self):
        """Return string representation of the model."""
        return f"{self.__class__.__name__} {self.id}"


class AuditLog(models.Model):
    """
    Model to track all changes to important models.
    """
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('PASSWORD_CHANGE', 'Password Change'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timestamp = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=50)
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        """Meta options for AuditLog."""
        ordering = ['-timestamp']
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['model_name', 'object_id']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['action']),
        ]

    def __str__(self):
        """Return formatted string with action, model name, object ID, and timestamp."""
        return f"{self.get_action_display()} - {self.model_name} ({self.object_id}) at {self.timestamp}"
