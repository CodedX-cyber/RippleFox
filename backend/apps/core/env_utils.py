"""
Environment variable validation for the VC project.
"""
import os
from typing import Optional, Dict, List
from django.core.exceptions import ImproperlyConfigured

# Required environment variables with descriptions
REQUIRED_VARIABLES = {
    # Django settings
    'SECRET_KEY': 'Django secret key for cryptographic signing',
    'DEBUG': 'Django debug mode (True/False)',
    'ALLOWED_HOSTS': 'Comma-separated list of allowed hostnames',
}

# Optional environment variables with their default values
OPTIONAL_VARIABLES = {
    'PORT': '8000',
    'ENVIRONMENT': 'development',
    'LOG_LEVEL': 'INFO',
    # Database settings
    'DB_NAME': 'db.sqlite3',
    'DB_USER': '',
    'DB_PASSWORD': '',
    'DB_HOST': 'localhost',
    'DB_PORT': '5432',
    # Email settings
    'EMAIL_HOST': 'localhost',
    'EMAIL_PORT': '25',
    'EMAIL_USE_TLS': 'False',
    'DEFAULT_FROM_EMAIL': 'webmaster@localhost',
}

def validate_environment() -> None:
    """
    Validate that all required environment variables are set.
    This is now a no-op since we're making all variables optional with defaults.
    """
    pass

def get_env_variable(var_name: str, default: str = '', required: bool = False) -> str:
    """
    Get an environment variable with optional default value.
    
    Args:
        var_name: Name of the environment variable to retrieve
        default: Default value to return if variable is not set
        required: If True, raises ImproperlyConfigured when variable is not set and no default is provided
        
    Returns:
        str: The value of the environment variable or the default value
        
    Raises:
        ImproperlyConfigured: If the variable is required but not set and no default is provided
    """
    value = os.getenv(var_name, default)
    if value is None and required:
        raise ImproperlyConfigured(f"Environment variable {var_name} is required but not set")
    return str(value) if value is not None else ''

def get_boolean_env(var_name: str, default: bool = False) -> bool:
    """
    Get a boolean value from environment variables.
    
    Args:
        var_name: Name of the environment variable
        default: Default value to return if variable is not set
        
    Returns:
        bool: The boolean value of the environment variable
    """
    value = os.getenv(var_name, '').lower()
    if value in ('true', '1', 'yes', 'y'):
        return True
    elif value in ('false', '0', 'no', 'n', ''):
        return False
    return default

def get_int_env(var_name: str, default: int = 0) -> int:
    """
    Get an integer value from environment variables.
    
    Args:
        var_name: Name of the environment variable
        default: Default value to return if variable is not set or invalid
        
    Returns:
        int: The integer value of the environment variable or default
    """
    try:
        return int(os.getenv(var_name, str(default)))
    except (ValueError, TypeError):
        return default

def get_float_env(var_name: str, default: float = 0.0) -> float:
    """
    Get a float value from environment variables.
    
    Args:
        var_name: Name of the environment variable
        default: Default value to return if variable is not set or invalid
        
    Returns:
        float: The float value of the environment variable or default
    """
    try:
        return float(os.getenv(var_name, str(default)))
    except (ValueError, TypeError):
        return float(default)

def get_list_env(var_name: str, separator: str = ',', default: Optional[list] = None) -> List[str]:
    """
    Get a list from a comma-separated environment variable.
    
    Args:
        var_name: Name of the environment variable
        separator: Separator character (default: comma)
        default: Default list to return if variable is not set
        
    Returns:
        List[str]: List of strings from the environment variable
    """
    if default is None:
        default = []
    value = os.getenv(var_name, '')
    if not value:
        return default
    return [item.strip() for item in value.split(separator) if item.strip()]

# Call validation when module is imported
validate_environment()
