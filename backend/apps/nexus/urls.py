"""URL routing for the Nexus application."""

from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class NexusAPIView(APIView):
    """
    A simple API view for Nexus functionality.
    """
    def get(self, request, format=None):
        """
        Handle GET requests.
        """
        return Response({"status": "Nexus API is working"}, status=status.HTTP_200_OK)

app_name = 'nexus'

urlpatterns = [
    path('', NexusAPIView.as_view(), name='nexus-api'),
]
