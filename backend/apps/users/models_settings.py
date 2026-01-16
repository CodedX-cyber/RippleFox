"""
User settings model for storing user preferences.
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSettings(models.Model):
    """
    Model to store user-specific settings and preferences.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='settings'
    )
    theme = models.CharField(
        max_length=10,
        choices=[
            ('light', 'Light'),
            ('dark', 'Dark'),
            ('auto', 'Auto'),
        ],
        default='light'
    )
    language = models.CharField(
        max_length=10,
        choices=[
            ('en', 'English'),
            ('es', 'Spanish'),
            ('fr', 'French'),
            ('de', 'German'),
        ],
        default='en'
    )
    timezone = models.CharField(
        max_length=50,
        default='UTC'
    )
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Settings'
        verbose_name_plural = 'User Settings'

    def __str__(self):
        return f"{self.user.email}'s Settings"

# Signal to create UserSettings when a User is created
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    """Create UserSettings when a new User is created."""
    if created:
        UserSettings.objects.get_or_create(user=instance)
