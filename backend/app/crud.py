# Database operations for the event booking app
from sqlalchemy.orm import Session, joinedload
from . import models, schemas, auth


def get_user_by_email(db: Session, email: str):
    """Get user by email."""
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user with hashed password."""
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username, email=user.email, password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_events(db: Session, skip: int = 0, limit: int = 100):
    """Get list of events with ticket types."""
    return (
        db.query(models.Event)
        .options(joinedload(models.Event.ticket_types))
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_event(db: Session, event: schemas.EventCreate):
    """Create a new event."""
    db_event = models.Event(
        title=event.title,
        date=event.date,
        end_time=event.end_time,
        venue=event.venue,
        description=event.description,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int):
    """Delete an event by ID."""
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event


def create_ticket_type(
    db: Session, ticket_type: schemas.TicketTypeCreate, event_id: int
):
    """Create a ticket type for an event."""
    db_ticket_type = models.TicketType(**ticket_type.dict(), event_id=event_id)
    db.add(db_ticket_type)
    db.commit()
    db.refresh(db_ticket_type)
    return db_ticket_type


def book_ticket(db: Session, ticket_type_id: int, user_id: int):
    """Book a ticket for a user."""
    ticket_type = (
        db.query(models.TicketType)
        .filter(models.TicketType.id == ticket_type_id)
        .first()
    )
    db_ticket = models.Ticket(ticket_type_id=ticket_type_id, user_id=user_id)
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    db_ticket.ticket_type = ticket_type
    return db_ticket


def get_user_tickets(db: Session, user_id: int):
    """Get all tickets for a user."""
    return (
        db.query(models.Ticket)
        .options(
            joinedload(models.Ticket.ticket_type).joinedload(models.TicketType.event)
        )
        .filter(models.Ticket.user_id == user_id)
        .all()
    )
