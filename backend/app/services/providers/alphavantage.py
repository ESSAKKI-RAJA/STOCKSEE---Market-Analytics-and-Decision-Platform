from typing import Dict, Any, Optional
import requests
import logging
from datetime import datetime
from .base import MarketDataProvider
from app.core.config import settings

logger = logging.getLogger(__name__)
ALPHAVANTAGE_BASE_URL = "https://www.alphavantage.co/query"

class AlphaVantageProvider(MarketDataProvider):
    """Market data provider using Alpha Vantage REST API."""
    
    @property
    def name(self) -> str:
        return "alphavantage"
        
    @property
    def mode(self) -> str:
        return "real"

    def get_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        api_key = settings.ALPHA_VANTAGE_API_KEY or "demo"
        try:
            resp = requests.get(
                ALPHAVANTAGE_BASE_URL,
                params={
                    "function": "GLOBAL_QUOTE",
                    "symbol": symbol,
                    "apikey": api_key
                },
                timeout=5
            )
            resp.raise_for_status()
            data = resp.json()
            
            # Check for API limit
            if "Information" in data and "rate limit" in data["Information"].lower():
                logger.warning(f"Alpha Vantage rate limit reached for {symbol}")
                return None
                
            quote = data.get("Global Quote", {})
            if not quote:
                return None
                
            price = float(quote.get("05. price", 0.0) or 0.0)
            if price <= 0:
                return None
                
            return {
                "symbol": symbol,
                "price": round(price, 2),
                "previous_close": round(float(quote.get("08. previous close", 0.0) or 0.0), 2),
                "volume": int(quote.get("06. volume", 0) or 0),
                "market_cap": 0.0,
                "success": True,
                "source": self.name,
                "delay_label": "Real-time",
            }
        except Exception as e:
            logger.warning(f"Alpha Vantage failed to fetch quote for {symbol}: {e}")
            return None

    def get_history(self, symbol: str, period: str = "1mo") -> Optional[Dict[str, Any]]:
        api_key = settings.ALPHA_VANTAGE_API_KEY or "demo"
        try:
            resp = requests.get(
                ALPHAVANTAGE_BASE_URL,
                params={
                    "function": "TIME_SERIES_DAILY",
                    "symbol": symbol,
                    "apikey": api_key
                },
                timeout=10
            )
            resp.raise_for_status()
            data = resp.json()
            
            if "Information" in data and "rate limit" in data["Information"].lower():
                logger.warning(f"Alpha Vantage rate limit reached for {symbol}")
                return None
                
            series = data.get("Time Series (Daily)", {})
            if not series:
                logger.warning(f"Alpha Vantage returned no series data for {symbol}: {data}")
                return None
                
            rows = []
            for date_str, metrics in series.items():
                rows.append({
                    "date": date_str,
                    "open": round(float(metrics.get("1. open", 0.0)), 2),
                    "high": round(float(metrics.get("2. high", 0.0)), 2),
                    "low": round(float(metrics.get("3. low", 0.0)), 2),
                    "close": round(float(metrics.get("4. close", 0.0)), 2),
                    "volume": int(metrics.get("5. volume", 0)),
                    "adjusted_close": round(float(metrics.get("4. close", 0.0)), 2),
                })
                
            if not rows:
                return None
                
            # Sort chronologically
            rows.sort(key=lambda x: x["date"])
            
            # Cap data length to emulate period
            limit = 30 if period == "1mo" else 90 if period == "3mo" else len(rows)
            rows = rows[-limit:]
                
            return {
                "rows": rows
            }
        except Exception as e:
            logger.warning(f"Alpha Vantage failed to fetch history for {symbol}: {e}")
            return None
