from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# =======================
# AUTH & USER
# =======================
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_admin: bool = False  # <--- Sent to frontend

    class Config:
        from_attributes = True


# =======================
# EVENTS
# =======================
class EventBase(BaseModel):
    title: str
    date: datetime
    venue: str
    description: Optional[str] = None


class EventCreate(EventBase):
    pass


# =======================
# TICKET TYPES
# =======================
class TicketTypeBase(BaseModel):
    category: str
    price: float
    quantity_available: int


class TicketTypeCreate(TicketTypeBase):
    pass


class TicketTypeResponse(TicketTypeBase):
    id: int
    event_id: int
    event: Optional[EventBase] = None  # Nested Event Data

    class Config:
        from_attributes = True


# =======================
# EVENT RESPONSE (Combined)
# =======================
class EventResponse(EventBase):
    id: int
    ticket_types: List[TicketTypeResponse] = []

    class Config:
        from_attributes = True


# =======================
# BOOKINGS
# =======================
class TicketCreate(BaseModel):
    ticket_type_id: int


class TicketResponse(BaseModel):
    id: int
    purchase_date: datetime
    ticket_type: Optional[TicketTypeResponse] = None

    class Config:
        from_attributes = True
