"""Signal service — generates analysis signal from technicals + sentiment.

Safe labels ONLY:
  - Bullish Setup
  - Bearish Setup
  - Neutral / Wait
  - High Uncertainty
  - Risk Elevated
"""

from typing import Dict, Any
from datetime import datetime, timezone


# ── Allowed signal labels ─────────────────────────────────────
SAFE_LABELS = [
    "Bullish Setup",
    "Bearish Setup",
    "Neutral / Wait",
    "High Uncertainty",
    "Risk Elevated",
]


def generate_signal(indicators: Dict[str, Any], sentiment: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
    """Combine technical + sentiment scores into a single analysis signal."""
    if not indicators.get("available", False):
        return _empty_signal()

    ind_meta = indicators.get("_meta", {})
    sent_meta = sentiment.get("_meta", {})
    pred_meta = prediction.get("_meta", {})

    # Technical score (0-100 scale)
    tech_score = 50.0
    if indicators["trend"] == "Bullish":
        tech_score += 20
    elif indicators["trend"] == "Bearish":
        tech_score -= 20

    rsi = indicators.get("rsi", 50)
    if rsi is not None:
        if rsi > 70:
            tech_score -= 10  # Overbought
        elif rsi < 30:
            tech_score += 10  # Oversold

    # Sentiment score (normalized to 0-100)
    raw_sent = sentiment.get("sentiment_score", 0)
    sent_score = raw_sent * 100  # -100 to 100

    # Combined score — weighted average
    combined = (tech_score + (sent_score / 2 + 50)) / 2

    # Map to safe labels
    label = "Neutral / Wait"
    if combined > 70:
        label = "Bullish Setup"
    elif combined < 30:
        label = "Bearish Setup"
    elif indicators.get("volatility", 0) > indicators.get("moving_averages", {}).get("sma_20", 1) * 0.05:
        label = "Risk Elevated"

    # Risk flags
    risk_flags = []
    if indicators.get("volatility", 0) > indicators.get("moving_averages", {}).get("sma_20", 1) * 0.05:
        risk_flags.append("High historical volatility")
    if sentiment.get("_meta", {}).get("news_mode") == "demo":
        risk_flags.append("Sentiment based on demo news — not real data")

    # Determine overall confidence
    confidence = "Low"
    if ind_meta.get("mode") == "real" and sent_meta.get("news_mode") == "real":
        confidence = "Medium"
    elif ind_meta.get("mode") == "real":
        confidence = "Low-Medium"

    # Determine overall mode — real only if ALL inputs are real
    modes = [ind_meta.get("mode", "unknown"), sent_meta.get("mode", "unknown"), pred_meta.get("mode", "unknown")]
    if all(m == "real" for m in modes):
        overall_mode = "real"
    elif any(m == "real" for m in modes):
        overall_mode = "mixed"
    else:
        overall_mode = "fallback"

    return {
        "signal_label": label,
        "confidence": confidence,
        "reason_breakdown": f"Technical: {round(tech_score, 1)}/100, Sentiment: {sentiment.get('overall_sentiment', 'Neutral')} ({round(sent_score, 1)})",
        "technical_score": round(tech_score, 1),
        "sentiment_score": round(sent_score, 1),
        "combined_score": round(combined, 1),
        "risk_flags": risk_flags,
        "data_used": ["Technicals", "Sentiment"],
        "missing_data": [] if sentiment.get("model_used") != "None" else ["Sentiment Data"],
        "disclaimer": "Analysis-only signal. Not financial advice.",
        "_meta": {
            "mode": overall_mode,
            "source": "heuristic_signal_engine",
            "data_modes": {
                "indicators": ind_meta.get("mode", "unknown"),
                "sentiment": sent_meta.get("mode", "unknown"),
                "prediction": pred_meta.get("mode", "unknown"),
            },
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }


def _empty_signal() -> Dict[str, Any]:
    return {
        "signal_label": "High Uncertainty",
        "confidence": "None",
        "reason_breakdown": "Missing required data",
        "technical_score": 0.0,
        "sentiment_score": 0.0,
        "combined_score": 0.0,
        "risk_flags": ["Insufficient data"],
        "data_used": [],
        "missing_data": ["Technicals", "Sentiment", "Prediction"],
        "disclaimer": "Analysis-only signal. Not financial advice.",
        "_meta": {
            "mode": "unavailable",
            "source": "none",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }
