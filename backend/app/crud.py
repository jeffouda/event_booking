
from sqlalchemy.orm import Session, joinedload
from . import models, schemas, auth

#USER OPERATIONS


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username, email=user.email, password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


#EVENT OPERATIONS 
def get_events(db: Session, skip: int = 0, limit: int = 100):
    # We use joinedload to fetch ticket types efficiently
    return (
        db.query(models.Event)
        .options(joinedload(models.Event.ticket_types))
        .offset(skip)
        .limit(limit)
        .all()
    )



def create_event(db: Session, event: schemas.EventCreate, user_id: int):
    db_event = models.Event(
        title=event.title,
        date=event.date,
        end_time=event.end_time,
        venue=event.venue,
        description=event.description,
        owner_id=user_id,  
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def update_event(db: Session, event_id: int, event_data: schemas.EventCreate):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        db_event.title = event_data.title
        db_event.venue = event_data.venue
        db_event.date = event_data.date
        db_event.end_time = event_data.end_time
        db_event.description = event_data.description
        db.commit()
        db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event


#TICKET OPERATIONS 
def create_ticket_type(
    db: Session, ticket_type: schemas.TicketTypeCreate, event_id: int
):
    db_ticket_type = models.TicketType(**ticket_type.dict(), event_id=event_id)
    db.add(db_ticket_type)
    db.commit()
    db.refresh(db_ticket_type)
    return db_ticket_type


def book_ticket(db: Session, ticket_type_id: int, user_id: int):
    # Verify ticket type exists first
    ticket_type = (
        db.query(models.TicketType)
        .filter(models.TicketType.id == ticket_type_id)
        .first()
    )
    if not ticket_type:
        return None

    db_ticket = models.Ticket(ticket_type_id=ticket_type_id, user_id=user_id)
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    
    db_ticket.ticket_type = ticket_type
    return db_ticket


def get_user_tickets(db: Session, user_id: int):
    return (
        db.query(models.Ticket)
        .options(
            joinedload(models.Ticket.ticket_type).joinedload(models.TicketType.event)
        )
        .filter(models.Ticket.user_id == user_id)
        .all()
    )
