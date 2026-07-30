import logging
import secrets
import uuid
from datetime import UTC, datetime, timedelta

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
from app.schemas.auth import (
    AcceptInviteRequest,
    LoginRequest,
    RefreshRequest,
    RequestPasswordResetRequest,
    TokenPair,
)

router = APIRouter(prefix="/api/v1/auth/client", tags=["auth-client"])
logger = logging.getLogger(__name__)

_bad_credentials = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
_bad_token = HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

RESET_TOKEN_TTL_HOURS = 1


def _consume_action_token(db: Session, token: str, password: str) -> Client:
    """Shared by invite-acceptance and password-reset — both are "prove you
    hold this token, then set a password" flows against the same
    invite_token/invite_token_expires_at columns."""
    client = db.query(Client).filter(Client.invite_token == token).first()
    if client is None or client.invite_token_expires_at is None:
        raise _bad_token
    if client.invite_token_expires_at < datetime.now(UTC):
        raise _bad_token

    client.hashed_password = hash_password(password)
    client.invite_token = None
    client.invite_token_expires_at = None
    client.portal_activated_at = client.portal_activated_at or datetime.now(UTC)
    db.commit()
    return client


@router.post("/accept-invite", response_model=TokenPair)
def accept_invite(body: AcceptInviteRequest, db: Session = Depends(get_db)) -> TokenPair:
    client = _consume_action_token(db, body.invite_token, body.password)
    subject = str(client.id)
    return TokenPair(
        access_token=create_access_token(subject, Audience.CLIENT),
        refresh_token=create_refresh_token(subject, Audience.CLIENT),
    )


@router.post("/request-password-reset", status_code=status.HTTP_202_ACCEPTED)
def request_password_reset(body: RequestPasswordResetRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    """Always returns the same response regardless of whether the email
    exists, to avoid leaking which addresses have portal accounts. The
    token itself is never returned here — only email delivery (not yet
    wired, see roadmap Phase 4/6) can get it to the actual account holder.
    """
    client = db.query(Client).filter(Client.email == body.email).first()
    if client is not None and client.is_active:
        client.invite_token = secrets.token_urlsafe(32)
        client.invite_token_expires_at = datetime.now(UTC) + timedelta(hours=RESET_TOKEN_TTL_HOURS)
        db.commit()
        logger.info("Password reset token generated for client %s (email delivery not yet wired)", client.id)
    return {"detail": "If an account exists for that email, a reset link has been sent."}


@router.post("/reset-password", response_model=TokenPair)
def reset_password(body: AcceptInviteRequest, db: Session = Depends(get_db)) -> TokenPair:
    client = _consume_action_token(db, body.invite_token, body.password)
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
