import uuid

from pydantic import BaseModel, ConfigDict, EmailStr


class StaffCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "attorney"


class StaffOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
