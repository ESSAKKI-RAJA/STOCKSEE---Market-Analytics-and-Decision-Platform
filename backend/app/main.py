"""STOCKSEE API — main application entry point.

Every response includes: mode, source, generated_at, limitations
so the frontend can display honest transparency badges.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings
from app.schemas.common import FallbackResponse
from app.services.health_service import get_health_status
from app.services.market_data_service import get_market_quote, get_market_history
from app.services.indicator_service import calculate_indicators
from app.services.news_service import get_news
from app.services.sentiment_service import analyze_sentiment
from app.services.prediction_service import generate_prediction
from app.services.signal_service import generate_signal
from app.services.report_service import generate_report
from app.services.watchlist_service import get_watchlist, add_to_watchlist, remove_from_watchlist
from app.services.cache_service import get_cached_payload, set_cached_payload
from app.api.user import router as user_router
from app.api.market import router as market_router
from app.db.session import engine
from app.models.base import Base
from app.models.user import User  # Ensure User is registered with Base

# Initialize database tables
Base.metadata.create_all(bind=engine)

logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
logger = logging.getLogger(__name__)

app = FastAPI(title="STOCKSEE API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/api/user", tags=["user"])
app.include_router(market_router, prefix="/api/market", tags=["market"])


# ─── Utility ────────────────────────────────────────────────────

def _meta(data, fallback_mode="fallback", fallback_source="system"):
    """Extract _meta from a service response dict."""
    if isinstance(data, dict):
        m = data.get("_meta", {})
        return m.get("mode", fallback_mode), m.get("source", fallback_source), m.get("generated_at", "")
    return fallback_mode, fallback_source, ""


# ─── Root & Health ──────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "STOCKSEE backend running 🚀", "version": "0.2.0"}


@app.get("/health")
def health():
    return get_health_status()


# ─── Market Data ────────────────────────────────────────────────

@app.get("/api/market/quote/{symbol}")
def quote(symbol: str):
    data = get_market_quote(symbol)
    mode, source, gen_at = _meta(data, "demo", "yfinance")
    return FallbackResponse(
        status="ok" if data.get("success") else "error",
        mode=mode,
        source=source,
        message=f"Quote for {symbol}",
        data=data,
        limitations="Market data may be delayed 15-30 minutes." if mode == "real" else "Using demo data — yfinance unavailable.",
    )


class SymbolsRequest(BaseModel):
    symbols: list[str]


@app.post("/api/market/quotes")
def quotes_batch(req: SymbolsRequest):
    results = []
    any_real = False
    for s in req.symbols:
        q = get_market_quote(s)
        m, _, _ = _meta(q)
        if m == "real":
            any_real = True
        results.append(q)

    return FallbackResponse(
        status="ok",
        mode="real" if any_real else "demo",
        source="yfinance",
        message=f"Batch quotes for {len(req.symbols)} symbols",
        data=results,
        limitations="Some symbols may use demo data if yfinance fails.",
    )


@app.get("/api/market/history/{symbol}")
def history(symbol: str):
    data = get_market_history(symbol)
    mode, source, gen_at = _meta(data, "demo", "yfinance")
    rows = data.get("rows", [])
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message=f"History for {symbol} ({len(rows)} points)",
        data=rows,
        limitations="Historical data from yfinance." if mode == "real" else "Using demo historical data.",
    )


# ─── Indicators ─────────────────────────────────────────────────

@app.get("/api/market/indicators/{symbol}")
def indicators(symbol: str):
    history_data = get_market_history(symbol)
    data = calculate_indicators(symbol, history_data)
    mode, source, _ = _meta(data, "fallback", "calculated")
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message=f"Technical indicators for {symbol}",
        data=data,
        limitations="Indicators calculated from available price data." if data.get("available") else "Insufficient data for indicators.",
    )


# ─── News ────────────────────────────────────────────────────────

@app.get("/api/news/{symbol}")
def news(symbol: str):
    data = get_news(symbol)
    mode, source, _ = _meta(data, "demo", "demo")
    articles = data.get("articles", [])
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message=f"News for {symbol} ({len(articles)} articles)",
        data=articles,
        limitations=data.get("_meta", {}).get("limitations", "News from Finnhub API." if mode == "real" else "Demo news — set FINNHUB_API_KEY for real news."),
    )


# ─── Sentiment ───────────────────────────────────────────────────

@app.get("/api/sentiment/{symbol}")
def sentiment(symbol: str):
    news_data = get_news(symbol)
    data = analyze_sentiment(symbol, news_data)
    mode, source, _ = _meta(data, "fallback", "vader")
    news_mode = data.get("_meta", {}).get("news_mode", "unknown")
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message=f"Sentiment analysis for {symbol} (news: {news_mode})",
        data=data,
        limitations=data.get("limitations", "VADER sentiment analysis."),
    )


# ─── Prediction ──────────────────────────────────────────────────

@app.get("/api/prediction/{symbol}")
def prediction(symbol: str):
    history_data = get_market_history(symbol)
    inds = calculate_indicators(symbol, history_data)
    data = generate_prediction(symbol, history_data, inds)
    mode, source, _ = _meta(data, "fallback", "trend_projection")
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message=f"Conservative trend projection for {symbol}",
        data=data,
        limitations=data.get("limitations", "Simple trend projection. No ML model."),
    )


# ─── Signal ──────────────────────────────────────────────────────

@app.get("/api/signal/{symbol}")
def signal(symbol: str):
    history_data = get_market_history(symbol)
    inds = calculate_indicators(symbol, history_data)
    news_data = get_news(symbol)
    sent = analyze_sentiment(symbol, news_data)
    pred = generate_prediction(symbol, history_data, inds)

    data = generate_signal(inds, sent, pred)
    mode, source, _ = _meta(data, "fallback", "heuristic")
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message=f"Analysis signal for {symbol}",
        data=data,
        limitations="Heuristic signal combining technicals + sentiment. Not financial advice.",
    )


# ─── Company Profile ─────────────────────────────────────────────

@app.get("/api/company/{symbol}")
def company(symbol: str):
    return FallbackResponse(
        status="ok",
        mode="demo",
        source="demo",
        message="Company profile using demo data",
        data={"symbol": symbol, "name": f"{symbol} Corporation", "sector": "Technology", "industry": "Software"},
        limitations="Company profile not yet connected to a real data source.",
    )


# ─── Report ──────────────────────────────────────────────────────

@app.get("/api/report/{symbol}")
def report(symbol: str):
    cached = get_cached_payload(symbol, "report")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return FallbackResponse(
            status="ok",
            mode=cached["_meta"]["mode"],
            source=cached["_meta"]["source"],
            message=f"Full analysis report for {symbol} (cached)",
            data=cached,
            limitations=" ".join(cached.get("limitations", [])),
        )

    q = get_market_quote(symbol)
    h = get_market_history(symbol)
    i = calculate_indicators(symbol, h)
    n = get_news(symbol)
    s = analyze_sentiment(symbol, n)
    p = generate_prediction(symbol, h, i)
    sig = generate_signal(i, s, p)

    data = generate_report(symbol, q, i, s, p, sig)
    mode, source, _ = _meta(data, "fallback", "report_engine")
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message=f"Full analysis report for {symbol}",
        data=data,
        limitations="AI-generated analysis for educational purposes only. Not financial advice.",
    )


# ─── Heatmap ─────────────────────────────────────────────────────

@app.get("/api/heatmap")
def heatmap():
    return FallbackResponse(
        status="ok",
        mode="demo",
        source="demo",
        message="Demo heatmap data",
        data=[
            {"sector": "Technology", "performance": 1.5, "weight": 25},
            {"sector": "Financials", "performance": -0.5, "weight": 15},
            {"sector": "Energy", "performance": 2.1, "weight": 10},
            {"sector": "Healthcare", "performance": 0.2, "weight": 14},
        ],
        limitations="Heatmap using static demo data.",
    )


# ─── Watchlist ───────────────────────────────────────────────────

@app.get("/api/watchlist")
def get_watchlist_api():
    data = get_watchlist()
    mode, source, _ = _meta(data, "demo", "in_memory")
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message="Fetched watchlist",
        data=data.get("symbols", []),
        limitations="Watchlist stored in-memory. Will reset on server restart." if mode == "demo" else "Watchlist stored in local database.",
    )


class WatchlistRequest(BaseModel):
    symbol: str


@app.post("/api/watchlist")
def post_watchlist(req: WatchlistRequest):
    data = add_to_watchlist(req.symbol)
    mode, source, _ = _meta(data, "demo", "in_memory")
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message="Added to watchlist",
        data=data.get("symbols", []),
    )


@app.delete("/api/watchlist/{symbol}")
def del_watchlist(symbol: str):
    data = remove_from_watchlist(symbol)
    mode, source, _ = _meta(data, "demo", "in_memory")
    return FallbackResponse(
        status="ok",
        mode=mode,
        source=source,
        message="Removed from watchlist",
        data=data.get("symbols", []),
    )


# ─── Analyze (wrapper) ──────────────────────────────────────────

@app.post("/api/analyze")
def analyze(req: WatchlistRequest):
    return report(req.symbol)
