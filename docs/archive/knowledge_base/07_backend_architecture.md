# 07 - BACKEND ARCHITECTURE

## Folder Structure
```text
backend/app/
├── api/            # FastAPI route controllers
├── core/           # Configuration, security, DB connection
├── database/       # (Or db/) session management
├── models/         # SQLAlchemy ORM definitions
├── schemas/        # Pydantic models for request/response validation
├── services/       # Core business logic and data fetching
├── __init__.py
├── main.py         # FastAPI application entry point
```

## API Architecture (Controller-Service Pattern)
The backend follows a strict separation of concerns:
1. **API Layer (`app/api/` & `main.py`)**: Defines the HTTP endpoints, extracts path/query parameters, validates payloads using Pydantic schemas, and calls the appropriate service layer function. Returns standardized `FallbackResponse`.
2. **Service Layer (`app/services/`)**: Contains all the heavy lifting. Fetches data from external APIs, performs calculations, interacts with the database, and returns Python dictionaries.
3. **Data Access / Model Layer (`app/models/`)**: Defines the structure of the SQLite/PostgreSQL tables using SQLAlchemy.

## Main Entry Point (`main.py`)
- Initializes the FastAPI app `app = FastAPI(title="STOCKSEE API")`.
- Configures `CORSMiddleware` using `settings.cors_origins_list`.
- Includes routers: `ai_router` (`/api/ai`), `stocks_router` (`/api/stocks`), `system_router` (`/api`).
- Defines core `/api/market/*` routes which map directly to `market_data_service.py` and `indicator_service.py`.

## Services Breakdown
- **`market_data_service.py`**: Interacts with `yfinance`. Implements a graceful degradation flow (Cache -> yfinance -> Stale Cache -> Demo Fallback).
- **`indicator_service.py`**: Computes SMA, RSI, MACD, and volatility using Pandas based on history rows.
- **`sentiment_service.py`**: Takes news articles and runs VADER sentiment analysis to output a -1 to +1 score.
- **`prediction_service.py`**: A heuristic-based trend projector (explicitly NOT a deep learning ML model).
- **`signal_service.py`**: Merges indicators and sentiment into a unified "Bullish/Bearish" label.
- **`report_service.py`**: Aggregates all the above into a single comprehensive JSON payload for the frontend `StockDetail` page.
- **`cache_service.py`**: A custom in-memory TTL cache dictionary to prevent blowing past external API rate limits.

## Standardized Response Model
Every endpoint returns a `FallbackResponse` (defined in `schemas/common.py`):
```python
class FallbackResponse(BaseModel):
    status: str
    mode: str         # "real", "fallback", "demo", "stale_cache"
    source: str       # e.g., "yfinance", "calculated", "vader"
    message: str
    data: Any
    limitations: str  # Transparency string explaining the data's reliability
```

## Dependency Injection & Database Connection
- `app/db/session.py` initializes the SQLAlchemy `engine` and `SessionLocal`.
- FastAPI `Depends` is used in API routes to inject the DB session (`get_db()`) and the current user context (via JWT decoding).

## Error Handling & Logging
- Handled at the service level. If an external API fails (e.g., `yfinance` rate limit), the service catches the `Exception`, logs a warning using Python's `logging` module, and returns a demo/fallback payload instead of a 500 error, ensuring the frontend UI never breaks.
