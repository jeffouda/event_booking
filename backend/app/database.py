from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Define the database URL (SQLite for now)
SQLALCHEMY_DATABASE_URL = "sqlite:///./event_booking.db"

# 2. Create the engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Create the SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Define the Base class (THIS IS WHAT WAS MISSING)
Base = declarative_base()
