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

    if not rows or len(rows) < 14:
        empty = _empty_indicators()
        empty["_meta"]["mode"] = data_mode
        empty["_meta"]["source"] = f"calculated_from_{data_source}"
        empty["_meta"]["data_points"] = len(rows)
        empty["_meta"]["limitation"] = "Insufficient observations to calculate 14-period RSI or technical indicators."
        return empty

    df = pd.DataFrame(rows)
    closes = df["close"].astype(float)

    # Simple Moving Averages (only if sufficient observations exist)
    sma_20 = round(float(closes.iloc[-20:].mean()), 2) if len(closes) >= 20 else None
    sma_50 = round(float(closes.iloc[-50:].mean()), 2) if len(closes) >= 50 else None

    # RSI (14-period strictly requiring at least 14 price differences)
    delta = closes.diff().dropna()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()

    last_loss = loss.iloc[-1]
    last_gain = gain.iloc[-1]

    if pd.isna(last_loss) or pd.isna(last_gain):
        current_rsi = None
    elif last_loss == 0:
        current_rsi = 100.0 if last_gain > 0 else 50.0
    else:
        rs = last_gain / last_loss
        current_rsi = round(float(100 - (100 / (1 + rs))), 2)

    # MACD (requires at least 26 observations for full signal)
    if len(closes) >= 26:
        ema_12 = closes.ewm(span=12, adjust=False).mean()
        ema_26 = closes.ewm(span=26, adjust=False).mean()
        macd_line = ema_12 - ema_26
        signal_line = macd_line.ewm(span=9, adjust=False).mean()
        hist = macd_line - signal_line
        macd_payload = {
            "macd": round(float(macd_line.iloc[-1]), 2),
            "signal": round(float(signal_line.iloc[-1]), 2),
            "histogram": round(float(hist.iloc[-1]), 2),
        }
    else:
        macd_payload = {"macd": None, "signal": None, "histogram": None}

    current_close = float(closes.iloc[-1])
    first_close = float(closes.iloc[0])
    price_change = ((current_close - first_close) / first_close) * 100 if first_close > 0 else 0
    volatility = float(closes.std()) if len(closes) > 1 else 0.0

    trend = "Neutral"
    if sma_20 is not None and current_rsi is not None:
        if current_close > sma_20 and current_rsi > 55:
            trend = "Bullish"
        elif current_close < sma_20 and current_rsi < 45:
            trend = "Bearish"

    payload = {
        "rsi": current_rsi,
        "macd": macd_payload,
        "moving_averages": {
            "sma_20": sma_20,
            "sma_50": sma_50,
        },
        "price_change_pct": round(price_change, 2),
        "volatility": round(volatility, 2),
        "trend": trend,
        "available": current_rsi is not None,
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
