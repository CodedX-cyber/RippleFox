"""URLs for the core app."""

from django.urls import path
from rest_framework import permissions

from . import views

app_name = 'core'

urlpatterns = [
    # Health check endpoint
    path('health/', views.health_check, name='health-check'),
    
    # System information endpoint (protected)
    path('system-info/', views.system_info, name='system-info'),
]
