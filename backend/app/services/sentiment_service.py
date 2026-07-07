"""Sentiment service — VADER-based sentiment analysis on actual news text.

Uses the actual headlines and summaries from the news service.
Never generates random or fake text for analysis.
"""

from typing import List, Dict, Any
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from datetime import datetime, timezone
import logging

import logging

from app.services.cache_service import get_cached_payload, set_cached_payload

logger = logging.getLogger(__name__)
analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(symbol: str, news_data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze sentiment of news articles returned by get_news()."""
    cached = get_cached_payload(symbol, "sentiment")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return cached

    articles = news_data.get("articles", [])
    news_meta = news_data.get("_meta", {})
    news_mode = news_meta.get("mode", "unknown")
    news_source = news_meta.get("source", "unknown")

    if not articles:
        result = _empty_sentiment()
        result["_meta"]["news_mode"] = news_mode
        return result

    scores = []
    top_pos = ""
    top_neg = ""
    max_pos = -1.0
    min_neg = 1.0

    for article in articles:
        text = f"{article.get('headline', '')} {article.get('summary', '')}"
        score = analyzer.polarity_scores(text)["compound"]
        scores.append(score)

        if score > max_pos:
            max_pos = score
            top_pos = article.get("headline", "")
        if score < min_neg:
            min_neg = score
            top_neg = article.get("headline", "")

    avg_score = sum(scores) / len(scores)

    overall = "Neutral"
    if avg_score > 0.15:
        overall = "Positive"
    elif avg_score < -0.15:
        overall = "Negative"

    # Confidence depends on article count and whether it's demo data
    confidence = "Low"
    if news_mode == "real" and len(articles) >= 5:
        confidence = "Medium"
    elif news_mode == "real" and len(articles) >= 10:
        confidence = "High"

    payload = {
        "overall_sentiment": overall,
        "sentiment_score": round(avg_score, 2),
        "confidence": confidence,
        "model_used": "VADER",
        "article_count": len(articles),
        "top_positive_headlines": [top_pos] if top_pos else [],
        "top_negative_headlines": [top_neg] if top_neg else [],
        "limitations": "Uses dictionary-based sentiment (VADER). FinBERT not loaded.",
        "_meta": {
            "mode": "real" if news_mode == "real" else "fallback",
            "source": "vader",
            "news_mode": news_mode,
            "news_source": news_source,
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }

    set_cached_payload(symbol, "sentiment", payload, payload["_meta"]["mode"], "vader", 180)
    return payload


def _empty_sentiment() -> Dict[str, Any]:
    return {
        "overall_sentiment": "Neutral",
        "sentiment_score": 0.0,
        "confidence": "None",
        "model_used": "None",
        "article_count": 0,
        "top_positive_headlines": [],
        "top_negative_headlines": [],
        "limitations": "No news data provided.",
        "_meta": {
            "mode": "unavailable",
            "source": "none",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }
