# 08 - Loading & Error States

## UX Strategy
We will eliminate the jarring "Loading..." text and instead use Skeleton loaders that mimic the final layout of the Decision Snapshot. 

If the backend returns a fallback or error, the UI will gracefully degrade, displaying the available data (e.g. just the price) while clearly noting that the Intelligence Core is unavailable, instead of rendering a broken component.