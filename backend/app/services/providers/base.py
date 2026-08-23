from typing import Dict, Any, Optional
from abc import ABC, abstractmethod

class MarketDataProvider(ABC):
    """Abstract base class for market data providers."""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the provider (e.g. 'finnhub', 'yfinance', 'demo')."""
        pass
        
    @property
    @abstractmethod
    def mode(self) -> str:
        """Mode of the provider (e.g. 'real', 'fallback', 'demo')."""
        pass

    @abstractmethod
    def get_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        """
        Fetch real-time quote for a symbol.
        Must return normalized format:
        {
            "symbol": str,
            "price": float,
            "previous_close": float,
            "volume": int,
            "market_cap": float,
            "success": bool,
            "source": str,
            "delay_label": str
        }
        Returns None if the provider cannot fulfill the request (e.g. rate limited or symbol not found).
        """
        pass

    @abstractmethod
    def get_history(self, symbol: str, period: str = "1mo") -> Optional[Dict[str, Any]]:
        """
        Fetch historical OHLCV data for a symbol.
        Must return normalized format:
        {
            "rows": [
                {
                    "date": "YYYY-MM-DD",
                    "open": float,
                    "high": float,
                    "low": float,
                    "close": float,
                    "volume": int,
                    "adjusted_close": float
                }
            ]
        }
        Returns None if the provider cannot fulfill the request.
        """
        pass
