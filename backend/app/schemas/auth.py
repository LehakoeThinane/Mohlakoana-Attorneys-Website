from pydantic import BaseModel, EmailStr, Field

# bcrypt only uses the first 72 bytes of a password; capping input length
# here keeps that truncation from being a surprise and blocks oversized
# payloads from reaching the hashing step at all.
_PASSWORD_MAX_LENGTH = 72


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(max_length=_PASSWORD_MAX_LENGTH)


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class AcceptInviteRequest(BaseModel):
    invite_token: str
    password: str = Field(max_length=_PASSWORD_MAX_LENGTH)
