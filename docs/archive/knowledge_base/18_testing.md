# 18 - TESTING

Currently, STOCKSEE is in MVP/Alpha phase and testing is minimal, relying on manual verification. To achieve enterprise readiness, the following testing architecture must be implemented.

## Current State
- **Frontend**: Contains `frontend/src/test/example.test.ts` and `vitest.config.ts`.
- **Backend**: No formal `pytest` suite exists.

## Required Testing Architecture

### 1. Frontend Unit & Component Tests (Vitest + React Testing Library)
- **Target**: `AISentiment.tsx`, `StockCard.tsx`, formatting utils (`currency.ts`).
- **Goal**: Ensure that confidence badges change color appropriately (e.g., Red for low confidence, Green for high) and that currency strings format correctly.

### 2. Backend Unit Tests (Pytest)
- **Target**: `indicator_service.py` and `signal_service.py`.
- **Goal**: Pass mocked Pandas DataFrames into `calculate_indicators()` to assert that RSI and MACD math is pixel-perfect against known historical values. Assert that `generate_signal()` correctly categorizes scores into the exact string labels required by the frontend.

### 3. Integration Tests
- **Target**: `main.py` API routes via FastAPI `TestClient`.
- **Goal**: Mock the external `yfinance` network calls using `responses` or `unittest.mock` to ensure the API controller successfully wraps the data in `FallbackResponse` and returns HTTP 200.

### 4. End-to-End (E2E) Tests (Playwright / Cypress)
- **Target**: The critical user path.
- **Flow to test**: User lands on site -> Logs in -> Searches for AAPL -> Adds to Watchlist -> Navigates to Watchlist and verifies AAPL is present.

## Security & Load Testing
- Use `Locust` to simulate 1,000 concurrent users hitting `/api/report/AAPL` to verify the `cache_service.py` successfully prevents rate-limit implosions.
