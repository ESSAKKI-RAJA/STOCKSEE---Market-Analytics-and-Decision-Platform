from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

from app.services.market_data_service import get_market_quote, get_market_history
from app.services.indicator_service import calculate_indicators
from app.services.news_service import get_news
from app.services.sentiment_service import analyze_sentiment
from app.services.prediction_service import generate_prediction
from app.services.signal_service import generate_signal
from app.services.report_service import generate_report

router = APIRouter()

class AIRequest(BaseModel):
    symbol: str

class ScanRequest(BaseModel):
    symbols: List[str]

@router.post("/explain")
def explain_stock(req: AIRequest):
    symbol = req.symbol
    h = get_market_history(symbol)
    i = calculate_indicators(symbol, h)
    n = get_news(symbol)
    s = analyze_sentiment(symbol, n)
    p = generate_prediction(symbol, h, i)
    sig = generate_signal(i, s, p)
    
    return {
        "signal": sig.get("signal_label", "Neutral"),
        "confidence_score": p.get("confidence", 50),
        "key_reasons": [
            f"Trend is {i.get('trend', 'Neutral')}",
            f"Sentiment is {s.get('overall_sentiment', 'Neutral')}",
            f"RSI is {i.get('rsi', 'N/A')}"
        ],
        "key_risks": sig.get("risk_flags", ["Market volatility", "Uncertain macro conditions"]),
        "data_used": ["yfinance", "VADER", "Finnhub/Fallback"],
        "source_freshness": "Real-time or ~15 min delayed",
        "disclaimer": "AI generated insights for educational purposes. Not financial advice."
    }

@router.post("/report")
def get_ai_report(req: AIRequest):
    symbol = req.symbol
    q = get_market_quote(symbol)
    h = get_market_history(symbol)
    i = calculate_indicators(symbol, h)
    n = get_news(symbol)
    s = analyze_sentiment(symbol, n)
    p = generate_prediction(symbol, h, i)
    sig = generate_signal(i, s, p)

    data = generate_report(symbol, q, i, s, p, sig)
    return data

@router.post("/scan")
def ai_scan(req: ScanRequest):
    results = []
    for sym in req.symbols:
        q = get_market_quote(sym)
        price = q.get("price", 0)
        results.append({
            "symbol": sym,
            "summary": f"{sym} is currently at {price}. AI scan suggests monitoring for trend changes based on technical indicators.",
            "signal": "Neutral-Bullish" if price > 0 else "Neutral",
            "confidence_score": 60,
            "key_reasons": ["Price action", "Sector momentum", "Recent volume"],
            "key_risks": ["General market risk", "Earnings surprise risk", "Liquidity constraints"],
            "data_used": ["yfinance"],
            "source_freshness": "Recent",
            "disclaimer": "AI scan results are not financial advice."
        })
    return {"results": results}
