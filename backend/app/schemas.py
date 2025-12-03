from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# Authentication

class Token(BaseModel):
    """Schema for returning JWT access tokens."""

    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for extracting data from JWT tokens."""

    email: Optional[str] = None


# Users



class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    """Schema for user registration input."""

    password: str


class UserResponse(UserBase):
    """Schema for user data output (excludes password)."""

    id: int

    class Config:
        from_attributes = True


# Ticket Types

class TicketTypeBase(BaseModel):
    category: str  # e.g., "VIP", "Regular"
    price: float
    quantity_available: int


class TicketTypeCreate(TicketTypeBase):
    pass


class TicketTypeResponse(TicketTypeBase):
    id: int
    event_id: int

    class Config:
        from_attributes = True


# Events

class EventBase(BaseModel):
    title: str
    date: datetime
    venue: str
    description: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventResponse(EventBase):
    """Schema for event output, including available ticket types."""

    id: int
    # Nested relationship: Show ticket types inside the event
    ticket_types: List[TicketTypeResponse] = []

    class Config:
        from_attributes = True


# Booking

class TicketCreate(BaseModel):
    """Input for booking a ticket."""

    ticket_type_id: int


class TicketResponse(BaseModel):
    """Output for a booked ticket, showing event details."""

    id: int
    purchase_date: datetime
    ticket_type: TicketTypeResponse
    # We can nest the event details here so the user knows what they booked
    # Note: Requires slight adjustment in models relationship loading to avoid recursion

    class Config:
        from_attributes = True
