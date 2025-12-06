from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from jose import JWTError, jwt
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas, crud, auth, database

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="EventSphere API", version="1.0.0")


# We use ["*"] to explicitly allow ALL origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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


#AUTH ROUTES 


@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)

    
    # We include 'user_id' so the frontend knows who the user is.
    access_token = auth.create_access_token(
        data={
            "sub": user.email,
            "username": user.username,
            "is_admin": user.is_admin,
            "user_id": user.id,  # <--- CRITICAL FOR EDITING
        },
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}


#EVENT ROUTES


@app.get("/events", response_model=List[schemas.EventResponse])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = crud.get_events(db, skip=skip, limit=limit)
    return events


@app.post("/events", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    # Pass current_user.id so we know who the owner is
    return crud.create_event(db=db, event=event, user_id=current_user.id)


@app.put("/events/{event_id}", response_model=schemas.EventResponse)
def update_event(
    event_id: int,
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    # Check if event exists
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Permission Check: Must be Admin OR Owner
    if db_event.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to edit this event")

    return crud.update_event(db=db, event_id=event_id, event_data=event)


@app.delete("/events/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()

    # Permission Check Here Too
    if db_event and db_event.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this event"
        )

    event = crud.delete_event(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"detail": "Event deleted successfully"}


#TICKET ROUTES 


@app.post("/events/{event_id}/tickets", response_model=schemas.TicketTypeResponse)
def create_ticket_type(
    event_id: int,
    ticket_type: schemas.TicketTypeCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    return crud.create_ticket_type(db=db, ticket_type=ticket_type, event_id=event_id)


@app.post("/book", response_model=schemas.TicketResponse)
def book_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    return crud.book_ticket(
        db=db, ticket_type_id=ticket.ticket_type_id, user_id=current_user.id
    )


@app.get("/my-tickets", response_model=List[schemas.TicketResponse])
def read_user_tickets(
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    return crud.get_user_tickets(db=db, user_id=current_user.id)
