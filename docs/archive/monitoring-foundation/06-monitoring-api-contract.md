# 06 - Monitoring API Contract

## New Endpoint: `POST /api/watchlist/intelligence`
Since `GET /api/report/{symbol}` is heavy, we will create a lightweight batch fetcher in the backend that pulls from cache primarily.
**Request**:
```json
{
  "symbols": ["AAPL", "MSFT"]
}
```
**Response**:
```json
{
  "status": "ok",
  "data": {
    "AAPL": { "signal": "Bullish Setup", "confidence": "High", "risk": "Low" },
    "MSFT": { "signal": "Neutral", "confidence": "Moderate", "risk": "Elevated" }
  }
}
```