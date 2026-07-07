"""Prediction service — conservative trend projection ONLY.

Uses SMA crossover + momentum heuristic for simple directional bias.
No ML models (LSTM, Prophet, etc.) are loaded — this is stated clearly.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone


def generate_prediction(symbol: str, history_data: Dict[str, Any], indicators: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a conservative trend projection.

    This is NOT a price target — it's a directional bias based on
    simple technical indicators.
    """
    rows = history_data.get("rows", [])
    history_meta = history_data.get("_meta", {})
    data_mode = history_meta.get("mode", "unknown")

    if not rows or not indicators.get("available", False):
        return _empty_prediction()

    trend = indicators.get("trend", "Neutral")
    current_price = float(rows[-1]["close"])

    projected_price = current_price
    direction = "Sideways"
    confidence = "Low"

    if trend == "Bullish":
        projected_price = current_price * 1.02  # Conservative 2% up
        direction = "Up"
        confidence = "Low-Medium"
    elif trend == "Bearish":
        projected_price = current_price * 0.98  # Conservative 2% down
        direction = "Down"
        confidence = "Low-Medium"

    return {
        "projected_price": round(projected_price, 2),
        "prediction_direction": direction,
        "confidence": confidence,
        "model_used": "Simple_Trend_Projection",
        "data_points_used": len(rows),
        "limitations": "Conservative trend projection using SMA + momentum heuristic. No ML model loaded.",
        "_meta": {
            "mode": data_mode,
            "source": "trend_projection",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }


def _empty_prediction() -> Dict[str, Any]:
    return {
        "projected_price": 0.0,
        "prediction_direction": "Unknown",
        "confidence": "None",
        "model_used": "None",
        "data_points_used": 0,
        "limitations": "Insufficient data to project.",
        "_meta": {
            "mode": "unavailable",
            "source": "none",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }
