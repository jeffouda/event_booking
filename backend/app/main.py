from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from jose import JWTError, jwt
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas, crud, auth, database

# Initialize Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Event-Booking API", version="1.0.0")


# Configuration

# CORS: Allow frontend communication
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency: Database Session Management
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Auth: OAuth2 Scheme Configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Dependency: Current User Retrieval
def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user


# Routes: Authentication

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Authenticate user and return JWT token."""
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Routes: Events

@app.get("/events", response_model=List[schemas.EventResponse])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Public endpoint to view all events."""
    events = crud.get_events(db, skip=skip, limit=limit)
    return events


@app.post("/events", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    """Protected endpoint to create a new event."""
    return crud.create_event(db=db, event=event)


@app.delete("/events/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    """Protected endpoint to delete an event."""
    event = crud.delete_event(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"detail": "Event deleted successfully"}


# Routes: Ticket types

@app.post("/events/{event_id}/tickets", response_model=schemas.TicketTypeResponse)
def create_ticket_type(
    event_id: int,
    ticket_type: schemas.TicketTypeCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    """
    Protected endpoint to add a ticket category to an event.
    Example: Add 'VIP' tickets to 'Tech Conference'.
    """
    return crud.create_ticket_type(db=db, ticket_type=ticket_type, event_id=event_id)

# Routes: Bookings

@app.post("/book", response_model=schemas.TicketResponse)
def book_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    """
    Protected endpoint for a user to purchase a ticket.
    """
    return crud.book_ticket(
        db=db, ticket_type_id=ticket.ticket_type_id, user_id=current_user.id
    )


@app.get("/my-tickets", response_model=List[schemas.TicketResponse])
def read_user_tickets(
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    """
    Protected endpoint to see all tickets purchased by the logged-in user.
    """
    return crud.get_user_tickets(db=db, user_id=current_user.id)
