"""Company profile service — fetches real company data from Finnhub profile2.

Falls back to a curated static dataset for major stocks when Finnhub
is unavailable or rate-limited. Never fabricates data.
"""

import logging
import requests
from typing import Dict, Any, Optional
from datetime import datetime, timezone

from app.core.config import settings
from app.services.cache_service import get_cached_payload, set_cached_payload

logger = logging.getLogger(__name__)

FINNHUB_BASE = "https://finnhub.io/api/v1"

# ---------------------------------------------------------------------------
# Curated company profiles for major stocks (source: public company filings)
# These are facts, not invented descriptions. Only include verifiable data.
# ---------------------------------------------------------------------------
_CURATED: Dict[str, Dict[str, Any]] = {
    "AAPL": {
        "name": "Apple Inc.",
        "exchange": "NASDAQ",
        "sector": "Technology",
        "industry": "Consumer Electronics",
        "description": "Apple designs, manufactures, and markets smartphones (iPhone), personal computers (Mac), tablets (iPad), wearables (Apple Watch, AirPods), and services including the App Store, Apple Music, iCloud, and Apple TV+. It operates one of the world's largest retail networks and generates the majority of revenue from iPhone sales.",
        "website": "https://www.apple.com",
        "headquarters": "Cupertino, California, USA",
        "ipo": "1980-12-12",
        "employees": "~161,000",
        "peers": ["MSFT", "GOOGL", "AMZN", "META", "NVDA"],
    },
    "MSFT": {
        "name": "Microsoft Corporation",
        "exchange": "NASDAQ",
        "sector": "Technology",
        "industry": "Software — Infrastructure",
        "description": "Microsoft develops and licenses software products including Windows OS, Microsoft 365 productivity suite, Azure cloud computing platform, and LinkedIn. It also sells Xbox gaming consoles and Surface devices. Azure is the second-largest cloud platform globally and a primary growth driver.",
        "website": "https://www.microsoft.com",
        "headquarters": "Redmond, Washington, USA",
        "ipo": "1986-03-13",
        "employees": "~228,000",
        "peers": ["AAPL", "GOOGL", "AMZN", "ORCL"],
    },
    "GOOGL": {
        "name": "Alphabet Inc.",
        "exchange": "NASDAQ",
        "sector": "Communication Services",
        "industry": "Internet Content & Information",
        "description": "Alphabet is the parent company of Google, the world's dominant search engine and digital advertising platform. Revenue is primarily from Google Search and YouTube advertising. Google Cloud is a fast-growing segment. Other Bets include Waymo (autonomous vehicles) and Verily (life sciences).",
        "website": "https://abc.xyz",
        "headquarters": "Mountain View, California, USA",
        "ipo": "2004-08-19",
        "employees": "~182,000",
        "peers": ["META", "MSFT", "AAPL", "AMZN"],
    },
    "AMZN": {
        "name": "Amazon.com Inc.",
        "exchange": "NASDAQ",
        "sector": "Consumer Cyclical",
        "industry": "Internet Retail",
        "description": "Amazon operates the world's largest online retail marketplace and Amazon Web Services (AWS), the leading global cloud computing platform. AWS generates the majority of Amazon's operating profit. Other businesses include Prime Video, Alexa, Whole Foods, and Amazon Advertising.",
        "website": "https://www.amazon.com",
        "headquarters": "Seattle, Washington, USA",
        "ipo": "1997-05-15",
        "employees": "~1,540,000",
        "peers": ["MSFT", "GOOGL", "AAPL", "WMT"],
    },
    "NVDA": {
        "name": "NVIDIA Corporation",
        "exchange": "NASDAQ",
        "sector": "Technology",
        "industry": "Semiconductors",
        "description": "NVIDIA designs graphics processing units (GPUs) and system-on-chip units. It leads the AI accelerator market with its H100/H200 data center GPUs. Its CUDA software platform has built a dominant developer ecosystem. Revenue is split between Data Center (AI/HPC) and Gaming segments.",
        "website": "https://www.nvidia.com",
        "headquarters": "Santa Clara, California, USA",
        "ipo": "1999-01-22",
        "employees": "~36,000",
        "peers": ["AMD", "INTC", "QCOM", "AVGO"],
    },
    "META": {
        "name": "Meta Platforms Inc.",
        "exchange": "NASDAQ",
        "sector": "Communication Services",
        "industry": "Internet Content & Information",
        "description": "Meta operates Facebook, Instagram, WhatsApp, and Messenger — the world's largest social media ecosystem with over 3 billion daily active users. Revenue is overwhelmingly from targeted digital advertising. Meta is also investing heavily in AR/VR hardware (Quest headsets) and AI infrastructure.",
        "website": "https://about.meta.com",
        "headquarters": "Menlo Park, California, USA",
        "ipo": "2012-05-18",
        "employees": "~70,000",
        "peers": ["GOOGL", "SNAP", "PINS", "TWTR"],
    },
    "TSLA": {
        "name": "Tesla Inc.",
        "exchange": "NASDAQ",
        "sector": "Consumer Cyclical",
        "industry": "Auto Manufacturers",
        "description": "Tesla designs and manufactures electric vehicles (Model S, 3, X, Y, Cybertruck), energy storage products (Powerwall, Megapack), and solar products. Its Autopilot and Full Self-Driving software are key differentiators. Tesla also operates a global Supercharger network and generates services revenue.",
        "website": "https://www.tesla.com",
        "headquarters": "Austin, Texas, USA",
        "ipo": "2010-06-29",
        "employees": "~140,000",
        "peers": ["GM", "F", "RIVN", "NIO", "BYD"],
    },
    "TCS.NS": {
        "name": "Tata Consultancy Services Ltd.",
        "exchange": "NSE",
        "sector": "Technology",
        "industry": "IT Services & Consulting",
        "description": "TCS is India's largest IT services company and one of the world's largest by market capitalisation. It delivers IT outsourcing, consulting, and business process services to global clients across banking, financial services, retail, and manufacturing. A Tata Group company, TCS generates over 90% of revenue from international markets.",
        "website": "https://www.tcs.com",
        "headquarters": "Mumbai, Maharashtra, India",
        "ipo": "2004-08-25",
        "employees": "~600,000",
        "peers": ["INFY.NS", "HCLTECH.NS", "WIPRO.NS", "TECHM.NS"],
    },
    "INFY.NS": {
        "name": "Infosys Limited",
        "exchange": "NSE",
        "sector": "Technology",
        "industry": "IT Services & Consulting",
        "description": "Infosys is one of India's largest IT services and consulting firms, offering digital transformation, cloud computing, and outsourcing services globally. It serves clients in financial services, manufacturing, retail, energy, and telecom. Revenue is approximately 60% from North America.",
        "website": "https://www.infosys.com",
        "headquarters": "Bengaluru, Karnataka, India",
        "ipo": "1993-02-01",
        "employees": "~320,000",
        "peers": ["TCS.NS", "HCLTECH.NS", "WIPRO.NS"],
    },
    "HCLTECH.NS": {
        "name": "HCL Technologies Ltd.",
        "exchange": "NSE",
        "sector": "Technology",
        "industry": "IT Services & Consulting",
        "description": "HCL Technologies is one of India's top IT services companies offering software-led IT solutions, remote infrastructure management, and engineering R&D services. It has a strong presence in products and platforms through HCLSoftware. Revenue is split across services (IT & business services, engineering) and software products.",
        "website": "https://www.hcltech.com",
        "headquarters": "Noida, Uttar Pradesh, India",
        "ipo": "1999-11-10",
        "employees": "~225,000",
        "peers": ["TCS.NS", "INFY.NS", "WIPRO.NS", "TECHM.NS"],
    },
    "WIPRO.NS": {
        "name": "Wipro Limited",
        "exchange": "NSE",
        "sector": "Technology",
        "industry": "IT Services & Consulting",
        "description": "Wipro provides IT services, technology products, and business process outsourcing to global clients. It serves banking, financial services, healthcare, retail, and manufacturing verticals. Wipro has expanded through acquisitions and has a meaningful presence in cloud, cybersecurity, and AI services.",
        "website": "https://www.wipro.com",
        "headquarters": "Bengaluru, Karnataka, India",
        "ipo": "1945",
        "employees": "~240,000",
        "peers": ["TCS.NS", "INFY.NS", "HCLTECH.NS"],
    },
    "RELIANCE.NS": {
        "name": "Reliance Industries Limited",
        "exchange": "NSE",
        "sector": "Energy",
        "industry": "Oil, Gas & Petrochemicals / Telecom / Retail",
        "description": "Reliance Industries is India's largest company by revenue and market cap. It operates across oil-to-chemicals (O2C), oil and gas exploration, Jio Platforms (India's largest telecom operator), and Reliance Retail (India's largest organized retailer). Jio and Retail are the primary growth engines.",
        "website": "https://www.ril.com",
        "headquarters": "Mumbai, Maharashtra, India",
        "ipo": "1977-06-05",
        "employees": "~236,000",
        "peers": ["ONGC.NS", "BPCL.NS", "HINDPETRO.NS"],
    },
    "TATAMOTORS.NS": {
        "name": "Tata Motors Limited",
        "exchange": "NSE",
        "sector": "Consumer Cyclical",
        "industry": "Auto Manufacturers",
        "description": "Tata Motors manufactures cars, trucks, buses, and defence vehicles. Through its subsidiary Jaguar Land Rover (JLR), it sells premium vehicles globally. JLR contributes the majority of revenue. Tata Motors is also a major player in India's commercial vehicle and electric vehicle segments.",
        "website": "https://www.tatamotors.com",
        "headquarters": "Mumbai, Maharashtra, India",
        "ipo": "1954",
        "employees": "~88,000",
        "peers": ["MARUTI.NS", "M&M.NS", "BAJAJ-AUTO.NS"],
    },
}

