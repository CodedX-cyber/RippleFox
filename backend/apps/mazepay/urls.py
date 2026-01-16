"""URL routing for the MazePay application."""

from django.urls import path
from .views import MazePayAPIView

app_name = 'mazepay'

urlpatterns = [
    path('', MazePayAPIView.as_view(), name='mazepay-api'),
]
