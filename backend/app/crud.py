from sqlalchemy.orm import Session
from . import models, schemas, auth


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    # 1. Hash the password
    hashed_password = auth.get_password_hash(user.password)

    # 2. Create the User Model
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,  # Store hash, NOT plain password
    )

    # 3. Add to DB and Commit
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ... (Keep existing imports and User functions) ...

# --- EVENT CRUD OPERATIONS ---


def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Event).offset(skip).limit(limit).all()


def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(
        title=event.title,
        date=event.date,
        venue=event.venue,
        description=event.description,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event