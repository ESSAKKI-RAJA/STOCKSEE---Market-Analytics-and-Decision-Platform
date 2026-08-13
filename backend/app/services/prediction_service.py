"""Prediction service — conservative trend projection ONLY.

Uses SMA crossover + momentum heuristic for simple directional bias.
No ML models (LSTM, Prophet, etc.) are loaded — this is stated clearly.
Replaces false-precision price targeting with Scenario Projection.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone


def generate_prediction(symbol: str, history_data: Dict[str, Any], indicators: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a conservative Scenario Projection.

    This replaces the legacy ±2% numerical target, producing textual
    scenarios mapped to current technical momentum constraints.
    """
    rows = history_data.get("rows", [])
    history_meta = history_data.get("_meta", {})
    data_mode = history_meta.get("mode", "unknown")

    if not rows or not indicators.get("available", False):
        return _empty_prediction()

    trend = indicators.get("trend", "Neutral")
    
    # We no longer calculate a static price. We provide a descriptive scenario.
    projected_price = 0.0 
    direction = "Sideways"
    confidence = "Low"
    scenario = "Market is currently directionless or conflicting. Wait for a clear trend."

    if trend == "Bullish":
        direction = "Up"
        confidence = "Low-Medium"
        scenario = "Current technical evidence suggests continued upward momentum, provided support holds at the 20-day SMA."
    elif trend == "Bearish":
        direction = "Down"
        confidence = "Low-Medium"
        scenario = "Current technical evidence suggests downward pressure; risk of further decline remains elevated."

    return {
        "projected_price": round(projected_price, 2), # Retained as 0.0 for API contract backward compatibility
        "prediction_direction": direction,
        "scenario_projection": scenario,
        "confidence": confidence,
        "model_used": "Deterministic_Scenario_Projection",
        "data_points_used": len(rows),
        "limitations": "Conservative trend projection. No ML model loaded. No price target provided.",
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
        "scenario_projection": "Insufficient data to establish a market scenario.",
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
