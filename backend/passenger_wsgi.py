"""Entry point for cPanel's Passenger, which only speaks WSGI.

FastAPI/Starlette is ASGI. a2wsgi bridges the two so Passenger can run
this app unmodified — nothing about the actual application changes,
this file only exists because of how the host runs Python apps.
"""

from a2wsgi import ASGIMiddleware

from app.main import app as asgi_app

application = ASGIMiddleware(asgi_app)
