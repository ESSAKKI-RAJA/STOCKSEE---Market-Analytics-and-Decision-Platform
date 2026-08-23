import yfinance as yf
from typing import Dict, Any, Optional
import logging
from .base import MarketDataProvider

logger = logging.getLogger(__name__)

class YFinanceProvider(MarketDataProvider):
    """Market data provider using Yahoo Finance."""
    
    @property
    def name(self) -> str:
        return "yfinance"

    @property
    def mode(self) -> str:
        return "real"

    def get_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.fast_info

            price = float(info.get("lastPrice", 0.0) or 0.0)
            prev_close = float(info.get("previousClose", 0.0) or 0.0)

            if price <= 0:
                return None

            return {
                "symbol": symbol,
                "price": round(price, 2),
                "previous_close": round(prev_close, 2),
                "volume": int(info.get("lastVolume", 0) or 0),
                "market_cap": float(info.get("marketCap", 0.0) or 0.0),
                "success": True,
                "source": self.name,
                "delay_label": "~15 min delay",
            }
        except Exception as e:
            logger.warning(f"YFinance failed to fetch quote for {symbol}: {e}")
            return None

    def get_history(self, symbol: str, period: str = "1mo") -> Optional[Dict[str, Any]]:
        try:
            # Map standard/variant periods to valid yfinance parameters
            period_norm_map = {
                "1d": "1d",
                "1w": "5d",
                "1wk": "5d",
                "5d": "5d",
                "1m": "1mo",
                "1mo": "1mo",
                "3m": "3mo",
                "3mo": "3mo",
                "6m": "6mo",
                "6mo": "6mo",
                "1y": "1y",
                "2y": "2y",
                "3y": "5y",
                "5y": "5y",
                "10y": "10y",
                "max": "max",
            }
            yf_period = period_norm_map.get(period.lower(), "1mo")
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=yf_period)
            if df.empty:
                return None

            rows = []
            for date, row in df.iterrows():
                rows.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "open": round(float(row.get("Open", 0.0)), 2),
                    "high": round(float(row.get("High", 0.0)), 2),
                    "low": round(float(row.get("Low", 0.0)), 2),
                    "close": round(float(row.get("Close", 0.0)), 2),
                    "volume": int(row.get("Volume", 0)),
                    "adjusted_close": round(float(row.get("Close", 0.0)), 2),
                })

            return {
                "rows": rows
            }
        except Exception as e:
            logger.warning(f"YFinance failed to fetch history for {symbol}: {e}")
            return None
