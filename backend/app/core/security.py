from datetime import UTC, datetime, timedelta
from enum import Enum
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.config import settings

# bcrypt's algorithm caps input at 72 bytes; anything longer is truncated by
# the library itself. Passwords are already length-limited at the schema
# level, so this is a hard backstop, not the primary control.
_BCRYPT_MAX_BYTES = 72


def hash_password(password: str) -> str:
    truncated = password.encode("utf-8")[:_BCRYPT_MAX_BYTES]
    return bcrypt.hashpw(truncated, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    truncated = password.encode("utf-8")[:_BCRYPT_MAX_BYTES]
    return bcrypt.checkpw(truncated, hashed_password.encode("utf-8"))


class Audience(str, Enum):
    """Staff and client tokens are signed with different secrets so a
    leaked secret for one audience can't be used to mint tokens for the
    other — they are two distinct auth flows, not one shared one."""

    STAFF = "staff"
    CLIENT = "client"


def _secret_for(audience: Audience) -> str:
    return settings.staff_jwt_secret if audience is Audience.STAFF else settings.client_jwt_secret


def create_access_token(subject: str, audience: Audience) -> str:
    expire = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "aud": audience.value, "type": "access", "exp": expire}
    return jwt.encode(payload, _secret_for(audience), algorithm=settings.jwt_algorithm)


def create_refresh_token(subject: str, audience: Audience) -> str:
    expire = datetime.now(UTC) + timedelta(days=settings.refresh_token_expire_days)
    payload = {"sub": subject, "aud": audience.value, "type": "refresh", "exp": expire}
    return jwt.encode(payload, _secret_for(audience), algorithm=settings.jwt_algorithm)


def decode_token(token: str, audience: Audience) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(
            token,
            _secret_for(audience),
            algorithms=[settings.jwt_algorithm],
            audience=audience.value,
        )
    except JWTError:
        return None
    return payload
