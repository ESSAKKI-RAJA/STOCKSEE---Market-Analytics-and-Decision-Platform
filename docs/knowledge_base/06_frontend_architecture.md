# 06 - FRONTEND ARCHITECTURE

## Folder Structure
```text
frontend/src/
├── assets/         # Static images, logos (stocksense-logo.png)
├── components/     # Reusable UI widgets and layout containers
│   └── ui/         # shadcn/ui primitive components (buttons, dialogs, etc.)
├── contexts/       # React Context providers (AuthContext.tsx)
├── data/           # Mock/Static data (newsData.ts, stockData.ts, heatmaps.ts)
├── hooks/          # Custom React hooks (useAlerts.ts, useWatchlist.ts)
├── integrations/   # Third-party integrations (supabase, lovable)
├── lib/            # Utilities, API clients (apiClient.ts, utils.ts)
├── pages/          # Full page route components
├── App.tsx         # Main router and app shell
├── index.css       # Tailwind entry and global CSS variables
├── main.tsx        # React DOM render entry
```

## Pages
- `Index.tsx`: The main dashboard.
- `Analyse.tsx`, `Screener.tsx`: Market scanning interfaces.
- `StockDetail.tsx`, `CryptoDetail.tsx`, `ETFDetail.tsx`: Asset specific dashboards.
- `Watchlist.tsx`, `Portfolio.tsx`, `Alerts.tsx`: User-specific data views.
- `AIAdvisor.tsx`: Dedicated AI signal explanation page.
- `Auth.tsx`, `SignIn.tsx`, `SignUp.tsx`, `AuthCallback.tsx`: Authentication flows.
- `Settings.tsx`, `Pricing.tsx`, `Learn.tsx`, `NewsCenter.tsx`, `Heatmaps.tsx`.

## Key Components
- **`Layout.tsx`**: Wraps all authenticated and public pages. Contains the `Sidebar.tsx` (navigation) and `Topbar.tsx` (user profile, theme toggle, and `TickerBar.tsx`).
- **`AIInsightCard.tsx` / `AISentiment.tsx`**: Displays the AI signal and confidence score.
- **`MarketInsights.tsx` / `MarketNews.tsx`**: Dashboard widgets for macro data.
- **`StockCard.tsx`**: Reusable card for asset previews in watchlists or screeners.
- **`SectorHeatmap.tsx`**: Treemap visualization for sectors.

## Hooks & Contexts
- **`AuthContext.tsx`**: Manages the user session. Connects to `SupabaseClient` and provides `session`, `user`, and `signOut` functions to the app.
- **`useStockPrices.ts`**: Fetches quotes via `apiClient`.
- **`useStockAnalysis.ts`**: Fetches `GET /api/report/{symbol}` and provides loading states.
- **`useWatchlist.ts`, `useAlerts.ts`, `useNotifications.ts`**: Interact with the respective backend endpoints and manage local cache via TanStack Query.

## State Management
- **TanStack Query (React Query)**: Handles all server state. It caches API responses, handles retries, and eliminates the need for Redux or complex `useEffect` chains for data fetching.
- **Context API**: Handles global UI state (Theme) and Auth state.
- **Local State (`useState`)**: Used exclusively for transient UI state (e.g., modal open/close, form inputs).

## Routing
Managed by `react-router-dom` in `App.tsx`.
- **`ProtectedRoute.tsx`**: An element wrapper that checks `AuthContext`. If `!session`, it redirects to `/login`.

## Styling & Theming
- **Tailwind CSS**: Using `tailwind.config.ts` for custom colors (background, foreground, primary, secondary, destructive, ring) driven by CSS variables in `index.css`.
- **Dark Mode**: Managed by `next-themes` (`ThemeProvider`). `index.css` defines `.dark` class variables.

## Performance Optimizations
- Vite's built-in chunk splitting.
- TanStack Query avoids refetching identical data within the `staleTime` window.
- Debounced search inputs in `Analyse.tsx`.
