from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from jose import JWTError, jwt
from typing import List  # <--- 1. IMPORT ADDED HERE

from . import models, schemas, crud, auth, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()


# 1. Dependency: Get DB Session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 2. Security: The "Lock" Mechanism
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# 3. Helper: Get Current User from Token
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


# --- AUTH ROUTES ---


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
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# --- EVENT ROUTES ---


# GET /events -> Public
# CHANGED: list[...] became List[...] below
@app.get("/events", response_model=List[schemas.EventResponse])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = crud.get_events(db, skip=skip, limit=limit)
    return events


# POST /events -> Protected
@app.post("/events", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    return crud.create_event(db=db, event=event)


# DELETE /events/{id} -> Protected
@app.delete("/events/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user),
):
    event = crud.delete_event(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"detail": "Event deleted successfully"}
