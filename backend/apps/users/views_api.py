from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer
from .models_settings import UserSettings
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return self.serializer_class

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'status': 'user deactivated'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': 'user activated'})

class ReportViewSet(viewsets.ViewSet):
    """
    API endpoint for generating and viewing reports.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        # Generate sample report data
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        new_users_last_30_days = User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        return Response({
            "message": "Reports data",
            "data": {
                "total_users": total_users,
                "active_users": active_users,
                "inactive_users": total_users - active_users,
                "new_users_last_30_days": new_users_last_30_days,
                "user_growth": self._get_user_growth_data(),
                "user_activity": self._get_user_activity_data()
            }
        })

    @action(detail=False, methods=['get'])
    def user_growth(self, request):
        return Response({
            "data": self._get_user_growth_data()
        })

    @action(detail=False, methods=['get'])
    def user_activity(self, request):
        return Response({
            "data": self._get_user_activity_data()
        })

    def _get_user_growth_data(self):
        # Get user registration data for the last 12 months
        months = []
        for i in range(12):
            month_start = timezone.now() - timedelta(days=30*i)
            month_end = timezone.now() - timedelta(days=30*(i-1)) if i > 0 else timezone.now()
            count = User.objects.filter(
                date_joined__gte=month_start,
                date_joined__lt=month_end
            ).count()
            months.append({
                "month": month_start.strftime("%Y-%m"),
                "new_users": count
            })
        return list(reversed(months))

    def _get_user_activity_data(self):
        # Sample activity data
        return [
            {"date": "2024-01-01", "logins": 120, "active_users": 85},
            {"date": "2024-01-02", "logins": 98, "active_users": 72},
            {"date": "2024-01-03", "logins": 145, "active_users": 92},
        ]

class SettingsViewSet(viewsets.ViewSet):
    """
    API endpoint for application settings.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        # Return current user's settings
        try:
            user_settings = request.user.settings
        except UserSettings.DoesNotExist:
            # Create settings if they don't exist
            user_settings = UserSettings.objects.create(user=request.user)
        
        return Response({
            "theme": user_settings.theme,
            "notifications": user_settings.email_notifications,
            "language": user_settings.language,
            "timezone": user_settings.timezone,
            "email_notifications": user_settings.email_notifications,
            "push_notifications": user_settings.push_notifications,
            "marketing_emails": user_settings.marketing_emails,
        })

    @action(detail=False, methods=['post'])
    def update_settings(self, request):
        # Update user settings
        user = request.user
        try:
            user_settings = user.settings
        except UserSettings.DoesNotExist:
            user_settings = UserSettings.objects.create(user=user)
        
        # Update fields from request data
        settings_data = request.data
        if 'theme' in settings_data:
            user_settings.theme = settings_data['theme']
        if 'language' in settings_data:
            user_settings.language = settings_data['language']
        if 'timezone' in settings_data:
            user_settings.timezone = settings_data['timezone']
        if 'email_notifications' in settings_data:
            user_settings.email_notifications = settings_data['email_notifications']
        if 'push_notifications' in settings_data:
            user_settings.push_notifications = settings_data['push_notifications']
        if 'marketing_emails' in settings_data:
            user_settings.marketing_emails = settings_data['marketing_emails']
        
        user_settings.save()
        
        return Response({
            "message": "Settings updated successfully",
            "data": {
                "theme": user_settings.theme,
                "notifications": user_settings.email_notifications,
                "language": user_settings.language,
                "timezone": user_settings.timezone,
                "email_notifications": user_settings.email_notifications,
                "push_notifications": user_settings.push_notifications,
                "marketing_emails": user_settings.marketing_emails,
            }
        })

    @action(detail=False, methods=['get'])
    def system_settings(self, request):
        if not request.user.is_staff:
            return Response({"error": "Admin access required"}, status=403)
        
        return Response({
            "system_name": "Ripple Fox",
            "version": "1.0.0",
            "maintenance_mode": False,
            "registration_enabled": True,
            "max_users": 1000,
            "default_theme": "light",
            "supported_languages": ["en", "es", "fr", "de"],
        })
