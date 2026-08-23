"""Market data service — Orchestrates market data fetch across multiple providers.

Returns structured dicts with a `_meta` key containing mode/source info
so the API layer can propagate transparency to the frontend.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone
import logging
import time

from app.services.cache_service import get_cached_payload, set_cached_payload, get_stale_cache, log_source_event
from app.services.providers import AlphaVantageProvider, FinnhubProvider, YFinanceProvider, DemoProvider

logger = logging.getLogger(__name__)

# Instantiate providers in fallback order
_PROVIDERS = [
    AlphaVantageProvider(),
    FinnhubProvider(),
    YFinanceProvider(),
]
_DEMO_PROVIDER = DemoProvider()


def get_market_quote(symbol: str) -> Dict[str, Any]:
    """Fetch live quote via provider hierarchy. Falls back to stale cache or demo data on error."""
    # 1. Try valid cache
    cached = get_cached_payload(symbol, "quote")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return cached

    start_time = time.time()
    
    # 2. Try primary/secondary providers
    for provider in _PROVIDERS:
        try:
            payload = provider.get_quote(symbol)
            if payload:
                # Add metadata
                payload["_meta"] = {
                    "mode": provider.mode,
                    "source": provider.name,
                    "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                }
                
                latency = int((time.time() - start_time) * 1000)
                log_source_event(symbol, "quote", provider.name, provider.mode, True, latency)

                # Save to cache (TTL: 5 mins)
                set_cached_payload(symbol, "quote", payload, provider.mode, provider.name, 5)
                
                return payload
        except Exception as e:
            logger.warning(f"Provider {provider.name} failed to fetch quote for {symbol}: {e}")
            # Continue to next provider

    # 3. Fallback to stale cache if real data fails
    stale = get_stale_cache(symbol, "quote")
    if stale:
        latency = int((time.time() - start_time) * 1000)
        log_source_event(symbol, "quote", "stale_cache", "fallback", False, latency, "All real providers failed")
        stale["_meta"]["mode"] = "stale_cache"
        stale["_meta"]["cache_hit"] = True
        return stale

    # 4. Ultimate fallback to demo data
    latency = int((time.time() - start_time) * 1000)
    log_source_event(symbol, "quote", "demo", "fallback", False, latency, "All real providers and cache failed")
    
    demo_payload = _DEMO_PROVIDER.get_quote(symbol)
    demo_payload["_meta"] = {
        "mode": _DEMO_PROVIDER.mode,
        "source": _DEMO_PROVIDER.name,
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    return demo_payload


def get_market_history(symbol: str, period: str = "1mo") -> Dict[str, Any]:
    """Fetch historical OHLCV via provider hierarchy. Returns dict with rows + _meta."""
    cached = get_cached_payload(symbol, "history")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return cached

    start_time = time.time()
    
    for provider in _PROVIDERS:
        try:
            payload = provider.get_history(symbol, period)
            if payload and "rows" in payload and len(payload["rows"]) > 0:
                payload["_meta"] = {
                    "mode": provider.mode,
                    "source": provider.name,
                    "data_points": len(payload["rows"]),
                    "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                }
                
                latency = int((time.time() - start_time) * 1000)
                log_source_event(symbol, "history", provider.name, provider.mode, True, latency)

                # Cache history (TTL: 6 hours)
                set_cached_payload(symbol, "history", payload, provider.mode, provider.name, 360)
                return payload
        except Exception as e:
            logger.warning(f"Provider {provider.name} failed to fetch history for {symbol}: {e}")
            # Continue to next provider

    stale = get_stale_cache(symbol, "history")
    if stale:
        latency = int((time.time() - start_time) * 1000)
        log_source_event(symbol, "history", "stale_cache", "fallback", False, latency, "All real providers failed")
        stale["_meta"]["mode"] = "stale_cache"
        stale["_meta"]["cache_hit"] = True
        return stale

    latency = int((time.time() - start_time) * 1000)
    log_source_event(symbol, "history", "demo", "fallback", False, latency, "All real providers and cache failed")
    
    demo_payload = _DEMO_PROVIDER.get_history(symbol, period)
    demo_payload["_meta"] = {
        "mode": _DEMO_PROVIDER.mode,
        "source": _DEMO_PROVIDER.name,
        "data_points": len(demo_payload.get("rows", [])),
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    return demo_payload

def get_provider_status() -> Dict[str, Any]:
    """Returns the ordered fallback hierarchy of providers."""
    providers = []
    for p in _PROVIDERS:
        providers.append({
            "name": p.name,
            "mode": p.mode
        })
    providers.append({
        "name": _DEMO_PROVIDER.name,
        "mode": _DEMO_PROVIDER.mode
    })
    
    return {
        "hierarchy": providers,
        "primary": providers[0]["name"] if providers else "demo"
    }
