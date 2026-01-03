"""
Database Configuration
Using SQLite - no server required!
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# FORCE SQLite - ignore DATABASE_URL env var for now
# This creates a local file 'medinsight.db' - no server setup needed
DATABASE_URL = "sqlite:///./medinsight.db"

# Create engine for SQLite
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite needs this
)
print(f"✓ Using SQLite database: medinsight.db")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    from models.db_models import Base
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully")
