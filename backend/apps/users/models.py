"""Custom user model and related models for Volt Conglomerate."""

import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that uses email as the unique identifier.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    
    # User status
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_verified = models.BooleanField(
        _('verified'),
        default=False,
        help_text=_('Designates whether this user has completed the email verification process.'),
    )
    
    # Timestamps
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    last_login = models.DateTimeField(_('last login'), blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional fields
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(_('phone number'), max_length=17, blank=True, validators=[phone_regex])
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    
    # User preferences
    language = models.CharField(max_length=10, default='en',
                              choices=[('en', 'English'), ('fr', 'French'), ('es', 'Spanish')])
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Security
    failed_login_attempts = models.PositiveIntegerField(default=0)
    account_locked_until = models.DateTimeField(null=True, blank=True)
    
    # Relationships
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="user_groups",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="user_permissions_set",
        related_query_name="user",
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']

    def __str__(self):
        """Return string representation of the user (email)."""
        return self.email
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between.
        
        Returns:
            str: The user's full name.
        """
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip()
    
    def get_short_name(self):
        """Return the short name for the user.
        
        Returns:
            str: The user's first name.
        """
        return self.first_name
    
    @property
    def full_name(self):
        """Return the user's full name.
        
        Returns:
            str: The user's full name.
        """
        return self.get_full_name()

class UserProfile(models.Model):
    """Extended user profile information."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(_('bio'), max_length=500, blank=True)
    date_of_birth = models.DateField(_('date of birth'), null=True, blank=True)
    
    # Contact Information
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    
    # Social Media
    website = models.URLField(blank=True)
    twitter = models.CharField(max_length=100, blank=True)
    linkedin = models.CharField(max_length=100, blank=True)
    
    # Preferences
    email_notifications = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('user profile')
        verbose_name_plural = _('user profiles')
    
    def __str__(self):
        return f"{self.user.email}'s profile"

class UserActivity(models.Model):
    """Tracks user activities and sessions."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    session_key = models.CharField(max_length=40, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Activity details
    login_time = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = 'User Activities'
        ordering = ['-login_time']
    
    def __str__(self):
        return f"{self.user.email} - {self.login_time}"
    
    def end_session(self):
        """Mark the session as ended."""
        self.logout_time = timezone.now()
        self.is_active = False
        self.save()
        return self
