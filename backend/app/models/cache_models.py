import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, Index, ForeignKey
from app.models.base import Base

def utcnow():
    return datetime.now(timezone.utc)

def generate_uuid():
    return str(uuid.uuid4())

class MarketDataCache(Base):
    __tablename__ = "market_data_cache"

    id = Column(String, primary_key=True, default=generate_uuid)
    symbol = Column(String, index=True, nullable=False)
    endpoint_type = Column(String, index=True, nullable=False) # quote, history, indicators
    payload_json = Column(JSON, nullable=False)
    mode = Column(String, nullable=False)
    source = Column(String, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(String, primary_key=True, default=generate_uuid)
    symbol = Column(String, index=True, nullable=False)
    headline = Column(String, nullable=False)
    source = Column(String, nullable=True)
    url = Column(String, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    summary = Column(Text, nullable=True)
    payload_json = Column(JSON, nullable=True)
    mode = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)

class SentimentScore(Base):
    __tablename__ = "sentiment_scores"

    id = Column(String, primary_key=True, default=generate_uuid)
    symbol = Column(String, index=True, nullable=False)
    sentiment_score = Column(Float, nullable=False)
    overall_sentiment = Column(String, nullable=False)
    confidence = Column(String, nullable=True)
    model_used = Column(String, nullable=True)
    article_count = Column(Integer, nullable=True)
    payload_json = Column(JSON, nullable=True)
    mode = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)

class AIReport(Base):
    __tablename__ = "ai_reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    symbol = Column(String, index=True, nullable=False)
    report_json = Column(JSON, nullable=False)
    mode = Column(String, nullable=False)
    source = Column(String, nullable=False)
    generated_at = Column(DateTime(timezone=True), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)

class SourceLog(Base):
    __tablename__ = "source_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    symbol = Column(String, index=True, nullable=True)
    endpoint = Column(String, nullable=False)
    source = Column(String, nullable=False)
    mode = Column(String, nullable=False)
    success = Column(Boolean, nullable=False)
    latency_ms = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)

class ApiHealthLog(Base):
    __tablename__ = "api_health_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    service_name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    latency_ms = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)

class UserWatchlist(Base):
    __tablename__ = "user_watchlists"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String(255), ForeignKey("users.id", ondelete="CASCADE"), nullable=True) # nullable for local/demo
    symbol = Column(String, index=True, nullable=False)
    company_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)

Index('ix_user_watchlist_user_symbol', UserWatchlist.user_id, UserWatchlist.symbol, unique=True)
