from pydantic import BaseModel
from typing import Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    market_data: Optional[Dict[str, Any]] = None

class DBHealthResponse(BaseModel):
    status: str
    database: str
    detail: Optional[str] = None
