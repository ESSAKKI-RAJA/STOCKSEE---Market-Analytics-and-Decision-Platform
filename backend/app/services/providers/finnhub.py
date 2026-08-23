from typing import Dict, Any, Optional
import requests
import logging
from datetime import datetime
from .base import MarketDataProvider
from app.core.config import settings

logger = logging.getLogger(__name__)
FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

class FinnhubProvider(MarketDataProvider):
    """Market data provider using Finnhub REST API."""
    
    @property
    def name(self) -> str:
        return "finnhub"
        
    @property
    def mode(self) -> str:
        return "real"

    def _get_clean_symbol(self, symbol: str) -> str:
        """Finnhub doesn't use the standard Yahoo Finance suffixes for everything, but let's safely strip standard ones if it fails, or just use as is for US equities."""
        return symbol.split(".")[0].upper()

    def get_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        if not settings.FINNHUB_API_KEY:
            return None
            
        clean_symbol = self._get_clean_symbol(symbol)
        try:
            resp = requests.get(
                f"{FINNHUB_BASE_URL}/quote",
                params={"symbol": clean_symbol, "token": settings.FINNHUB_API_KEY},
                timeout=5
            )
            resp.raise_for_status()
            data = resp.json()
            
            # Finnhub returns 'c' for current price, 'pc' for previous close
            price = float(data.get("c", 0.0) or 0.0)
            if price <= 0:
                return None
                
            return {
                "symbol": symbol,
                "price": round(price, 2),
                "previous_close": round(float(data.get("pc", 0.0) or 0.0), 2),
                "volume": 0, # quote endpoint doesn't always give daily volume directly here, but good enough for now
                "market_cap": 0.0, # not included in basic quote
                "success": True,
                "source": self.name,
                "delay_label": "Real-time",
            }
        except Exception as e:
            logger.warning(f"Finnhub failed to fetch quote for {symbol}: {e}")
            return None

    def get_history(self, symbol: str, period: str = "1mo") -> Optional[Dict[str, Any]]:
        if not settings.FINNHUB_API_KEY:
            return None
            
        clean_symbol = self._get_clean_symbol(symbol)
        
        # Map yfinance period to timestamps
        # 1mo -> past 30 days
        # Finnhub resolution 'D' = daily
        import time
        now = int(time.time())
        if period == "1mo":
            start = now - (30 * 24 * 60 * 60)
        elif period == "3mo":
            start = now - (90 * 24 * 60 * 60)
        elif period == "1y":
            start = now - (365 * 24 * 60 * 60)
        else:
            # Default to 1mo
            start = now - (30 * 24 * 60 * 60)

        try:
            resp = requests.get(
                f"{FINNHUB_BASE_URL}/stock/candle",
                params={
                    "symbol": clean_symbol,
                    "resolution": "D",
                    "from": start,
                    "to": now,
                    "token": settings.FINNHUB_API_KEY
                },
                timeout=5
            )
            resp.raise_for_status()
            data = resp.json()
            
            if data.get("s") != "ok":
                return None
                
            rows = []
            for i in range(len(data.get("t", []))):
                date_str = datetime.fromtimestamp(data["t"][i]).strftime("%Y-%m-%d")
                rows.append({
                    "date": date_str,
                    "open": round(float(data["o"][i]), 2),
                    "high": round(float(data["h"][i]), 2),
                    "low": round(float(data["l"][i]), 2),
                    "close": round(float(data["c"][i]), 2),
                    "volume": int(data["v"][i]),
                    "adjusted_close": round(float(data["c"][i]), 2),
                })
                
            if not rows:
                return None
                
            return {
                "rows": rows
            }
        except Exception as e:
            logger.warning(f"Finnhub failed to fetch history for {symbol}: {e}")
            return None
