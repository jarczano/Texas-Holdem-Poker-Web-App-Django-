"""
ASGI config for djangocommunication project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from game_app import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangocommunication.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # Dodaj routing dla WebSocket z użyciem middleware AuthMiddlewareStack
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
            # Tu dodaj routing do obsługi komunikacji w czasie rzeczywistym
            # np. "game_app.routing.websocket_urlpatterns",
        )
    ),
})