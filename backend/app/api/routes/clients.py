import secrets
import uuid
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_staff
from app.core.time import utc_now
from app.database import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientOut

router = APIRouter(prefix="/api/v1/clients", tags=["clients"])

INVITE_TOKEN_TTL_HOURS = 72


@router.post("", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(
    body: ClientCreate,
    db: Session = Depends(get_db),
    _staff=Depends(get_current_staff),
) -> Client:
    if db.query(Client).filter(Client.email == body.email).first() is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A client with this email already exists")
    client = Client(email=body.email, full_name=body.full_name, phone=body.phone)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("", response_model=list[ClientOut])
def list_clients(db: Session = Depends(get_db), _staff=Depends(get_current_staff)) -> list[Client]:
    return db.query(Client).order_by(Client.created_at.desc()).all()


@router.get("/{client_id}", response_model=ClientOut)
def get_client(client_id: uuid.UUID, db: Session = Depends(get_db), _staff=Depends(get_current_staff)) -> Client:
    client = db.get(Client, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return client


@router.post("/{client_id}/invite", status_code=status.HTTP_200_OK)
def invite_client(
    client_id: uuid.UUID, db: Session = Depends(get_db), _staff=Depends(get_current_staff)
) -> dict[str, str]:
    """Generates a portal invite token for the client.

    Sending the email is out of scope for Phase 1 — the token is returned
    here so it can be wired into an email/notification step later without
    changing this endpoint's contract.
    """
    client = db.get(Client, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    client.invite_token = secrets.token_urlsafe(32)
    client.invite_token_expires_at = utc_now() + timedelta(hours=INVITE_TOKEN_TTL_HOURS)
    db.commit()
    return {"invite_token": client.invite_token}
