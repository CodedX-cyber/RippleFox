"""URLs for the users app.

This module defines all the URL patterns for the users app, including authentication,
password management, email verification, and user profile endpoints.
"""

from django.urls import path, include, reverse_lazy
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth.views import LoginView, LogoutView

from . import views
from .views import DashboardView, HomeView
from .auth_views import (
    UserRegistrationView,
    UserLoginView,
    ResendVerificationView,
    VerifyEmailView,
    CheckAvailabilityView,
    CustomTokenObtainPairView,
    UserProfileView
)
from .views_api import UserViewSet, ReportViewSet, SettingsViewSet
from .views_pages import reports_view, manage_users_view, settings_view

app_name = 'users'

# Create a router for API endpoints
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'reports', ReportViewSet, basename='reports')
router.register(r'settings', SettingsViewSet, basename='settings')

urlpatterns = [
    # API endpoints
    path('api/', include(router.urls)),
    
    # Home page
    path('', HomeView.as_view(), name='home'),
    
    # Dashboard
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # Reports, Users, and Settings pages
    path('reports/', reports_view, name='reports'),
    path('manage-users/', manage_users_view, name='manage_users'),
    path('settings/', settings_view, name='settings'),
    
    # Authentication
    path('auth/', include([
        path('register/', UserRegistrationView.as_view(), name='register'),
        path('login/', UserLoginView.as_view(), name='login'),
        path('logout/', views.UserLogoutView.as_view(), name='logout'),
    ])),
    
    # User profile
    path('profile/', include([
        path('me/', UserProfileView.as_view(), name='user-profile'),
        path('', views.UserProfileView.as_view(), name='profile'),
    ])),
    
    # Token endpoints
    path('token/', include([
        path('', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ])),
    
    # Email verification
    path('verify-email/', include([
        path('', VerifyEmailView.as_view(), name='verify-email'),
        path('resend/', ResendVerificationView.as_view(), name='resend-verification'),
        path('<uidb64>/<token>/', views.EmailVerificationView.as_view(), name='verify_email'),
    ])),
    
    # Availability check
    path('check-availability/', CheckAvailabilityView.as_view(), name='check-availability'),
    
    # Web interface authentication
    path('web/', include([
        path('login/', LoginView.as_view(
            template_name='registration/simple_login.html',
            redirect_authenticated_user=True,
            next_page=reverse_lazy('users:dashboard')
        ), name='login_view'),
        path('logout/', LogoutView.as_view(next_page='users:login_view'), name='logout_view'),
    ])),
    
    # Password management
    path('password/', include([
        path('reset/', views.PasswordResetView.as_view(), name='password_reset'),
        path('reset/confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), 
            name='password_reset_confirm'),
    ]))
]
