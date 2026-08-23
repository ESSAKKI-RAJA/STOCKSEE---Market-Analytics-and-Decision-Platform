# 06 - API Contract Regression

## Compliance
- All endpoints conform to the `FallbackResponse` schema.
- Required fields (`_meta`, `mode`, `limitations`) are consistently populated.
- Batch fetching correctly aggregates multiple single-responses without contract deviation.