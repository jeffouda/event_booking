from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


# THIS IS THE MISSING CLASS
class UserResponse(UserBase):
    id: int
    # We do NOT include the password in the response!

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy models


# --- Event Schemas (for later) ---
class EventBase(BaseModel):
    title: str
    date: datetime
    venue: str
    description: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventResponse(EventBase):
    id: int

    class Config:
        from_attributes = True