# Map common ticker variants
_CURATED["TCS"] = _CURATED["TCS.NS"]
_CURATED["INFY"] = _CURATED["INFY.NS"]
_CURATED["HCLTECH"] = _CURATED["HCLTECH.NS"]
_CURATED["WIPRO"] = _CURATED["WIPRO.NS"]
_CURATED["RELIANCE"] = _CURATED["RELIANCE.NS"]
_CURATED["TATAMOTORS"] = _CURATED["TATAMOTORS.NS"]


def _clean_symbol(symbol: str) -> str:
    return symbol.strip().upper()


def _finnhub_profile(symbol: str) -> Optional[Dict[str, Any]]:
    """Fetch company profile from Finnhub /stock/profile2."""
    if not settings.FINNHUB_API_KEY:
        return None
    try:
        resp = requests.get(
            f"{FINNHUB_BASE}/stock/profile2",
            params={"symbol": symbol, "token": settings.FINNHUB_API_KEY},
            timeout=6,
        )
        resp.raise_for_status()
        data = resp.json()
        if not data or not data.get("name"):
            return None

        # Normalize to our canonical schema
        return {
            "name": data.get("name", ""),
            "exchange": data.get("exchange", ""),
            "sector": data.get("finnhubIndustry", ""),
            "industry": data.get("finnhubIndustry", ""),
            "description": (
                f"{data.get('name', symbol)} is listed on {data.get('exchange', 'N/A')} "
                f"in the {data.get('finnhubIndustry', 'N/A')} industry. "
                f"Market cap: {_format_mcap(data.get('marketCapitalization', 0))}. "
                f"IPO: {data.get('ipo', 'N/A')}. "
                f"Shares outstanding: {data.get('shareOutstanding', 'N/A')}M."
            ),
            "website": data.get("weburl", ""),
            "headquarters": data.get("country", ""),
            "ipo": data.get("ipo", ""),
            "employees": str(data.get("employeeTotal", "")) if data.get("employeeTotal") else None,
            "logo": data.get("logo", ""),
            "peers": [],
            "source": "finnhub",
        }
    except Exception as e:
        logger.warning(f"Finnhub profile2 failed for {symbol}: {e}")
        return None


