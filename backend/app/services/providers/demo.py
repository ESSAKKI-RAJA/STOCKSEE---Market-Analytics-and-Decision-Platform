from typing import Dict, Any, Optional
from datetime import datetime, timezone
from .base import MarketDataProvider

class DemoProvider(MarketDataProvider):
    """Fallback provider that returns static demo data."""
    
    @property
    def name(self) -> str:
        return "demo"

    @property
    def mode(self) -> str:
        return "demo"

    def get_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        return {
            "symbol": symbol,
            "price": 150.00,
            "previous_close": 148.50,
            "volume": 1000000,
            "market_cap": 2500000000.0,
            "success": False,
            "source": self.name,
            "delay_label": "Demo / EOD",
        }

    def get_history(self, symbol: str, period: str = "1mo") -> Optional[Dict[str, Any]]:
        return {
            "rows": [
                {"date": "2024-01-01", "open": 140.0, "high": 145.0, "low": 139.0, "close": 144.0, "volume": 10000, "adjusted_close": 144.0},
                {"date": "2024-01-02", "open": 144.0, "high": 150.0, "low": 142.0, "close": 148.0, "volume": 12000, "adjusted_close": 148.0},
                {"date": "2024-01-03", "open": 148.0, "high": 152.0, "low": 147.0, "close": 150.0, "volume": 15000, "adjusted_close": 150.0},
            ]
        }
