# 19 - FOLDER STRUCTURE

## Root Directory
```text
STOCKSEE/
├── .git/
├── backend/            # Python / FastAPI server
├── docs/               # Documentation & Knowledge Base (You are here)
├── frontend/           # Vite / React UI
├── supabase/           # Database configurations and SQL migrations
├── .env                # Global / Prisma env overrides
├── .gitignore
├── diagnose-stocksee.bat  # Windows utility to check ports and deps
├── start-stocksee-dev.bat # Windows runner for both frontend/backend
├── stop-stocksee-dev.bat  # Windows killer for node/python processes
└── README.md           # Master project documentation
```

## Frontend Directory (`frontend/`)
```text
frontend/
├── dist/               # Compiled production build output
├── node_modules/
├── public/             # Static public files (favicon)
├── src/
│   ├── assets/         # Images
│   ├── components/     # Reusable React components
│   │   └── ui/         # shadcn components
│   ├── contexts/       # Auth context
│   ├── data/           # Hardcoded datasets
│   ├── hooks/          # Custom hooks
│   ├── integrations/   # Supabase client instances
│   ├── lib/            # Utilities
│   ├── pages/          # Next.js-style page components
│   ├── test/           # Vitest setup
│   ├── App.tsx         # Routing
│   ├── index.css       # Tailwind base
│   └── main.tsx        # Entry
├── .env                # VITE_ env vars
├── eslint.config.js
├── package.json
├── tailwind.config.ts  # Tailwind theme definitions
├── tsconfig.json
├── vercel.json         # SPA routing config
└── vite.config.ts      # Vite bundler config
```

## Backend Directory (`backend/`)
```text
backend/
├── alembic/            # Database migration scripts
├── app/
│   ├── api/            # Route controllers
│   ├── core/           # config.py, security setup
│   ├── database/       # session.py
│   ├── models/         # SQLAlchemy schemas
│   ├── schemas/        # Pydantic validation schemas
│   ├── services/       # Business logic (indicator_service, signal_service)
│   └── main.py         # App initialization
├── scripts/            # DB seeder / utility scripts
├── .env                # SUPABASE_, FINNHUB_, DISABLE_FINBERT
├── requirements.txt    # Python dependencies
└── stocksee_dev.db     # SQLite local database
```
