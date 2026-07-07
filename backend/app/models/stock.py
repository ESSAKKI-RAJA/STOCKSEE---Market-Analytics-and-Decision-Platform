import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, Text, JSON, Date
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

def utcnow():
    return datetime.now(timezone.utc)

class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    symbol: Mapped[str] = mapped_column(String(50), primary_key=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=True)
    exchange: Mapped[str] = mapped_column(String(100), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), nullable=True)
    sector: Mapped[str] = mapped_column(String(100), nullable=True)
    industry: Mapped[str] = mapped_column(String(100), nullable=True)
    website: Mapped[str] = mapped_column(String(255), nullable=True)
    market_cap: Mapped[int] = mapped_column(Integer, nullable=True)
    source: Mapped[str] = mapped_column(String(100), nullable=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

class MarketDataCache(Base):
    __tablename__ = "market_data_cache"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    symbol: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=True)
    change: Mapped[float] = mapped_column(Float, nullable=True)
    change_percent: Mapped[float] = mapped_column(Float, nullable=True)
    volume: Mapped[int] = mapped_column(Integer, nullable=True)
    day_high: Mapped[float] = mapped_column(Float, nullable=True)
    day_low: Mapped[float] = mapped_column(Float, nullable=True)
    source: Mapped[str] = mapped_column(String(100), nullable=True)
    delay_label: Mapped[str] = mapped_column(String(50), nullable=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

class OHLCVCache(Base):
    __tablename__ = "ohlcv_cache"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    symbol: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    timeframe: Mapped[str] = mapped_column(String(20), nullable=False)
    date: Mapped[datetime] = mapped_column(Date, nullable=False)
    open: Mapped[float] = mapped_column(Float, nullable=True)
    high: Mapped[float] = mapped_column(Float, nullable=True)
    low: Mapped[float] = mapped_column(Float, nullable=True)
    close: Mapped[float] = mapped_column(Float, nullable=True)
    volume: Mapped[int] = mapped_column(Integer, nullable=True)
    source: Mapped[str] = mapped_column(String(100), nullable=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

class TechnicalIndicator(Base):
    __tablename__ = "technical_indicators"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    symbol: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    timeframe: Mapped[str] = mapped_column(String(20), nullable=False)
    sma20: Mapped[float] = mapped_column(Float, nullable=True)
    sma50: Mapped[float] = mapped_column(Float, nullable=True)
    sma200: Mapped[float] = mapped_column(Float, nullable=True)
    rsi14: Mapped[float] = mapped_column(Float, nullable=True)
    macd: Mapped[float] = mapped_column(Float, nullable=True)
    macd_signal: Mapped[float] = mapped_column(Float, nullable=True)
    trend: Mapped[str] = mapped_column(String(50), nullable=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    symbol: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    headline: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    url: Mapped[str] = mapped_column(String(500), nullable=True)
    source: Mapped[str] = mapped_column(String(100), nullable=True)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

class SentimentScore(Base):
    __tablename__ = "sentiment_scores"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    symbol: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    sentiment_label: Mapped[str] = mapped_column(String(50), nullable=False)
    sentiment_score: Mapped[float] = mapped_column(Float, nullable=False)
    confidence: Mapped[int] = mapped_column(Integer, nullable=True)
    article_count: Mapped[int] = mapped_column(Integer, default=0)
    last_updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
