# SQLAlchemy models for the event booking database
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    """User model representing registered users."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_admin = Column(Boolean, default=False)
    tickets = relationship("Ticket", back_populates="user")


class Event(Base):
    """Event model representing events that can be booked."""

    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    date = Column(DateTime)  # Start Time
    end_time = Column(DateTime)
    venue = Column(String)
    description = Column(String)

    ticket_types = relationship(
        "TicketType", back_populates="event", cascade="all, delete-orphan"
    )


class TicketType(Base):
    """Ticket type model representing different ticket categories for events."""

    __tablename__ = "ticket_types"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    price = Column(Float)
    quantity_available = Column(Integer)
    event_id = Column(Integer, ForeignKey("events.id"))

    event = relationship("Event", back_populates="ticket_types")
    tickets = relationship("Ticket", back_populates="ticket_type")


class Ticket(Base):
    """Ticket model representing booked tickets."""

    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ticket_type_id = Column(Integer, ForeignKey("ticket_types.id"))
    purchase_date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="tickets")
    ticket_type = relationship("TicketType", back_populates="tickets")