def _format_mcap(value: float) -> str:
    if not value:
        return "N/A"
    if value >= 1_000_000:
        return f"${value/1_000_000:.1f}T"
    if value >= 1_000:
        return f"${value/1_000:.1f}B"
    return f"${value:.0f}M"


def get_company_profile(symbol: str) -> Dict[str, Any]:
    """
    Fetch a real company profile. Priority order:
    1. Valid cache
    2. Curated static dataset (most accurate for supported stocks)
    3. Finnhub profile2 API
    4. Honest "unavailable" response (never fabricates)
    """
    clean = _clean_symbol(symbol)

    # 1. Try cache (TTL: 24h — company data doesn't change frequently)
    cached = get_cached_payload(clean, "company_profile")
    if cached:
        cached["_meta"]["cache_hit"] = True
        return cached

    # 2. Try curated dataset first (most reliable)
    curated = _CURATED.get(clean)
    if curated:
        payload = {
            **curated,
            "symbol": clean,
            "is_fallback": False,
            "data_quality": "HIGH",
            "source": "curated",
            "_meta": {
                "mode": "curated",
                "source": "stocksee_curated",
                "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "cache_hit": False,
            },
        }
        set_cached_payload(clean, "company_profile", payload, "curated", "stocksee_curated", 1440)
        return payload

    # 3. Try Finnhub profile2
    finnhub_data = _finnhub_profile(clean)
    if finnhub_data:
        payload = {
            "symbol": clean,
            "peers": [],
            **finnhub_data,
            "is_fallback": False,
            "data_quality": "MEDIUM",
            "_meta": {
                "mode": "real",
                "source": "finnhub",
                "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "cache_hit": False,
            },
        }
        set_cached_payload(clean, "company_profile", payload, "real", "finnhub", 1440)
        return payload

    # 4. Honest unavailable — do NOT fabricate
    return {
        "symbol": clean,
        "name": clean,
        "exchange": "Unknown",
        "sector": "Unknown",
        "industry": "Unknown",
        "description": None,
        "website": None,
        "headquarters": None,
        "ipo": None,
        "employees": None,
        "peers": [],
        "logo": None,
        "is_fallback": True,
        "data_quality": "UNAVAILABLE",
        "source": "none",
        "_meta": {
            "mode": "unavailable",
            "source": "none",
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "cache_hit": False,
        },
    }
