# 11 - Production Smoke Test

## API Endpoints to Test Post-Release
- [ ] `GET /health` (Should return 200)
- [ ] `GET /api/report/AAPL` (Should return 200, `mode="real"` or `mode="fallback"`)
- [ ] `POST /api/watchlist` (Should successfully create a user_watchlists row)