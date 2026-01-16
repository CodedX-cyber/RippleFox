"""ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application


# Set the default Django settings module for the 'asgi' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# This application object is used by any ASGI server configured to use this file.
application = get_asgi_application()
