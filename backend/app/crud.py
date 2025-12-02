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
