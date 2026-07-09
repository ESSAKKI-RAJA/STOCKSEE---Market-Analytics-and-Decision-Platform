import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(255), primary_key=True) # Clerk user ID
    full_name: Mapped[str] = mapped_column(String(255), nullable=True) # Sometimes Clerk has no name
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    preferences: Mapped["UserPreference"] = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[str] = mapped_column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(255), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    theme: Mapped[str] = mapped_column(String(50), default="dark")
    default_view: Mapped[str] = mapped_column(String(50), default="dashboard")
    risk_tolerance: Mapped[str] = mapped_column(String(50), default="moderate")

    user: Mapped["User"] = relationship("User", back_populates="preferences")
