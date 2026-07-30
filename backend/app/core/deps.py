import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import Audience, decode_token
from app.database import get_db
from app.models.client import Client
from app.models.staff import Staff

staff_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/staff/login", auto_error=False)
client_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/client/login", auto_error=False)

_credentials_error = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_staff(
    token: str | None = Depends(staff_oauth2_scheme),
    db: Session = Depends(get_db),
) -> Staff:
    if token is None:
        raise _credentials_error
    payload = decode_token(token, Audience.STAFF)
    if payload is None or payload.get("type") != "access":
        raise _credentials_error
    staff = db.get(Staff, uuid.UUID(payload["sub"]))
    if staff is None or not staff.is_active:
        raise _credentials_error
    return staff


def get_current_client(
    token: str | None = Depends(client_oauth2_scheme),
    db: Session = Depends(get_db),
) -> Client:
    if token is None:
        raise _credentials_error
    payload = decode_token(token, Audience.CLIENT)
    if payload is None or payload.get("type") != "access":
        raise _credentials_error
    client = db.get(Client, uuid.UUID(payload["sub"]))
    if client is None or not client.is_active:
        raise _credentials_error
    return client
