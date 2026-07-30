import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class ClientCreate(BaseModel):
    """Used both by the public contact form and by staff creating a client
    directly. No password here — portal access is granted via invite."""

    email: EmailStr
    full_name: str
    phone: str | None = None


class ClientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    full_name: str
    phone: str | None
    is_active: bool
    portal_activated_at: datetime | None = None
