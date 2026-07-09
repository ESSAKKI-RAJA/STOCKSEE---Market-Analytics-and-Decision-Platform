from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.db_health_service import check_db_health
from app.schemas.health_schema import DBHealthResponse

router = APIRouter()

@router.get("/system/db-health", response_model=DBHealthResponse)
def db_health(db: Session = Depends(get_db)):
    is_healthy = check_db_health(db)
    if is_healthy:
        return DBHealthResponse(status="ok", database="connected")
    else:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "database": "disconnected", "detail": "Database connection failed or timeout."}
        )
