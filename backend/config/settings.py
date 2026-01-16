"""
Django settings for config project.
"""

import os
from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Add the apps directory to the Python path
import sys
APPS_DIR = os.path.join(BASE_DIR, 'apps')
if APPS_DIR not in sys.path:
    sys.path.insert(0, APPS_DIR)

# Import environment utilities
from core.env_utils import (
    get_env_variable,
    get_boolean_env,
    get_int_env,
    get_list_env,
    get_float_env
)

# Core settings
DEBUG = get_boolean_env('DEBUG', True)
SECRET_KEY = get_env_variable('SECRET_KEY', 'django-insecure-your-secret-key')
ALLOWED_HOSTS = get_list_env('ALLOWED_HOSTS', ['*'])

# Database settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email settings
EMAIL_BACKEND = get_env_variable('EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = get_env_variable('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = get_int_env('EMAIL_PORT', 587)
EMAIL_USE_TLS = get_boolean_env('EMAIL_USE_TLS', True)
EMAIL_HOST_USER = get_env_variable('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = get_env_variable('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = get_env_variable('DEFAULT_FROM_EMAIL', 'noreply@yourdomain.com')

# JWT settings
JWT_SECRET_KEY = get_env_variable('JWT_SECRET_KEY')
JWT_ALGORITHM = get_env_variable('JWT_ALGORITHM', 'HS256')

# AWS settings
AWS_ACCESS_KEY_ID = get_env_variable('AWS_ACCESS_KEY_ID', '')
AWS_SECRET_ACCESS_KEY = get_env_variable('AWS_SECRET_ACCESS_KEY', '')
AWS_STORAGE_BUCKET_NAME = get_env_variable('AWS_STORAGE_BUCKET_NAME', '')

# Celery settings
CELERY_BROKER_URL = get_env_variable('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = get_env_variable('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
env_file = os.path.join(BASE_DIR.parent, '.env')
print(f"Looking for .env file at: {env_file}")
print(f".env file exists: {os.path.exists(env_file)}")
if os.path.exists(env_file):
    print("Reading .env file...")
    env.read_env(env_file)
    print("Environment variables loaded from .env file")
    print(f"DEBUG: {env('DEBUG')}")
    print(f"SECRET_KEY: {'*' * len(env('SECRET_KEY')) if env('SECRET_KEY') else 'NOT SET'}")
    print(f"ALLOWED_HOSTS: {env('ALLOWED_HOSTS')}")

# SECURITY WARNING: keep the secret key used in production secret!
# Temporarily hardcoded values
SECRET_KEY = 'django-insecure-your-secure-key-here-1234567890'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Local apps
    'apps.users',
    'apps.core',
    'apps.mazepay',
    'apps.geoattendance',
    'apps.handyconnect',
    'apps.nexus',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS middleware should be as high as possible
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates'), os.path.join(BASE_DIR, 'templates/admin')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database - Using SQLite for now
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Uncomment this to use PostgreSQL when the database is ready
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': env('DB_NAME'),
#         'USER': env('DB_USER'),
#         'PASSWORD': env('DB_PASSWORD'),
#         'HOST': env('DB_HOST', default='localhost'),
#         'PORT': env('DB_PORT', default='5432'),
#     }
# }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Lagos'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'users.User'

# Authentication backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # Default backend
    'apps.users.backends.EmailBackend',  # Custom email backend
]

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': get_env_variable('JWT_SECRET_KEY', default=SECRET_KEY),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True  # Only for development
# In production, use the following instead:
# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000',  # Your frontend URL
#     'https://yourdomain.com',  # Your production domain
# ]
CORS_ALLOW_CREDENTIALS = True

# Email settings
EMAIL_BACKEND = get_env_variable('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
DEFAULT_FROM_EMAIL = get_env_variable('DEFAULT_FROM_EMAIL', default='webmaster@localhost')

# Celery settings (disabled by default - uncomment and set CELERY_BROKER_URL to enable)
# CELERY_BROKER_URL = get_env_variable('CELERY_BROKER_URL', default=None)
# if CELERY_BROKER_URL:  # Only configure Celery if broker URL is set
#     CELERY_RESULT_BACKEND = 'django-db'  # Store task results in Django database
#     CELERY_CACHE_BACKEND = 'django-cache'
#     CELERY_ACCEPT_CONTENT = ['json']
#     CELERY_TASK_SERIALIZER = 'json'
#     CELERY_RESULT_SERIALIZER = 'json'
#     CELERY_TIMEZONE = 'UTC'
#     CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
# 
#     # Celery email settings
#     CELERY_EMAIL_BACKEND = EMAIL_BACKEND
#     CELERY_EMAIL_TASK_CONFIG = {
#         'queue': 'email',
#         'delivery_mode': 1,  # non persistent
#         'rate_limit': '5/m',  # 5 emails per minute
#     }

# Email verification settings
EMAIL_VERIFICATION_LINK_EXPIRE_DAYS = 3
PASSWORD_RESET_TIMEOUT = 86400  # 24 hours

# Authentication settings
LOGIN_URL = '/web/login/'
LOGIN_REDIRECT_URL = '/dashboard/'
LOGOUT_REDIRECT_URL = '/web/login/'

# Security settings
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG' if DEBUG else 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log' if DEBUG else 'production.log'),
            'formatter': 'verbose',
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'apps': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },
    },
}
