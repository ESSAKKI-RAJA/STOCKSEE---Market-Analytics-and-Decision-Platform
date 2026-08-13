"""Signal service — generates analysis signal from technicals + sentiment.

Safe labels ONLY:
  - Bullish Setup
  - Bearish Setup
  - Neutral / Wait
  - High Uncertainty
  - Risk Elevated
"""

from typing import Dict, Any, List
from datetime import datetime, timezone


# ── Allowed signal labels ─────────────────────────────────────
SAFE_LABELS = [
    "Bullish Setup",
    "Bearish Setup",
    "Neutral / Wait",
    "High Uncertainty",
    "Risk Elevated",
]


def determine_data_quality(ind_meta: Dict, sent_meta: Dict, pred_meta: Dict) -> str:
    """Classifies overall data quality based on source modes."""
    modes = [ind_meta.get("mode"), sent_meta.get("mode"), pred_meta.get("mode")]
    if "demo" in modes:
        return "LOW"
    if "stale_cache" in modes:
        return "MEDIUM"
    if "unavailable" in modes or "fallback" in modes:
        return "LOW"
    return "HIGH"


def evaluate_technical_state(indicators: Dict) -> Dict:
    """Evaluates Trend, Momentum, and Extension explicitly."""
    state = {
        "trend": "Neutral",
        "momentum": "Neutral",
        "extension": "Neutral",
        "bullish_points": 0,
        "bearish_points": 0,
        "bullish_evidence": [],
        "bearish_evidence": []
    }
    if not indicators.get("available"):
        return state

    sma_20 = indicators.get("moving_averages", {}).get("sma_20", 0)
    sma_50 = indicators.get("moving_averages", {}).get("sma_50", 0)
    
    if sma_20 and sma_50:
        if sma_20 > sma_50 * 1.001:
            state["trend"] = "Bullish"
            state["bullish_points"] += 1
            state["bullish_evidence"].append("Short-term trend (SMA20) is above medium-term trend (SMA50).")
        elif sma_20 < sma_50 * 0.999:
            state["trend"] = "Bearish"
            state["bearish_points"] += 1
            state["bearish_evidence"].append("Short-term trend (SMA20) is below medium-term trend (SMA50).")

    macd = indicators.get("macd", {})
    macd_hist = macd.get("histogram", 0)
    if macd_hist > 0:
        state["momentum"] = "Bullish"
        state["bullish_points"] += 1
        state["bullish_evidence"].append("MACD momentum is positive and strengthening.")
    elif macd_hist < 0:
        state["momentum"] = "Bearish"
        state["bearish_points"] += 1
        state["bearish_evidence"].append("MACD momentum is negative and weakening.")
        
    rsi = indicators.get("rsi", 50)
    if rsi > 70:
        state["extension"] = "Overbought"
        state["bearish_points"] += 1
        state["bearish_evidence"].append("RSI indicates overbought conditions (momentum extended).")
    elif rsi < 30:
        state["extension"] = "Oversold"
        state["bullish_points"] += 1
        state["bullish_evidence"].append("RSI indicates oversold conditions (potential bounce).")
        
    return state


def evaluate_sentiment_state(sentiment: Dict) -> Dict:
    """Evaluates News Sentiment explicitly."""
    state = {
        "bias": "Neutral",
        "bullish_points": 0,
        "bearish_points": 0,
        "bullish_evidence": [],
        "bearish_evidence": []
    }
    score = sentiment.get("sentiment_score", 0)
    if score > 0.15:
        state["bias"] = "Bullish"
        state["bullish_points"] += 1
        state["bullish_evidence"].append("News sentiment is currently positive.")
    elif score < -0.15:
        state["bias"] = "Bearish"
        state["bearish_points"] += 1
        state["bearish_evidence"].append("News sentiment is currently negative.")
    return state


