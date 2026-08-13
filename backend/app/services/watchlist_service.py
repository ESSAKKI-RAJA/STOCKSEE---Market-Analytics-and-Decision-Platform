from typing import List, Dict, Any
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone
import logging

from app.db.session import SessionLocal
from app.models.cache_models import UserWatchlist
from app.core.config import settings

logger = logging.getLogger(__name__)

# Simple in-memory fallback
_DEMO_WATCHLIST = ["AAPL", "TSLA", "MSFT"]

def is_db_available():
    return bool(settings.DATABASE_URL)

def get_watchlist(user_id: str) -> Dict[str, Any]:
    if is_db_available():
        try:
            with SessionLocal() as db:
                records = db.query(UserWatchlist).filter(UserWatchlist.user_id == user_id).order_by(UserWatchlist.created_at).all()
                symbols = [r.symbol for r in records]
                return {
                    "symbols": symbols,
                    "_meta": {
                        "mode": "real",
                        "source": "database",
                        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    }
                }
        except Exception as e:
            logger.error(f"Failed to fetch watchlist from DB: {e}")

    # Fallback
    return {
        "symbols": _DEMO_WATCHLIST.copy(),
        "_meta": {
            "mode": "demo",
            "source": "in_memory",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        }
    }

def add_to_watchlist(symbol: str, user_id: str) -> Dict[str, Any]:
    sym = symbol.upper().strip()
    if not sym:
        raise ValueError("Invalid symbol")

    if is_db_available():
        try:
            with SessionLocal() as db:
                existing = db.query(UserWatchlist).filter(
                    UserWatchlist.symbol == sym,
                    UserWatchlist.user_id == user_id
                ).first()
                if not existing:
                    record = UserWatchlist(symbol=sym, user_id=user_id)
                    db.add(record)
                    db.commit()
                return {
                    "symbols": [sym],
                    "_meta": {"mode": "real", "source": "database"}
                }
        except Exception as e:
            logger.error(f"Failed to add to watchlist DB: {e}")

    # Fallback
    if sym not in _DEMO_WATCHLIST:
        _DEMO_WATCHLIST.append(sym)
    return {
        "symbols": [sym],
        "_meta": {"mode": "demo", "source": "in_memory"}
    }

def remove_from_watchlist(symbol: str, user_id: str) -> Dict[str, Any]:
    sym = symbol.upper().strip()
    
    if is_db_available():
        try:
            with SessionLocal() as db:
                db.query(UserWatchlist).filter(
                    UserWatchlist.symbol == sym,
                    UserWatchlist.user_id == user_id
                ).delete()
                db.commit()
                return {
                    "symbols": [sym],
                    "_meta": {"mode": "real", "source": "database"}
                }
        except Exception as e:
            logger.error(f"Failed to remove from watchlist DB: {e}")

    # Fallback
    if sym in _DEMO_WATCHLIST:
        _DEMO_WATCHLIST.remove(sym)
    return {
        "symbols": [sym],
        "_meta": {"mode": "demo", "source": "in_memory"}
    }
