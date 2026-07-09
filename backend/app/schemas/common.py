from pydantic import BaseModel, Field
from typing import Any, Dict, Optional, List
from datetime import datetime, timezone


class FallbackResponse(BaseModel):
    """Standard STOCKSEE API response envelope.

    Every endpoint wraps its payload in this schema so the frontend can
    always determine whether data is real, demo, or fallback — and why.
    """
    status: str = "ok"
    mode: str = "fallback"          # real / demo / fallback / unavailable
    source: str = "system"          # yfinance / finnhub / vader / demo / trend_projection / heuristic
    message: str = "Engine not fully implemented. Returning fallback data."
    data: Any = None
    limitations: Optional[str] = "Experimental analysis only. Not financial advice."
    generated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    )
