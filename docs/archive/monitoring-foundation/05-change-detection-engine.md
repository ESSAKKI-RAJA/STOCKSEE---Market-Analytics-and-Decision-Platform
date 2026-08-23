# 05 - Change Detection Engine

## Deterministic Rules (No LLM)
The frontend (or backend) will compare the previous stored state (e.g. from local storage or previous session) against the freshly fetched state.

Since this is Bin 6, and we want a stateless Free-First architecture:
For a true "change" to be detected across sessions, the backend or frontend must store the *last seen* state. 
- Option A: Frontend `localStorage`. Simple, free.
- Option B: Backend database (`UserWatchlist` extended with last_signal). 

To keep database migrations to zero (per safety rules), we will use **Option A (Frontend `localStorage`)** to track the user's "Last Seen" state.