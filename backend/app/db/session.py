from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Require DATABASE_URL to be set in environment
db_url = settings.DATABASE_URL
if not db_url:
    raise ValueError("DATABASE_URL is not set")

engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
