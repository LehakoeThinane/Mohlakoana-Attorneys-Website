import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    Audience,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.client import Client
from app.schemas.auth import AcceptInviteRequest, LoginRequest, RefreshRequest, TokenPair

router = APIRouter(prefix="/api/v1/auth/client", tags=["auth-client"])

_bad_credentials = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")


@router.post("/accept-invite", response_model=TokenPair)
def accept_invite(body: AcceptInviteRequest, db: Session = Depends(get_db)) -> TokenPair:
    client = db.query(Client).filter(Client.invite_token == body.invite_token).first()
    if client is None or client.invite_token_expires_at is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired invite")
    if client.invite_token_expires_at < datetime.now(UTC):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired invite")

    client.hashed_password = hash_password(body.password)
    client.invite_token = None
    client.invite_token_expires_at = None
    client.portal_activated_at = datetime.now(UTC)
    db.commit()

    subject = str(client.id)
    return TokenPair(
        access_token=create_access_token(subject, Audience.CLIENT),
        refresh_token=create_refresh_token(subject, Audience.CLIENT),
    )


@router.post("/login", response_model=TokenPair)
def login(body: LoginRequest, db: Session = Depends(get_db)) -> TokenPair:
    client = db.query(Client).filter(Client.email == body.email).first()
    if client is None or not client.is_active or client.hashed_password is None:
        raise _bad_credentials
    if not verify_password(body.password, client.hashed_password):
        raise _bad_credentials
    subject = str(client.id)
    return TokenPair(
        access_token=create_access_token(subject, Audience.CLIENT),
        refresh_token=create_refresh_token(subject, Audience.CLIENT),
    )


@router.post("/refresh", response_model=TokenPair)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)) -> TokenPair:
    payload = decode_token(body.refresh_token, Audience.CLIENT)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    client = db.get(Client, uuid.UUID(payload["sub"]))
    if client is None or not client.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    subject = str(client.id)
    return TokenPair(
        access_token=create_access_token(subject, Audience.CLIENT),
        refresh_token=create_refresh_token(subject, Audience.CLIENT),
    )
