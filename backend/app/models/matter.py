import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class MatterStatus(str, enum.Enum):
    OPENED = "opened"
    IN_PROGRESS = "in_progress"
    AWAITING_CLIENT = "awaiting_client"
    CLOSED = "closed"


class Matter(Base):
    """A matter the firm is handling for a client.

    This row's own `id` is the `matter_id` used everywhere else in the
    system — it's what the BFP sync adapter tags forwarded Tasks,
    Documents, and Invoices with, so document/invoice lookups can filter
    BFP records without duplicating them locally.
    """

    __tablename__ = "matters"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    staff_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("staff.id"), nullable=True)

    reference: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[MatterStatus] = mapped_column(
        # values_callable is required here: SQLAlchemy's Enum type binds the
        # Python member NAME ("OPENED") by default, not its value ("opened").
        # The Postgres enum type's labels are lowercase (see the 0001
        # migration), so without this every insert/update fails.
        Enum(MatterStatus, name="matter_status", values_callable=lambda enum_cls: [e.value for e in enum_cls]),
        nullable=False,
        default=MatterStatus.OPENED,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Set once Phase 3's adapter creates the corresponding BFP Task.
    bfp_task_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
