from fastapi import APIRouter
from app.schemas.health_schema import HealthResponse
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        service="STOCKSEE backend",
        environment=settings.ENVIRONMENT
    )
