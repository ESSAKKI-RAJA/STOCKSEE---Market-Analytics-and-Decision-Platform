import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Numeric, Boolean, Text, Integer, JSON, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.models.base import Base

class AIReport(Base):
    __tablename__ = "ai_reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    symbol: Mapped[str] = mapped_column(String, index=True, nullable=False)
    signal: Mapped[str | None] = mapped_column(String, nullable=True)
    confidence_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    what_changed: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    key_reasons: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    key_risks: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    data_used: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    source_freshness: Mapped[str | None] = mapped_column(String, nullable=True)
    disclaimer: Mapped[str] = mapped_column(Text, default="Educational analysis only, not financial advice.")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class SourceLog(Base):
    __tablename__ = "source_logs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    symbol: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    feature: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    source_name: Mapped[str | None] = mapped_column(String, nullable=True)
    source_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_type: Mapped[str | None] = mapped_column(String, nullable=True)
    api_status: Mapped[str | None] = mapped_column(String, nullable=True)
    latency_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fallback_used: Mapped[bool] = mapped_column(Boolean, default=False)
    fetched_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
