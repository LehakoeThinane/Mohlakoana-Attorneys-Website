"""initial schema: staff, clients, matters

Revision ID: 0001
Revises:
Create Date: 2026-07-29

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "staff",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), nullable=False, server_default="attorney"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_staff_email", "staff", ["email"], unique=True)

    op.create_table(
        "clients",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("hashed_password", sa.String(255), nullable=True),
        sa.Column("invite_token", sa.String(255), nullable=True),
        sa.Column("invite_token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("portal_activated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("bfp_customer_id", sa.String(100), nullable=True),
    )
    op.create_index("ix_clients_email", "clients", ["email"], unique=True)
    op.create_index("ix_clients_invite_token", "clients", ["invite_token"], unique=True)

    matter_status = postgresql.ENUM(
        "opened", "in_progress", "awaiting_client", "closed", name="matter_status", create_type=False
    )
    matter_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "matters",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("client_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("clients.id"), nullable=False),
        sa.Column("staff_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("staff.id"), nullable=True),
        sa.Column("reference", sa.String(50), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("status", matter_status, nullable=False, server_default="opened"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("bfp_task_id", sa.String(100), nullable=True),
    )
    op.create_index("ix_matters_reference", "matters", ["reference"], unique=True)


def downgrade() -> None:
    op.drop_table("matters")
    op.execute("DROP TYPE matter_status")
    op.drop_table("clients")
    op.drop_table("staff")
