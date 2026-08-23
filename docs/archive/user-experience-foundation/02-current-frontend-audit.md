# 02 - Current Frontend Audit

## Findings from the Frontend Review

1. **Information Hierarchy**: The current `StockDetail.tsx` relies on fake, hardcoded UI components. Specifically, `CoreQuestionsOverview.tsx` hardcodes values like "Gross Margin 45.2%" and "ROE 24.8%". `AIInsightCard.tsx` renders a fake Quant Engine display. 
2. **API Waterfalls**: The frontend fires multiple requests. `AIAdvisor` triggers `/api/ai/report`, while `useStockAnalysis` triggers `/api/report/{symbol}` independently.
3. **Cognitive Overload**: The user is blasted with fake progress bars, fake institutional flows, and random indicators. The real intelligence generated in Bin 4 is completely hidden behind an "AI Report" button that just dumps raw Markdown on the screen.
4. **Poor Terminology**: Words like "Quant Engine Pro" and "Institutional AI" are used, violating the principle of analytical honesty.

## Verdict
The frontend is a classic "data dump" that pretends to be a Bloomberg terminal. We must delete the fake components (`CoreQuestionsOverview`, `AIInsightCard`) and replace them with a single, massive **Decision Snapshot** component that consumes the real `/api/report/{symbol}` response.