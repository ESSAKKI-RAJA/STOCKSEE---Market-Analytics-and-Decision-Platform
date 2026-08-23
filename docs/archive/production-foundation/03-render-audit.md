# 03 - Render Audit

## Configuration
- Added `render.yaml` to enforce Infrastructure-as-Code (IaC) deployment.
- Explicitly binds `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Python version pinned to 3.12.0.