#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

# Add the apps directory to the Python path before importing Django
BASE_DIR = Path(__file__).resolve().parent
APPS_DIR = os.path.join(BASE_DIR, 'apps')
if APPS_DIR not in sys.path:
    sys.path.insert(0, APPS_DIR)

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Now that the path is set up, we can import from core
    try:
        from core.env_utils import get_boolean_env
        DEBUG = get_boolean_env('DJANGO_DEBUG', False)
    except Exception as e:
        print(f"Warning: Could not load environment variables: {e}")
        DEBUG = True
    
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
