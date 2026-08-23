# 12 - Bin 6 Implementation Report (Final Report)

**A. What does "monitoring" mean for STOCKSEE?**
Monitoring means tracking the user's Watchlist purely for **Decision Changes** across the Intelligence Core, not just surface-level price movements.

**B. What qualifies as a material change?**
- Signal Shifts (e.g. Bullish to Neutral)
- Risk Escalations (e.g. Low to Elevated)
- Confidence Deteriorations (e.g. High to Moderate)
- The introduction of a new Analytical Conflict

**C. What does NOT qualify?**
Tiny price movements, normal daily volatility, or identical intelligence reports returning the same setup.

**D. What decision state is persisted?**
A lightweight `DecisionState` object: `symbol, signalLabel, confidence, riskLevel, mode, evidence arrays, and conflicts`.

**E. How is previous state compared with current state?**
The frontend utilizes `localStorage` (`stocksee_watchlist_state`) to capture the user's "Last Seen State". On the next visit, `useWatchlistMonitoring` pulls the new state and diffs them locally.

**F. How is change detection deterministic?**
The rules are explicitly coded in `useWatchlistMonitoring.ts` as boolean logic (e.g., `isRiskEscalation = (prevState.riskLevel === "LOW" && currentState.riskLevel !== "LOW")`). There are no LLM hallucination risks.

**G. How many API requests are needed for 5/10/20 watchlist stocks?**
Exactly 1 request, regardless of the watchlist size.

**H. How is N+1 avoided?**
By introducing the `POST /api/report/batch` endpoint. The frontend sends all symbols in a single payload, and the backend loops through them and aggregates the intelligence.

**I. How is cache reused?**
The batch API endpoint actively hits `get_cached_payload(symbol, "report")` before doing any work. Since the `DecisionSnapshot` (from Bin 5) populates the cache for 6 hours, most batch monitoring requests will cost 0 API calls to external data providers.

**J. How does the watchlist prioritize attention?**
The UI renders three sections top-to-bottom:
1. **NEEDS ATTENTION**: For negative or risky material changes.
2. **CHANGED**: For neutral or positive shifts.
3. **STABLE**: For stocks that have not changed since last viewing.

**K. How are changes explained?**
The monitoring card explicitly lists the reason in plain english underneath the signal label (e.g., `Signal shifted from Bullish Setup to Neutral / Wait. Risk escalated from Low to Elevated`).

**L. How are confidence changes represented?**
Confidence changes are tracked separately. If Confidence drops, it triggers a NEEDS ATTENTION warning even if the Signal itself hasn't changed yet.

**M. How are risk changes represented?**
Risk escalations are treated as critical warnings, forcing the stock to the top of the NEEDS ATTENTION pile.

**N. How are scenario changes represented?**
Scenario projections are tracked, though explicit invalidation logic is currently tied strictly to Signal/Conflict changes to avoid noise.

**O. How is stale/demo data handled?**
The Transparency engine passes the `mode` down through the batch API. If the data is DEMO or STALE, the user is still warned in the UI.

**P. How is user ownership enforced?**
The existing `get_watchlist_api` securely enforces `current_user.id` using the Clerk JWT via `Depends(get_current_user)`.

**Q. What frontend components changed?**
- Created `useWatchlistMonitoring.ts`
- Rewrote `Watchlist.tsx` to rip out fake AI tables and insert Attention Hierarchy cards.

**R. What backend components changed?**
- Modified `backend/app/main.py` to add `POST /api/report/batch`.

**S. What database changes were required?**
None. By persisting the "Last Seen State" on the client (`localStorage`), we preserved Free-First architecture and maintained zero-risk production deployment status.

**T. What was intentionally NOT changed?**
We did NOT build push notifications (emails, SMS) or continuous background workers (Redis/Celery) to prevent alert spam and save infrastructure costs. We stuck to "On-Demand Monitoring".

**U. What tests passed?**
- N+1 test verified (only 1 batch request fired).
- Deterministic change logic simulated correctly across mock states.
- `npm run build` executed successfully without Vite/TypeScript errors.

**V. What remains unvalidated?**
We have not validated if real users prefer cross-device synchronization of their "Last Seen State" over `localStorage`. If they do, we will need a database migration in a future Bin.

**W. What should Bin 7 accomplish?**
Bin 7 should accomplish the **Production Deployment & Pipeline Fortification**. The codebase is now a valid, highly intelligent Decision Support and Monitoring tool. It is time to merge, fortify the data pipelines against real-world failures, and get it into the hands of real users.