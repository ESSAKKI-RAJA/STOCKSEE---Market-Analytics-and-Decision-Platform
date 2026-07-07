"""Market data service — fetches quotes and history from yfinance.

Returns structured dicts with a `_meta` key containing mode/source info
so the API layer can propagate transparency to the frontend.
"""

import yfinance as yf
import pandas as pd
from typing import Dict, Any, List
from datetime import datetime, timezone
import logging
import time

from app.services.cache_service import get_cached_payload, set_cached_payload, get_stale_cache, log_source_event

logger = logging.getLogger(__name__)


def get_market_quote(symbol: str) -> Dict[str, Any]:
    """Fetch live quote via yfinance. Falls back to stale cache or demo data on error."""
    # 1. Try valid cache
    cached = get_cached_payload(symbol, "quote")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return cached

    start_time = time.time()
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.fast_info

        price = float(info.get("last_price", 0.0) or 0.0)
        prev_close = float(info.get("previous_close", 0.0) or 0.0)

        if price <= 0:
            raise ValueError(f"Invalid price {price} for {symbol}")

        payload = {
            "symbol": symbol,
            "price": round(price, 2),
            "previous_close": round(prev_close, 2),
            "volume": int(info.get("last_volume", 0) or 0),
            "market_cap": float(info.get("market_cap", 0.0) or 0.0),
            "success": True,
            "source": "yfinance",
            "delay_label": "~15 min delay",
            "_meta": {
                "mode": "real",
                "source": "yfinance",
                "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            },
        }

        latency = int((time.time() - start_time) * 1000)
        log_source_event(symbol, "quote", "yfinance", "real", True, latency)

        # Save to cache (TTL: 5 mins)
        set_cached_payload(symbol, "quote", payload, "real", "yfinance", 5)

        return payload

    except Exception as e:
        latency = int((time.time() - start_time) * 1000)
        logger.warning(f"Failed to fetch quote for {symbol}: {e}")
        log_source_event(symbol, "quote", "yfinance", "fallback", False, latency, str(e))

        stale = get_stale_cache(symbol, "quote")
        if stale:
            stale["_meta"]["mode"] = "stale_cache"
            stale["_meta"]["cache_hit"] = True
            return stale

        return _get_demo_quote(symbol)


def get_market_history(symbol: str, period: str = "1mo") -> Dict[str, Any]:
    """Fetch historical OHLCV via yfinance. Returns dict with rows + _meta."""
    cached = get_cached_payload(symbol, "history")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return cached

    start_time = time.time()
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        if df.empty:
            raise ValueError("Empty data returned")

        rows: List[Dict[str, Any]] = []
        for date, row in df.iterrows():
            rows.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": round(float(row.get("Open", 0.0)), 2),
                "high": round(float(row.get("High", 0.0)), 2),
                "low": round(float(row.get("Low", 0.0)), 2),
                "close": round(float(row.get("Close", 0.0)), 2),
                "volume": int(row.get("Volume", 0)),
                "adjusted_close": round(float(row.get("Close", 0.0)), 2),
            })

        payload = {
            "rows": rows,
            "_meta": {
                "mode": "real",
                "source": "yfinance",
                "data_points": len(rows),
                "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            },
        }

        latency = int((time.time() - start_time) * 1000)
        log_source_event(symbol, "history", "yfinance", "real", True, latency)

        # Cache history (TTL: 6 hours)
        set_cached_payload(symbol, "history", payload, "real", "yfinance", 360)
        return payload
    except Exception as e:
        latency = int((time.time() - start_time) * 1000)
        logger.warning(f"Failed to fetch history for {symbol}: {e}")
        log_source_event(symbol, "history", "yfinance", "fallback", False, latency, str(e))

        stale = get_stale_cache(symbol, "history")
        if stale:
            stale["_meta"]["mode"] = "stale_cache"
            stale["_meta"]["cache_hit"] = True
            return stale

        return _get_demo_history(symbol)


# ─── Demo fallbacks ────────────────────────────────────────────

def _get_demo_quote(symbol: str) -> Dict[str, Any]:
    return {
        "symbol": symbol,
        "price": 150.00,
        "previous_close": 148.50,
        "volume": 1000000,
        "market_cap": 2500000000,
        "success": False,
        "source": "demo",
        "delay_label": "Demo / EOD",
        "_meta": {
            "mode": "demo",
            "source": "demo",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }


def _get_demo_history(symbol: str) -> Dict[str, Any]:
    return {
        "rows": [
            {"date": "2024-01-01", "open": 140, "high": 145, "low": 139, "close": 144, "volume": 10000, "adjusted_close": 144},
            {"date": "2024-01-02", "open": 144, "high": 150, "low": 142, "close": 148, "volume": 12000, "adjusted_close": 148},
            {"date": "2024-01-03", "open": 148, "high": 152, "low": 147, "close": 150, "volume": 15000, "adjusted_close": 150},
        ],
        "_meta": {
            "mode": "demo",
            "source": "demo",
            "data_points": 3,
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }
