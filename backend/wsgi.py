"""
WSGI config for the project.
This file acts as a bridge between your web server and the Django application.
"""

import os
import sys
from pathlib import Path

# Add the project directory to the Python path
project_root = Path(__file__).resolve().parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(project_root, '.env'))

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Get the WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
