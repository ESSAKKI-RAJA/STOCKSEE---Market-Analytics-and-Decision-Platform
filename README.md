<div align="center">

# 📈 StockSee

### Real-time stock market analysis, AI-powered signals, and portfolio intelligence — all in one terminal.

<br/>

[![Vercel](https://img.shields.io/badge/Live%20Demo-stocksee--delta.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://stocksee-delta.vercel.app)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Auth%20%26%20DB-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Running Locally](#running-locally)
- [🔑 Environment Variables](#-environment-variables)
- [☁️ Deployment](#️-deployment)
  - [Frontend on Vercel](#frontend-on-vercel)
  - [Backend on Render](#backend-on-render)
  - [Supabase Configuration](#supabase-configuration)
  - [Google OAuth Setup](#google-oauth-setup)
- [🗂️ Project Structure](#️-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🏠 Dashboard

A comprehensive market command center with everything you need at a glance:

- **Market Overview** — Live indices, top gainers/losers, and sector performance
- **Trending Stocks** — Real-time momentum picks across NSE, BSE, NASDAQ, NYSE, and more
- **AI Top Picks** — Machine-learning-driven stock recommendations with confidence scores
- **News Sentiment Feed** — VADER + FinBERT sentiment analysis across financial headlines
- **Sector Heatmap** — Visual heat map of sector performance across global markets
- **Earnings Calendar** — Upcoming earnings announcements with consensus estimates
- **Fear & Greed Meter** — Composite market sentiment index
- **Crypto Movers** — Top 24h cryptocurrency movers and market cap leaders
- **Watchlist Snapshot** — Quick-glance performance of your saved instruments
- **Portfolio Insights** — P&L summary, allocation breakdown, and AI-driven portfolio health score

### 🔍 Analyse — Market Scanner

- Scan **thousands of instruments** across global exchanges and sectors simultaneously
- Filter by exchange (NSE, BSE, NASDAQ, NYSE, LSE, TSE, HKEX, XETRA, and more)
- Filter by sector (Technology, Financials, Energy, Healthcare, Consumer, Automotive, Defence, and more)
- AI signal overlay: **STRONG BUY / BUY / HOLD / SELL / STRONG SELL**
- Live price feeds with real-time change percentages

### ⭐ Watchlist

- Add any stock, ETF, or crypto to your personal watchlist
- Real-time price updates with percentage change indicators
- Row-level security — your list is private and user-scoped
- One-click navigation to full instrument detail pages

### 💼 Portfolio

- Track holdings across multiple exchanges in one place
- Automatic **P&L calculation** (unrealised gains/losses)
- **Sector allocation** breakdown with visual charts
- AI-powered portfolio health and diversification scoring
- Add / edit / remove holdings with buy price and quantity tracking

### 🔔 Alerts

- Create price alerts: **above / below** threshold
- Technical signal alerts: **SMA crossover bullish / bearish**
- Real-time push notifications when conditions are triggered
- Toggle alerts on/off without deleting them

### 📰 News Center

- Aggregated financial news from global sources via Finnhub
- Sentiment-scored headlines (Positive / Neutral / Negative)
- Filter news by instrument or browse general market news
- Auto-refreshing feed every 5 minutes

### 🗺️ Heatmaps

- Interactive sector and market-cap heatmaps
- Visual performance comparison across global equity markets
- Colour-coded intensity based on daily percentage moves

### 🔎 Screener Pro

- Multi-factor stock screener across fundamental and technical criteria
- Filter by market cap, P/E ratio, volume, RSI, MACD, and more
- Save screener configurations for repeated use

### 🎓 Academy

- Curated educational content for investors at every level
- Articles, glossaries, and guides covering technical analysis, fundamentals, and portfolio management

### ⚙️ Settings

- **Profile** — Update name, country, and experience level
- **Appearance** — Toggle dark / light mode
- **Market Preferences** — Set default exchange and currency
- **Notifications** — Granular control over alert delivery
- **Security** — Password management and active session review
- **Danger Zone** — Account deletion with confirmation safeguards

---

## 🛠️ Tech Stack

| Layer                  | Technology                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| **Frontend Framework** | [React 18](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org)                     |
| **Build Tool**         | [Vite](https://vitejs.dev)                                                                         |
| **Styling**            | [Tailwind CSS v3](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)                    |
| **Routing**            | [React Router v6](https://reactrouter.com)                                                         |
| **Server State**       | [TanStack Query v5](https://tanstack.com/query)                                                    |
| **Animations**         | [Framer Motion](https://www.framer.com/motion)                                                     |
| **Backend Framework**  | [FastAPI](https://fastapi.tiangolo.com) (Python 3.11+)                                             |
| **Market Data**        | [yfinance](https://github.com/ranaroussi/yfinance), [Finnhub](https://finnhub.io)                  |
| **Sentiment Analysis** | [VADER](https://github.com/cjhutto/vaderSentiment), [FinBERT](https://github.com/ProsusAI/finbert) |
| **ML / Forecasting**   | [scikit-learn](https://scikit-learn.org), [TensorFlow / Keras](https://www.tensorflow.org) (LSTM)  |
| **Database**           | [Supabase](https://supabase.com) (PostgreSQL + Row Level Security)                                 |
| **Authentication**     | [Supabase Auth](https://supabase.com/docs/guides/auth) — Email/Password + Google OAuth (PKCE)      |
| **JWT Validation**     | [PyJWT](https://pyjwt.readthedocs.io) + Supabase JWKS (RS256)                                      |
| **Frontend Deploy**    | [Vercel](https://vercel.com)                                                                       |
| **Backend Deploy**     | [Render](https://render.com)                                                                       |

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **npm** ≥ 9 (bundled with Node.js)
- **Python** ≥ 3.11 — [python.org](https://www.python.org/downloads)
- **pip** ≥ 23
- A free [Supabase](https://supabase.com) account and project
- A free [Finnhub](https://finnhub.io) API key

---

### Clone the Repository

```bash
git clone https://github.com/your-username/stocksee.git
cd stocksee
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-public-key
VITE_BACKEND_URL=http://localhost:8000
```

> **Security note:** `VITE_SUPABASE_PUBLISHABLE_KEY` is the **anon/public** key. Never paste the service role key into frontend environment variables.

---

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

Create `backend/.env`:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_JWT_AUD=authenticated
FINNHUB_API_KEY=your-finnhub-api-key
DISABLE_FINBERT=1
```

> **Tip:** `DISABLE_FINBERT=1` skips loading the FinBERT transformer model and uses the faster VADER fallback instead. Recommended locally and on low-memory servers.

---

### Running Locally

**Terminal 1 — Backend:**

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

- API: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

- App: `http://localhost:5173`

---

## 🔑 Environment Variables

### Frontend — `frontend/.env`

| Variable                        | Required | Description                                                                  |
| ------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | ✅       | Supabase project URL                                                         |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅       | Supabase anon/public API key                                                 |
| `VITE_BACKEND_URL`              | ✅       | FastAPI base URL (`http://localhost:8000` locally, Render URL in production) |

### Backend — `backend/.env`

| Variable           | Required | Description                                                                |
| ------------------ | -------- | -------------------------------------------------------------------------- |
| `SUPABASE_URL`     | ✅       | Supabase project URL — used to fetch JWKS for JWT validation               |
| `SUPABASE_JWT_AUD` | ✅       | JWT audience claim — must be `authenticated`                               |
| `FINNHUB_API_KEY`  | ✅       | API key from [finnhub.io](https://finnhub.io) for news and company data    |
| `DISABLE_FINBERT`  | ⬜       | Set to `1` to skip FinBERT and use VADER (recommended on Render free tier) |
| `RENDER`           | ⬜       | Auto-set by Render.com — also disables FinBERT on cold starts              |

---

## ☁️ Deployment

### Frontend on Vercel

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repository.
3. Set **Root Directory** to `frontend`.
4. Add all `VITE_*` environment variables under **Project Settings → Environment Variables**.
5. Vercel detects Vite automatically — no build command changes needed.
6. The `frontend/vercel.json` rewrite rule ensures all client-side routes resolve correctly:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### Backend on Render

1. Go to [render.com](https://render.com) → **New Web Service** → connect your repo.
2. Set **Root Directory** to `backend`.
3. **Build Command:**
   ```
   pip install -r requirements.txt
   ```
4. **Start Command:**
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add backend environment variables under **Environment**.
6. Set `DISABLE_FINBERT=1` on the free tier to stay within memory limits.

---

### Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → API** and copy:
   - **Project URL** → use as `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** key → use as `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Run database migrations using the Supabase CLI:
   ```bash
   npx supabase db push
   ```
   This creates the `profiles`, `watchlist`, `user_portfolio`, `user_alerts`, and `notifications` tables with Row Level Security policies automatically applied.
4. Go to **Authentication → URL Configuration** and add your allowed redirect URLs:
   ```
   https://stocksee-delta.vercel.app/auth/callback
   http://localhost:5173/auth/callback
   ```

---

### Google OAuth Setup

1. Open [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth 2.0 Client ID** (Application type: **Web application**).
3. Under **Authorized redirect URIs**, add:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
4. Copy the **Client ID** and **Client Secret**.
5. In your Supabase dashboard → **Authentication → Providers → Google** → paste the credentials and toggle the provider on.
6. Google sign-in will now appear on the `/login`, `/signup`, and `/auth` pages.

---

## 🗂️ Project Structure

```
stocksee/
├── frontend/                        # Vite + React + TypeScript
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Static assets (logos, images)
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui primitive components
│   │   │   ├── AISentiment.tsx      # AI news signal cards
│   │   │   ├── Layout.tsx           # App shell (sidebar + topbar)
│   │   │   ├── MarketNews.tsx       # Live news feed widget
│   │   │   ├── Navbar.tsx           # Public/marketing navbar
│   │   │   ├── NotificationsBell.tsx
│   │   │   ├── ProtectedRoute.tsx   # Auth guard — redirects to /login
│   │   │   ├── SectorHeatmap.tsx
│   │   │   ├── Sidebar.tsx          # Responsive sidebar drawer
│   │   │   ├── StockCard.tsx
│   │   │   ├── TickerBar.tsx        # Standalone scrolling ticker
│   │   │   └── Topbar.tsx           # Fixed top navbar with live ticker
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx      # Global Supabase auth state
│   │   ├── data/
│   │   │   └── stockData.ts         # Static stock/index reference data
│   │   ├── hooks/
│   │   │   ├── useAlerts.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── useWatchlist.ts
│   │   ├── integrations/
│   │   │   └── supabase/
│   │   │       ├── client.ts        # Supabase JS client instance
│   │   │       └── types.ts         # Auto-generated database types
│   │   ├── lib/
│   │   │   ├── apiClient.ts         # Centralised API client (auto Bearer token)
│   │   │   ├── supabaseClient.ts    # Canonical Supabase client + OAuth URL helper
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── AIAdvisor.tsx
│   │   │   ├── Alerts.tsx
│   │   │   ├── Analyse.tsx          # Market scanner
│   │   │   ├── Auth.tsx             # Combined sign-in / sign-up
│   │   │   ├── AuthCallback.tsx     # OAuth PKCE callback handler
│   │   │   ├── CryptoDetail.tsx
│   │   │   ├── ETFDetail.tsx
│   │   │   ├── Heatmaps.tsx
│   │   │   ├── Index.tsx            # Dashboard
│   │   │   ├── Learn.tsx            # Academy
│   │   │   ├── Login.tsx
│   │   │   ├── NewsCenter.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Screener.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── StockDetail.tsx
│   │   │   └── Watchlist.tsx
│   │   ├── App.tsx                  # Root router and providers
│   │   ├── index.css                # Tailwind base + global styles + keyframes
│   │   └── main.tsx                 # React DOM entry point
│   ├── vercel.json                  # SPA rewrite rule
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/
│   ├── main.py                      # FastAPI app — routes, JWT auth, ML, caching
│   ├── requirements.txt
│   └── .env                         # Local secrets (gitignored)
│
├── supabase/
│   ├── config.toml
│   └── migrations/                  # SQL migrations with RLS policies
│
└── README.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes and ensure the build passes:
   ```bash
   cd frontend && npm run build
   ```
4. Commit with a clear message:
   ```bash
   git commit -m "feat: add real-time options flow to dashboard"
   ```
5. Push and open a **Pull Request** against `main`.

### Guidelines

- Keep pull requests focused — one feature or fix per PR.
- Add TypeScript types for any new data shapes.
- All backend routes handling user data must use the `require_user` dependency.
- Never commit `.env` files, API keys, or secrets.
- Follow the existing code style — no linter warnings.

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20StockSee-2563FF?style=for-the-badge&logo=vercel&logoColor=white)](https://stocksee-delta.vercel.app)

</div>
