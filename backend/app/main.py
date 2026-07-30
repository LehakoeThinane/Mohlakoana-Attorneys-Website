from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth_client, auth_staff, clients, matters, public
from app.config import settings

app = FastAPI(title="Mohlakoana Attorneys API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"] if settings.environment == "development" else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_staff.router)
app.include_router(auth_client.router)
app.include_router(clients.router)
app.include_router(matters.router)
app.include_router(public.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
