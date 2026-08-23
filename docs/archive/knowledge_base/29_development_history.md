# 29 - DEVELOPMENT HISTORY

## Phase 1: The Monolith MVP
- **Architecture**: Originally conceived as a standard dashboard. The frontend was built rapidly using Vite and Tailwind. 
- **Design Decisions**: `shadcn/ui` was chosen over heavy frameworks like Material-UI to maintain absolute control over the DOM and ensure a sleek, dark-mode aesthetic.

## Phase 2: The Data Crisis
- **Problem**: Direct API calls to yfinance from the frontend were impossible due to CORS. Calling them from the backend resulted in severe rate limiting and 5-second load times.
- **Refactoring**: Implemented the `cache_service.py`. The backend was decoupled into a strict Controller-Service pattern.
- **Lesson Learned**: Financial APIs are inherently flaky and rate-limited. Graceful degradation (the `FallbackResponse` architecture) is not optional; it is mandatory for user retention.

## Phase 3: The Intelligence Layer
- **Evolution**: Raw charts weren't enough. Users demanded analysis.
- **Implementation**: The NLP engine (`sentiment_service.py`) and the heuristic signal engine (`signal_service.py`) were built to condense data into actionable text.

## Phase 4: Current State
- Moving towards real database persistence (Supabase) for user data and SQLite for local rapid development.
