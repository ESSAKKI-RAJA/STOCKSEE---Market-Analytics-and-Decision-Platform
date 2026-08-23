# 11 - Error Handling & Observability

## Safety
- Internal database stack traces are swallowed by FastAPI error handlers.
- Endpoints return controlled JSON responses even during catastrophic provider failures.