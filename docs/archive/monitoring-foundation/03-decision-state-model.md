# 03 - Decision State Model

## Persisted State
To compare previous vs. current state without parsing the full report payload, we need a lightweight snapshot:
- `symbol` (str)
- `signal_label` (str)
- `confidence` (str)
- `risk_level` (str)
- `mode` (str)

*Note: For the Free-First, minimal API architecture, we will not store this in the database yet. Instead, we can dynamically load the current intelligence using the backend's caching layer.*