"""Views for the core app."""

import platform
import socket
from datetime import datetime

try:
    import psutil
    PSU_AVAILABLE = True
except ImportError:
    PSU_AVAILABLE = False

import django
from django.conf import settings
from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

class HealthCheckView(APIView):
    """API endpoint for health checks."""
    
    permission_classes = [AllowAny]
    
    def get(self, request, format=None):
        """Check the health of the application.
        
        Returns:
            Response: JSON response with health check information
        """
        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
                db_status = 'connected'
        except Exception as e:
            db_status = f'error: {str(e)}'
        
        # Get memory usage
        process = psutil.Process()
        memory_info = process.memory_info()
        
        # Prepare response
        data = {
            'status': 'ok',
            'timestamp': datetime.utcnow().isoformat(),
            'service': 'Volt Conglomerate API',
            'version': '1.0.0',
            'dependencies': {
                'database': db_status,
                'django': django.get_version(),
            },
            'system': {
                'python': platform.python_version(),
                'os': platform.platform(),
                'hostname': socket.gethostname(),
            },
            'resources': {
                'memory_used_mb': memory_info.rss / (1024 * 1024),  # Convert to MB
                'cpu_percent': psutil.cpu_percent(),
                'disk_usage': psutil.disk_usage('/')._asdict(),
            },
        }
        
        return Response(data, status=status.HTTP_200_OK)

class SystemInfoView(APIView):
    """API endpoint for system information. Requires authentication."""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        """Get system information.
        
        Returns:
            Response: JSON response with system information
        """
        # Get database info
        db_info = {}
        try:
            with connection.cursor() as cursor:
                # PostgreSQL specific
                if 'postgresql' in settings.DATABASES['default']['ENGINE']:
                    cursor.execute('SELECT version()')
                    db_info['version'] = cursor.fetchone()[0]
                    
                    cursor.execute('SELECT pg_size_pretty(pg_database_size(current_database()))')
                    db_info['size'] = cursor.fetchone()[0]
                    
                    cursor.execute('SELECT count(*) FROM pg_stat_activity')
                    db_info['connections'] = cursor.fetchone()[0]
        except Exception as e:
            db_info['error'] = str(e)
        
        # Get system metrics
        system_info = {
            'system': {
                'python_version': platform.python_version(),
                'django_version': django.get_version(),
                'os': platform.system(),
                'os_version': platform.release(),
                'hostname': socket.gethostname(),
            },
            'application': {
                'debug': settings.DEBUG,
                'timezone': str(settings.TIME_ZONE),
                'database': settings.DATABASES['default']['ENGINE'].split('.')[-1],
                'current_time': datetime.now().isoformat(),
            }
        }
        
        # Add psutil metrics if available
        if PSU_AVAILABLE:
            system_info['system'].update({
                'cpu_count': psutil.cpu_count(logical=False),
                'cpu_percent': psutil.cpu_percent(interval=1),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_usage': psutil.disk_usage('/').percent,
                'boot_time': datetime.fromtimestamp(psutil.boot_time()).isoformat(),
            })
        
        # Prepare response
        data = {
            'system': system_info,
            'database': db_info,
            'resources': {
                'cpu': {
                    'cores': psutil.cpu_count(logical=False) if PSU_AVAILABLE else None,
                    'threads': psutil.cpu_count() if PSU_AVAILABLE else None,
                    'usage_percent': psutil.cpu_percent(interval=1) if PSU_AVAILABLE else None,
                },
                'memory': {
                    'total_gb': round(psutil.virtual_memory().total / (1024 ** 3), 2) if PSU_AVAILABLE else None,
                    'available_gb': round(psutil.virtual_memory().available / (1024 ** 3), 2) if PSU_AVAILABLE else None,
                    'used_gb': round(psutil.virtual_memory().used / (1024 ** 3), 2) if PSU_AVAILABLE else None,
                    'used_percent': psutil.virtual_memory().percent if PSU_AVAILABLE else None,
                },
                'disk': {
                    'total_gb': round(psutil.disk_usage('/').total / (1024 ** 3), 2) if PSU_AVAILABLE else None,
                    'used_gb': round(psutil.disk_usage('/').used / (1024 ** 3), 2) if PSU_AVAILABLE else None,
                    'free_gb': round(psutil.disk_usage('/').free / (1024 ** 3), 2) if PSU_AVAILABLE else None,
                    'used_percent': psutil.disk_usage('/').percent if PSU_AVAILABLE else None,
                }
            },
            'services': {
                'database': 'postgresql',
                'cache': 'redis',
                'server': 'gunicorn' if not settings.DEBUG else 'django',
            },
            'timestamps': {
                'server_time': datetime.now().isoformat(),
                'server_start_time': datetime.fromtimestamp(process.create_time()).isoformat(),
                'uptime_seconds': int(datetime.now().timestamp() - process.create_time()),
            },
        }
        
        return Response(data, status=status.HTTP_200_OK)

def health_check(request):
    """Wrapper for HealthCheckView to be used in URL patterns.
    
    Args:
        request: HTTP request object
        
    Returns:
        Response: Health check response
    """
    view = HealthCheckView.as_view()
    return view(request._request)


def system_info(request):
    """Wrapper for SystemInfoView to be used in URL patterns.
    
    Args:
        request: HTTP request object
        
    Returns:
        Response: System information response
    """
    view = SystemInfoView.as_view()
    return view(request._request)
