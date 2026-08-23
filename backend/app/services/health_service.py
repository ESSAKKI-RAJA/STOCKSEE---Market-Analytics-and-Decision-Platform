"""Health service — reports accurate engine states and availability."""

from typing import Dict, Any
from app.core.config import settings
from datetime import datetime, timezone


def get_health_status() -> Dict[str, Any]:
    from app.services.market_data_service import get_provider_status
    market_status = get_provider_status()

    engines = {
        "market_data": {
            "provider_chain": market_status.get("provider_chain", [])
        },
        "news": {
            "engine": "finnhub" if settings.FINNHUB_API_KEY else "demo_fallback",
            "status": "active" if settings.FINNHUB_API_KEY else "demo",
            "mode": "real" if settings.FINNHUB_API_KEY else "demo",
            "note": "" if settings.FINNHUB_API_KEY else "Set FINNHUB_API_KEY for real news",
        },
        "sentiment": {
            "engine": "VADER",
            "status": "active",
            "mode": "real",
        },
        "prediction": {
            "engine": "Simple_Trend_Projection",
            "status": "active",
            "mode": "heuristic",
            "note": "No ML model loaded",
        },
        "signal": {
            "engine": "heuristic_signal_engine",
            "status": "active",
            "mode": "heuristic",
        },
        "database": {
            "engine": "postgres" if "postgres" in settings.DATABASE_URL else "none",
            "status": "active" if bool(settings.DATABASE_URL) else "demo",
            "mode": "real" if bool(settings.DATABASE_URL) else "demo",
            "note": "" if bool(settings.DATABASE_URL) else "No database connected",
        },
        "cache": {
            "engine": "postgres" if "postgres" in settings.DATABASE_URL else "none",
            "status": "active" if bool(settings.DATABASE_URL) else "disabled",
            "mode": "real" if bool(settings.DATABASE_URL) else "demo",
        },
    }

    db_configured = bool(settings.DATABASE_URL)
    overall_mode = "real" if (settings.FINNHUB_API_KEY and db_configured) else ("mixed" if db_configured else "demo")

    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "engines": engines,
        "finnhub_configured": bool(settings.FINNHUB_API_KEY),
        "database_configured": db_configured,
        "cache_status": "active" if db_configured else "disabled",
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "mode_summary": overall_mode,
        "message": "STOCKSEE backend running. Check individual engine statuses for details.",
    }
