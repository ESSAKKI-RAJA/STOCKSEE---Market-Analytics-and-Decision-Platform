# 05 - Evidence & Conflict UX

## Purpose
To answer the "Why?" without forcing the user to decipher a massive Markdown wall or raw indicator values.

## UX Mapping
The `/api/report/{symbol}` returns `final_analysis_summary` containing explicit substrings like `Bullish Evidence: ... | Bearish Evidence: ... | Key Conflicts Detected: ...`.

The UI will split this string into arrays and render them as clean bulleted lists with appropriate icons (e.g., green checkmarks for evidence, yellow warning triangles for conflicts).

If there are no conflicts, a lightweight "No major conflicts detected" state will be shown instead of an empty box.