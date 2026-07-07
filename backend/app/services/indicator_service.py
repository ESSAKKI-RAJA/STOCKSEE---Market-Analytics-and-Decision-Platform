"""Indicator service — calculates technical indicators from close prices.

Uses only the actual historical close prices from yfinance or demo data.
Never generates synthetic or random data for indicators.
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List
from datetime import datetime, timezone

from app.services.cache_service import get_cached_payload, set_cached_payload


def calculate_indicators(symbol: str, history_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate RSI, MACD, MAs, trend from history rows."""
    cached = get_cached_payload(symbol, "indicators")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return cached
    rows = history_data.get("rows", [])
    history_meta = history_data.get("_meta", {})
    data_mode = history_meta.get("mode", "unknown")
    data_source = history_meta.get("source", "unknown")

    if not rows or len(rows) < 2:
        empty = _empty_indicators()
        empty["_meta"]["data_mode"] = data_mode
        return empty

    df = pd.DataFrame(rows)
    closes = df["close"].astype(float)

    # Simple Moving Averages
    sma_20 = float(closes.rolling(window=20, min_periods=1).mean().iloc[-1])
    sma_50 = float(closes.rolling(window=50, min_periods=1).mean().iloc[-1])

    # RSI (14-period)
    delta = closes.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14, min_periods=1).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14, min_periods=1).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    current_rsi = float(rsi.iloc[-1]) if not pd.isna(rsi.iloc[-1]) else 50.0

    # MACD
    ema_12 = closes.ewm(span=12, adjust=False).mean()
    ema_26 = closes.ewm(span=26, adjust=False).mean()
    macd_line = ema_12 - ema_26
    signal_line = macd_line.ewm(span=9, adjust=False).mean()
    hist = macd_line - signal_line

    current_close = float(closes.iloc[-1])
    first_close = float(closes.iloc[0])
    price_change = ((current_close - first_close) / first_close) * 100 if first_close > 0 else 0
    volatility = float(closes.std()) if len(closes) > 1 else 0.0

    trend = "Neutral"
    if current_close > sma_20 and current_rsi > 55:
        trend = "Bullish"
    elif current_close < sma_20 and current_rsi < 45:
        trend = "Bearish"

    payload = {
        "rsi": round(current_rsi, 2),
        "macd": {
            "macd": round(float(macd_line.iloc[-1]), 2),
            "signal": round(float(signal_line.iloc[-1]), 2),
            "histogram": round(float(hist.iloc[-1]), 2),
        },
        "moving_averages": {
            "sma_20": round(sma_20, 2),
            "sma_50": round(sma_50, 2),
        },
        "price_change_pct": round(price_change, 2),
        "volatility": round(volatility, 2),
        "trend": trend,
        "available": True,
        "_meta": {
            "mode": data_mode,
            "source": f"calculated_from_{data_source}",
            "data_points": len(rows),
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }

    set_cached_payload(symbol, "indicators", payload, data_mode, f"calculated_from_{data_source}", 360)
    return payload


def _empty_indicators() -> Dict[str, Any]:
    return {
        "rsi": None,
        "macd": {"macd": None, "signal": None, "histogram": None},
        "moving_averages": {"sma_20": None, "sma_50": None},
        "price_change_pct": 0.0,
        "volatility": 0.0,
        "trend": "Neutral",
        "available": False,
        "_meta": {
            "mode": "unavailable",
            "source": "none",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }
