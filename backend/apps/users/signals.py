"""Signals for the users app."""

import logging

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone

from .models import UserProfile, UserActivity

User = get_user_model()
logger = logging.getLogger(__name__)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a UserProfile for each new User.
    
    Args:
        sender: The model class.
        instance: The actual instance being saved.
        created (bool): Whether this is a new record.
        **kwargs: Additional keyword arguments.
    """
    if created:
        UserProfile.objects.create(user=instance)
        logger.info("Created UserProfile for user: %s", instance.email)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the UserProfile when the User is saved.
    
    Args:
        sender: The model class.
        instance: The actual instance being saved.
        **kwargs: Additional keyword arguments.
    """
    try:
        instance.profile.save()
        logger.debug("Saved UserProfile for user: %s", instance.email)
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=instance)
        logger.info("Created missing UserProfile for user: %s", instance.email)

@receiver(pre_save, sender=User)
def user_pre_save(sender, instance, **kwargs):
    """Handle pre-save operations for User model.
    
    Args:
        sender: The model class.
        instance: The actual instance being saved.
        **kwargs: Additional keyword arguments.
    """
    # If this is an existing user and the password has changed
    if instance.pk is not None:
        try:
            old_instance = User.objects.get(pk=instance.pk)
            if old_instance.password != instance.password:
                instance.password_changed_at = timezone.now()
                logger.info("Password changed for user: %s", instance.email)
        except User.DoesNotExist:
            logger.warning("User with pk %s does not exist", instance.pk)

@receiver(post_save, sender=UserActivity)
def log_user_activity(sender, instance, created, **kwargs):
    """Log user activity when a new UserActivity is created.
    
    Args:
        sender: The model class.
        instance: The actual instance being saved.
        created (bool): Whether this is a new record.
        **kwargs: Additional keyword arguments.
    """
    if created:
        logger.info(
            "User %s logged in from %s using %s",
            instance.user.email,
            instance.ip_address,
            instance.user_agent
        )

@receiver(post_save, sender=User)
def log_user_creation(sender, instance, created, **kwargs):
    """Log when a new user is created.
    
    Args:
        sender: The model class.
        instance: The actual instance being saved.
        created (bool): Whether this is a new record.
        **kwargs: Additional keyword arguments.
    """
    if created:
        logger.info("New user created: %s (ID: %s)", instance.email, instance.id)

@receiver(pre_save, sender=User)
def check_account_lock(sender, instance, **kwargs):
    """Check if the account is locked and should be unlocked.
    
    Args:
        sender: The model class.
        instance: The actual instance being saved.
        **kwargs: Additional keyword arguments.
    """
    if instance.account_locked_until and instance.account_locked_until <= timezone.now():
        instance.account_locked_until = None
        instance.failed_login_attempts = 0
        logger.info("Automatically unlocked account for user: %s", instance.email)