def detect_conflicts(tech: Dict, sent: Dict) -> List[str]:
    """Detects logical contradictions between indicators."""
    conflicts = []
    if tech["trend"] == "Bullish" and tech["extension"] == "Overbought":
        conflicts.append("Trend is bullish, but the asset is overbought, increasing pullback risk.")
    if tech["trend"] == "Bearish" and tech["extension"] == "Oversold":
        conflicts.append("Trend is bearish, but the asset is oversold, increasing bounce risk.")
    if tech["trend"] == "Bullish" and sent["bias"] == "Bearish":
        conflicts.append("Technical trend is bullish, but recent news sentiment is negative.")
    if tech["trend"] == "Bearish" and sent["bias"] == "Bullish":
        conflicts.append("Technical trend is bearish, but recent news sentiment is positive.")
    if tech["trend"] == "Bullish" and tech["momentum"] == "Bearish":
        conflicts.append("Trend is bullish, but underlying MACD momentum is weakening.")
    if tech["trend"] == "Bearish" and tech["momentum"] == "Bullish":
        conflicts.append("Trend is bearish, but underlying MACD momentum is strengthening.")
    return conflicts


def generate_signal(indicators: Dict[str, Any], sentiment: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
    """Generate deterministic decision support based on strict evidence rules."""
    if not indicators.get("available", False):
        return _empty_signal()

    ind_meta = indicators.get("_meta", {})
    sent_meta = sentiment.get("_meta", {})
    pred_meta = prediction.get("_meta", {})

    quality = determine_data_quality(ind_meta, sent_meta, pred_meta)
    tech_state = evaluate_technical_state(indicators)
    sent_state = evaluate_sentiment_state(sentiment)
    conflicts = detect_conflicts(tech_state, sent_state)

    total_bullish = tech_state["bullish_points"] + sent_state["bullish_points"]
    total_bearish = tech_state["bearish_points"] + sent_state["bearish_points"]

    # Final Labeling - Pure evidence count, no arbitrary percentages
    label = "Neutral / Wait"
    if quality == "LOW":
        label = "High Uncertainty"
    elif len(conflicts) >= 2:
        label = "Risk Elevated"
    elif total_bullish >= total_bearish + 2:
        label = "Bullish Setup"
    elif total_bearish >= total_bullish + 2:
        label = "Bearish Setup"

    # Confidence Engine - Tied to data quality and consensus
    confidence = "Low"
    if quality == "HIGH":
        if len(conflicts) == 0:
            confidence = "High"
        elif len(conflicts) == 1:
            confidence = "Medium"
    elif quality == "MEDIUM":
        confidence = "Low-Medium" if len(conflicts) == 0 else "Low"

    # Risk Engine - Explicit triggers
    risk_level = "LOW"
    risk_flags = []
    
    volatility = indicators.get("volatility", 0)
    sma_20 = indicators.get("moving_averages", {}).get("sma_20", 1)
    if sma_20 > 0 and volatility > sma_20 * 0.05:
        risk_flags.append("High historical volatility")
        risk_level = "ELEVATED"
    
    if len(conflicts) >= 2:
        risk_level = "MODERATE" if risk_level == "LOW" else "ELEVATED"
        
    if tech_state["extension"] != "Neutral":
        risk_flags.append(f"Extreme RSI condition: {tech_state['extension']}")
        risk_level = "ELEVATED"
        
    if quality == "LOW":
        risk_level = "HIGH"
        risk_flags.append("Data quality is LOW (using demo or fallback data)")

    modes = [ind_meta.get("mode"), sent_meta.get("mode"), pred_meta.get("mode")]
    if all(m == "real" for m in modes):
        overall_mode = "real"
    elif any(m == "real" for m in modes):
        overall_mode = "mixed"
    else:
        overall_mode = "fallback"

    return {
        "signal_label": label,
        "confidence": confidence,
        "risk_level": risk_level,
        "bullish_evidence": tech_state["bullish_evidence"] + sent_state["bullish_evidence"],
        "bearish_evidence": tech_state["bearish_evidence"] + sent_state["bearish_evidence"],
        "conflicts": conflicts,
        "risk_flags": risk_flags,
        "data_quality": quality,
        "missing_data": [] if sentiment.get("model_used") != "None" else ["Sentiment Data"],
        "disclaimer": "Analysis-only signal. Not financial advice.",
        "_meta": {
            "mode": overall_mode,
            "source": "deterministic_intelligence_core",
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
        "risk_level": "HIGH",
        "bullish_evidence": [],
        "bearish_evidence": [],
        "conflicts": [],
        "risk_flags": ["Insufficient data"],
        "data_quality": "UNAVAILABLE",
        "missing_data": ["Technicals", "Sentiment", "Prediction"],
        "disclaimer": "Analysis-only signal. Not financial advice.",
        "_meta": {
            "mode": "unavailable",
            "source": "none",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }
