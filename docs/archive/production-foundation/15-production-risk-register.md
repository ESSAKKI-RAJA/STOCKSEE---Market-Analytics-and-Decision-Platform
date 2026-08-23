# 15 - Production Risk Register

## Current Risks
1. **P1 (Migration Safety)**: Alembic SQLite -> Supabase PG.
2. **P2 (Sequential Batching)**: The batch endpoint processes symbols sequentially. If a user adds 20 un-cached symbols, the request may timeout.