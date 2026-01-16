"""URL routing for the GeoAttendance application."""

from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class GeoAttendanceAPIView(APIView):
    """
    A simple API view for GeoAttendance functionality.
    """
    def get(self, request, format=None):
        """
        Handle GET requests.
        """
        return Response({"status": "GeoAttendance API is working"}, status=status.HTTP_200_OK)

app_name = 'geoattendance'

urlpatterns = [
    path('', GeoAttendanceAPIView.as_view(), name='geoattendance-api'),
]
