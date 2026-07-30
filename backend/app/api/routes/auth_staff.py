import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    Audience,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.database import get_db
from app.models.staff import Staff
from app.schemas.auth import LoginRequest, RefreshRequest, TokenPair

router = APIRouter(prefix="/api/v1/auth/staff", tags=["auth-staff"])

_bad_credentials = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")


@router.post("/login", response_model=TokenPair)
def login(body: LoginRequest, db: Session = Depends(get_db)) -> TokenPair:
    staff = db.query(Staff).filter(Staff.email == body.email).first()
    if staff is None or not staff.is_active or not verify_password(body.password, staff.hashed_password):
        raise _bad_credentials
    subject = str(staff.id)
    return TokenPair(
        access_token=create_access_token(subject, Audience.STAFF),
        refresh_token=create_refresh_token(subject, Audience.STAFF),
    )


@router.post("/refresh", response_model=TokenPair)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)) -> TokenPair:
    payload = decode_token(body.refresh_token, Audience.STAFF)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    staff = db.get(Staff, uuid.UUID(payload["sub"]))
    if staff is None or not staff.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    subject = str(staff.id)
    return TokenPair(
        access_token=create_access_token(subject, Audience.STAFF),
        refresh_token=create_refresh_token(subject, Audience.STAFF),
    )
