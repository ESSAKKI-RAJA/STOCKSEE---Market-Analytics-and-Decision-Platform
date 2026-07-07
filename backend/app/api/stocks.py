from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional

from app.services.market_data_service import get_market_quote

router = APIRouter()

class CompareRequest(BaseModel):
    symbols: List[str]

@router.post("/compare")
def compare_stocks(req: CompareRequest):
    results = []
    for sym in req.symbols:
        q = get_market_quote(sym)
        results.append({
            "symbol": sym,
            "price": q.get("price", 0),
            "change": q.get("change", 0),
            "change_pct": q.get("change_percent", 0),
            "volume": q.get("volume", 0),
            "market_cap": q.get("market_cap", 0),
        })
    return {"comparison": results}

@router.get("/screener")
def screener(
    sector: Optional[str] = Query(None),
    min_market_cap: Optional[float] = Query(None),
    max_pe: Optional[float] = Query(None),
    min_rsi: Optional[float] = Query(None),
    max_rsi: Optional[float] = Query(None),
    min_volume: Optional[float] = Query(None),
    max_volume: Optional[float] = Query(None)
):
    # Dummy mock data for Screener since we don't have a real screener DB yet.
    # In a full app, this would query a database of company_profiles and fundamentals.
    mock_stocks = [
        {"symbol": "RELIANCE.NS", "price": 2800, "sector": "Energy", "pe": 25, "rsi": 60, "volume": 5000000},
        {"symbol": "TCS.NS", "price": 3900, "sector": "Technology", "pe": 30, "rsi": 55, "volume": 2000000},
        {"symbol": "HDFCBANK.NS", "price": 1400, "sector": "Financials", "pe": 15, "rsi": 40, "volume": 15000000},
        {"symbol": "INFY.NS", "price": 1500, "sector": "Technology", "pe": 24, "rsi": 50, "volume": 6000000},
        {"symbol": "AAPL", "price": 170, "sector": "Technology", "pe": 28, "rsi": 65, "volume": 55000000},
    ]

    filtered = mock_stocks
    if sector:
        filtered = [s for s in filtered if s["sector"].lower() == sector.lower()]
    if min_volume:
        filtered = [s for s in filtered if s["volume"] >= min_volume]
    
    return {"results": filtered}
