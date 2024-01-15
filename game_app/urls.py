from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.start, name='start'),
    path('menu', views.menu, name='menu'),
    path('play/<str:selected_opponent>', views.play, name='play')
]