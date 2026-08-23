"""ESSAI API Router — /api/essai/* endpoints."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.services.essai_service import (
    generate_essai_analysis,
    generate_essai_question,
    generate_essai_comparison,
    build_essai_context,
)

router = APIRouter()


class EssaiQuestionRequest(BaseModel):
    symbol: str
    question: str


class EssaiCompareRequest(BaseModel):
    symbol_a: str
    symbol_b: str


@router.get("/analyse/{symbol}")
def essai_analyse(symbol: str):
    """Full ESSAI intelligence analysis for a symbol."""
    result = generate_essai_analysis(symbol.strip().upper())
    return {
        "status": "ok",
        "symbol": symbol.upper(),
        "essai": result,
        "disclaimer": "ESSAI analysis is for educational purposes only. Not financial advice.",
    }


@router.post("/ask")
def essai_ask(req: EssaiQuestionRequest):
    """Answer a contextual question about a stock using ESSAI."""
    result = generate_essai_question(
        req.symbol.strip().upper(),
        req.question.strip(),
    )
    return {
        "status": "ok",
        "symbol": req.symbol.upper(),
        "question": req.question,
        "essai": result,
        "disclaimer": "ESSAI analysis is for educational purposes only. Not financial advice.",
    }


@router.post("/compare")
def essai_compare(req: EssaiCompareRequest):
    """Compare two stocks using ESSAI."""
    result = generate_essai_comparison(
        req.symbol_a.strip().upper(),
        req.symbol_b.strip().upper(),
    )
    return {
        "status": "ok",
        "symbol_a": req.symbol_a.upper(),
        "symbol_b": req.symbol_b.upper(),
        "essai": result,
        "disclaimer": "ESSAI analysis is for educational purposes only. Not financial advice.",
    }


@router.get("/context/{symbol}")
def essai_context(symbol: str):
    """Return the raw ESSAI context (for debugging / transparency)."""
    ctx = build_essai_context(symbol.strip().upper())
    return {
        "status": "ok",
        "symbol": symbol.upper(),
        "context": ctx,
    }
