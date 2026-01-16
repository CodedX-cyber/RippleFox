"""URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

# Import our custom admin site
from apps.core.admin_site import custom_admin_site

urlpatterns = [
    # Admin
    path('admin/', custom_admin_site.urls),
    
    # Include users app URLs at the root with namespace
    path('', include('apps.users.urls', namespace='users')),
    
    # API endpoints
    path('api/v1/auth/', include('apps.users.urls', namespace='users-api')),
    
    # Other app URLs
    path('api/v1/core/', include('apps.core.urls')),
    path('api/v1/mazepay/', include('apps.mazepay.urls')),
    path('api/v1/geoattendance/', include('apps.geoattendance.urls')),
    path('api/v1/handyconnect/', include('apps.handyconnect.urls')),
    path('api/v1/nexus/', include('apps.nexus.urls'))
]

# Serve media and static files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
