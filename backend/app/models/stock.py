import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, Date
from app.models.base import Base

def utcnow():
    return datetime.now(timezone.utc)

def generate_uuid():
    return str(uuid.uuid4())

class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    symbol = Column(String(50), primary_key=True)
    company_name = Column(String(255), nullable=True)
    exchange = Column(String(100), nullable=True)
    currency = Column(String(10), nullable=True)
    sector = Column(String(100), nullable=True)
    industry = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    market_cap = Column(Integer, nullable=True)
    source = Column(String(100), nullable=True)
    last_updated = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

class OHLCVCache(Base):
    __tablename__ = "ohlcv_cache"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    symbol = Column(String(50), index=True, nullable=False)
    timeframe = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    open = Column(Float, nullable=True)
    high = Column(Float, nullable=True)
    low = Column(Float, nullable=True)
    close = Column(Float, nullable=True)
    volume = Column(Integer, nullable=True)
    source = Column(String(100), nullable=True)
    last_updated = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

class TechnicalIndicator(Base):
    __tablename__ = "technical_indicators"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    symbol = Column(String(50), index=True, nullable=False)
    timeframe = Column(String(20), nullable=False)
    sma20 = Column(Float, nullable=True)
    sma50 = Column(Float, nullable=True)
    sma200 = Column(Float, nullable=True)
    rsi14 = Column(Float, nullable=True)
    macd = Column(Float, nullable=True)
    macd_signal = Column(Float, nullable=True)
    trend = Column(String(50), nullable=True)
    last_updated = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
