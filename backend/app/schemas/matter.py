import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.matter import MatterStatus


class MatterCreate(BaseModel):
    client_id: uuid.UUID
    staff_id: uuid.UUID | None = None
    reference: str
    title: str


class MatterStatusUpdate(BaseModel):
    status: MatterStatus


class MatterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    client_id: uuid.UUID
    staff_id: uuid.UUID | None
    reference: str
    title: str
    status: MatterStatus
    created_at: datetime
    updated_at: datetime
