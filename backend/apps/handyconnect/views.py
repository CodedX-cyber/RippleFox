from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HandyConnectAPIView(APIView):
    """
    A simple API view for HandyConnect functionality.
    """
    def get(self, request, format=None):
        """
        Handle GET requests.
        """
        return Response({"status": "HandyConnect API is working"}, status=status.HTTP_200_OK)
