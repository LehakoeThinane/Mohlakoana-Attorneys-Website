import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class Client(Base):
    """A person or organisation the firm represents or has been contacted by.

    Created either by the public-site contact form (no password yet) or
    directly by staff. Portal access is invite-only — see invite_token —
    since self-registration against a guessable matter reference number
    would be a credential-enumeration risk for a law firm.
    """

    __tablename__ = "clients"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)

    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    invite_token: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    invite_token_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    portal_activated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # BFP-facing fields never live here beyond name/email/phone — ID numbers
    # and matter substance stay in this database and are never forwarded.
    bfp_customer_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
