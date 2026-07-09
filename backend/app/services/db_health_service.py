from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException

def check_db_health(db: Session) -> bool:
    try:
        db.execute(text("SELECT 1"))
        return True
    except Exception as e:
        return False
