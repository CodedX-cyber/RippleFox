from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class MazePayAPIView(APIView):
    """
    A simple API view for MazePay functionality.
    """
    def get(self, request, format=None):
        """
        Handle GET requests.
        """
        return Response({"status": "MazePay API is working"}, status=status.HTTP_200_OK)
