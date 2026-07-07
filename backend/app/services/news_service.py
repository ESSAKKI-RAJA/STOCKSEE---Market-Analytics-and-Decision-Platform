"""News service — fetches real news from Finnhub when API key is available.

Falls back to clearly-labeled demo news when:
- FINNHUB_API_KEY is not set
- The API call fails
- No results are returned
"""

import requests
from typing import List, Dict, Any
from datetime import datetime, timezone, timedelta
from app.core.config import settings
import logging
import time

from app.services.cache_service import get_cached_payload, set_cached_payload, get_stale_cache, log_source_event

logger = logging.getLogger(__name__)

FINNHUB_BASE_URL = "https://finnhub.io/api/v1"


def get_news(symbol: str) -> Dict[str, Any]:
    """Returns dict with `articles` list and `_meta` for transparency."""
    cached = get_cached_payload(symbol, "news")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return cached

    start_time = time.time()
    if settings.FINNHUB_API_KEY:
        try:
            articles = _fetch_finnhub_news(symbol)
            if articles:
                payload = {
                    "articles": articles,
                    "_meta": {
                        "mode": "real",
                        "source": "finnhub",
                        "article_count": len(articles),
                        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    },
                }
                latency = int((time.time() - start_time) * 1000)
                log_source_event(symbol, "news", "finnhub", "real", True, latency)
                
                # Cache news (TTL: 3 hours)
                set_cached_payload(symbol, "news", payload, "real", "finnhub", 180)
                return payload
            else:
                logger.info(f"Finnhub returned 0 articles for {symbol}, using fallback")
        except Exception as e:
            latency = int((time.time() - start_time) * 1000)
            logger.warning(f"Finnhub API error for {symbol}: {e}")
            log_source_event(symbol, "news", "finnhub", "fallback", False, latency, str(e))

    # Fallback to stale cache first
    stale = get_stale_cache(symbol, "news")
    if stale:
        stale["_meta"]["mode"] = "stale_cache"
        stale["_meta"]["cache_hit"] = True
        return stale

    # Ultimate fallback
    logger.warning(f"Returning labeled demo news for {symbol}")
    return _get_demo_news(symbol)


def _fetch_finnhub_news(symbol: str) -> List[Dict[str, Any]]:
    """Call Finnhub company-news endpoint.

    For Indian symbols (e.g. RELIANCE.NS) strip the .NS/.BO suffix
    since Finnhub uses plain tickers.
    """
    clean_symbol = symbol.split(".")[0].upper()

    today = datetime.now(timezone.utc).date()
    from_date = (today - timedelta(days=7)).isoformat()
    to_date = today.isoformat()

    resp = requests.get(
        f"{FINNHUB_BASE_URL}/company-news",
        params={
            "symbol": clean_symbol,
            "from": from_date,
            "to": to_date,
            "token": settings.FINNHUB_API_KEY,
        },
        timeout=10,
    )
    resp.raise_for_status()
    raw = resp.json()

    articles = []
    for item in raw[:10]:  # Cap at 10 articles
        articles.append({
            "source": item.get("source", "Unknown"),
            "headline": item.get("headline", ""),
            "url": item.get("url", ""),
            "published_at": datetime.fromtimestamp(
                item.get("datetime", 0), tz=timezone.utc
            ).isoformat().replace("+00:00", "Z"),
            "summary": item.get("summary", ""),
            "demo": False,
        })

    return articles


def _get_demo_news(symbol: str) -> Dict[str, Any]:
    """Clearly labeled demo/fallback news."""
    return {
        "articles": [
            {
                "source": "STOCKSEE Demo",
                "headline": f"[DEMO] {symbol} expected to see volatility next week.",
                "url": "https://example.com/demo/news/1",
                "published_at": "2024-01-03T12:00:00Z",
                "summary": "[DEMO DATA] Analysts are predicting a strong directional move based on recent volume accumulation.",
                "demo": True,
            },
            {
                "source": "STOCKSEE Demo",
                "headline": f"[DEMO] Earnings report for {symbol} shows promising growth.",
                "url": "https://example.com/demo/news/2",
                "published_at": "2024-01-02T08:30:00Z",
                "summary": "[DEMO DATA] Revenue beat expectations by 5%, leading to increased investor confidence.",
                "demo": True,
            },
        ],
        "_meta": {
            "mode": "demo",
            "source": "demo",
            "article_count": 2,
            "limitations": "FINNHUB_API_KEY not set or API unavailable. Showing demo news.",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
    }
