"""
Views for reports, users management, and settings pages.
"""
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .permissions import has_permission, CAN_VIEW_REPORTS, CAN_MANAGE_USERS, CAN_MANAGE_SETTINGS

User = get_user_model()

@login_required
def reports_view(request):
    """View for reports page."""
    if not has_permission(request.user, CAN_VIEW_REPORTS):
        return render(request, 'errors/403.html', status=403)
    
    # Get report data
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    inactive_users = total_users - active_users
    
    # Calculate percentages
    active_percentage = round((active_users / total_users * 100), 1) if total_users > 0 else 0
    inactive_percentage = round((inactive_users / total_users * 100), 1) if total_users > 0 else 0
    
    # New users this month
    thirty_days_ago = timezone.now() - timedelta(days=30)
    new_users_this_month = User.objects.filter(date_joined__gte=thirty_days_ago).count()
    
    # Recent logins (last 24 hours)
    twenty_four_hours_ago = timezone.now() - timedelta(hours=24)
    recent_logins = User.objects.filter(last_login__gte=twenty_four_hours_ago).count()
    
    # Recent activities (mock data for now)
    recent_activities = [
        {
            'user': 'John Doe',
            'action': 'Logged in',
            'time': '2 hours ago',
            'status': 'Success'
        },
        {
            'user': 'Jane Smith',
            'action': 'Updated profile',
            'time': '4 hours ago',
            'status': 'Success'
        },
        {
            'user': 'Bob Johnson',
            'action': 'Failed login attempt',
            'time': '6 hours ago',
            'status': 'Failed'
        },
    ]
    
    context = {
        'total_users': total_users,
        'active_users': active_users,
        'inactive_users': inactive_users,
        'active_percentage': active_percentage,
        'inactive_percentage': inactive_percentage,
        'new_users_this_month': new_users_this_month,
        'recent_logins': recent_logins,
        'recent_activities': recent_activities,
    }
    
    return render(request, 'users/reports.html', context)

@login_required
def manage_users_view(request):
    """View for managing users."""
    if not has_permission(request.user, CAN_MANAGE_USERS):
        return render(request, 'errors/403.html', status=403)
    
    # Get all users with filtering
    users = User.objects.all().order_by('-date_joined')
    
    # Filter by status if specified
    status_filter = request.GET.get('status')
    if status_filter == 'active':
        users = users.filter(is_active=True)
    elif status_filter == 'inactive':
        users = users.filter(is_active=False)
    elif status_filter == 'pending':
        users = users.filter(is_active=False, is_verified=True)
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        users = users.filter(
            Q(email__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query)
        )
    
    # Calculate statistics
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    inactive_users = User.objects.filter(is_active=False).count()
    pending_users = User.objects.filter(is_active=False, is_verified=True).count()
    
    context = {
        'users': users,
        'total_users': total_users,
        'active_users': active_users,
        'inactive_users': inactive_users,
        'pending_users': pending_users,
    }
    
    return render(request, 'users/manage_users.html', context)

@login_required
def settings_view(request):
    """View for user settings."""
    # Get or create user settings
    try:
        user_settings = request.user.settings
    except:
        from .models_settings import UserSettings
        user_settings = UserSettings.objects.get_or_create(user=request.user)[0]
    
    context = {
        'user_settings': user_settings,
    }
    
    return render(request, 'users/settings.html', context)
