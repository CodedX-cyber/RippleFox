"""App configuration for the users app."""

from django.apps import AppConfig


class UsersConfig(AppConfig):
    """AppConfig for the users application.
    
    This class configures the users application and its settings.
    """
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    verbose_name = 'Users'
    
    def ready(self):
        """Perform initialization when the app is ready.
        
        This method is called when Django starts. It's used here to import
        the signals module to register signal handlers.
        """
        import apps.users.signals  # noqa
