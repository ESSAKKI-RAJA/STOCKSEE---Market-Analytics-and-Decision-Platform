import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import delete

from app.database.session import SessionLocal
from app.models.cache_models import (
    MarketDataCache,
    NewsArticle,
    SentimentScore,
    AIReport,
    SourceLog,
    ApiHealthLog
)

logger = logging.getLogger(__name__)

def utcnow():
    return datetime.now(timezone.utc)

def is_cache_valid(expires_at: datetime) -> bool:
    """Check if the cache expiry is in the future."""
    # Ensure expires_at is timezone aware
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    return utcnow() < expires_at

def get_cached_payload(symbol: str, endpoint_type: str) -> Optional[Dict[str, Any]]:
    """Retrieve valid cache payload, return None if missing or expired.
    If expired, we can return it as 'stale_cache' later if external call fails,
    but this function only returns valid cache. We will provide get_stale_cache as well.
    """
    with SessionLocal() as db:
        if endpoint_type in ["quote", "history", "indicators", "heatmap"]:
            record = db.query(MarketDataCache).filter(
                MarketDataCache.symbol == symbol,
                MarketDataCache.endpoint_type == endpoint_type
            ).order_by(MarketDataCache.created_at.desc()).first()
            if record and is_cache_valid(record.expires_at):
                return record.payload_json
            
        elif endpoint_type == "news":
            # For news, we store the full payload in payload_json
            record = db.query(NewsArticle).filter(
                NewsArticle.symbol == symbol
            ).order_by(NewsArticle.created_at.desc()).first()
            # NewsArticle doesn't have expires_at, so we use created_at + 3 hours
            if record and is_cache_valid(record.created_at + timedelta(hours=3)):
                return record.payload_json

        elif endpoint_type == "sentiment":
            record = db.query(SentimentScore).filter(
                SentimentScore.symbol == symbol
            ).order_by(SentimentScore.created_at.desc()).first()
            if record and is_cache_valid(record.created_at + timedelta(hours=3)):
                return record.payload_json

        elif endpoint_type == "report":
            record = db.query(AIReport).filter(
                AIReport.symbol == symbol
            ).order_by(AIReport.created_at.desc()).first()
            if record and is_cache_valid(record.expires_at):
                return record.report_json

    return None


def get_stale_cache(symbol: str, endpoint_type: str) -> Optional[Dict[str, Any]]:
    """Retrieve the most recent cache regardless of expiry."""
    with SessionLocal() as db:
        if endpoint_type in ["quote", "history", "indicators", "heatmap"]:
            record = db.query(MarketDataCache).filter(
                MarketDataCache.symbol == symbol,
                MarketDataCache.endpoint_type == endpoint_type
            ).order_by(MarketDataCache.created_at.desc()).first()
            if record: return record.payload_json
        elif endpoint_type == "news":
            record = db.query(NewsArticle).filter(NewsArticle.symbol == symbol).order_by(NewsArticle.created_at.desc()).first()
            if record: return record.payload_json
        elif endpoint_type == "sentiment":
            record = db.query(SentimentScore).filter(SentimentScore.symbol == symbol).order_by(SentimentScore.created_at.desc()).first()
            if record: return record.payload_json
        elif endpoint_type == "report":
            record = db.query(AIReport).filter(AIReport.symbol == symbol).order_by(AIReport.created_at.desc()).first()
            if record: return record.report_json
    return None


def set_cached_payload(symbol: str, endpoint_type: str, payload: Dict[str, Any], mode: str, source: str, ttl_minutes: int):
    """Store payload in cache."""
    expires_at = utcnow() + timedelta(minutes=ttl_minutes)
    
    with SessionLocal() as db:
        if endpoint_type in ["quote", "history", "indicators", "heatmap"]:
            record = MarketDataCache(
                symbol=symbol,
                endpoint_type=endpoint_type,
                payload_json=payload,
                mode=mode,
                source=source,
                expires_at=expires_at
            )
            db.add(record)
            
        elif endpoint_type == "news":
            # For simplicity, we just store the whole response in payload_json
            # and fill required fields with safe defaults if extracting is hard.
            record = NewsArticle(
                symbol=symbol,
                headline=payload.get("articles", [{}])[0].get("headline", "News Update") if payload.get("articles") else "News Update",
                source=source,
                payload_json=payload,
                mode=mode,
            )
            db.add(record)

        elif endpoint_type == "sentiment":
            record = SentimentScore(
                symbol=symbol,
                sentiment_score=payload.get("sentiment_score", 0),
                overall_sentiment=payload.get("overall_sentiment", "Neutral"),
                confidence=payload.get("confidence", "Low"),
                model_used=payload.get("model_used", "Unknown"),
                article_count=payload.get("article_count", 0),
                payload_json=payload,
                mode=mode,
            )
            db.add(record)

        elif endpoint_type == "report":
            record = AIReport(
                symbol=symbol,
                report_json=payload,
                mode=mode,
                source=source,
                generated_at=utcnow(),
                expires_at=expires_at
            )
            db.add(record)
            
        db.commit()


def clear_expired_cache():
    """Clear expired cache rows."""
    now = utcnow()
    with SessionLocal() as db:
        try:
            db.query(MarketDataCache).filter(MarketDataCache.expires_at < now).delete()
            db.query(AIReport).filter(AIReport.expires_at < now).delete()
            # News and Sentiment don't have explicit expires_at column, calculate from created_at
            three_hours_ago = now - timedelta(hours=3)
            db.query(NewsArticle).filter(NewsArticle.created_at < three_hours_ago).delete()
            db.query(SentimentScore).filter(SentimentScore.created_at < three_hours_ago).delete()
            db.commit()
        except Exception as e:
            logger.error(f"Error clearing cache: {e}")
            db.rollback()


def log_source_event(symbol: str, endpoint: str, source: str, mode: str, success: bool, latency_ms: int, error_message: str = None):
    """Log an external API call or significant data source event."""
    try:
        with SessionLocal() as db:
            log = SourceLog(
                symbol=symbol,
                endpoint=endpoint,
                source=source,
                mode=mode,
                success=success,
                latency_ms=latency_ms,
                error_message=error_message
            )
            db.add(log)
            db.commit()
    except Exception as e:
        logger.error(f"Failed to log source event: {e}")

def log_api_health(service_name: str, status: str, latency_ms: int, error_message: str = None):
    try:
        with SessionLocal() as db:
            log = ApiHealthLog(
                service_name=service_name,
                status=status,
                latency_ms=latency_ms,
                error_message=error_message
            )
            db.add(log)
            db.commit()
    except Exception:
        pass
