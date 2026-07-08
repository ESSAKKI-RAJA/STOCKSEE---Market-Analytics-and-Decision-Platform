# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-07-08

### Added
- **Clerk Authentication**: Fully integrated Clerk for secure authentication, replacing the legacy Supabase Auth flow.
- **Signal Engine**: Core algorithmic engine that synthesizes indicators, sentiment, and prediction data to emit Buy/Hold/Sell signals.
- **Reporting Engine**: Synthesizes all data sources into a comprehensive AI investment report.

### Changed
- **Massive Architecture Refactoring (Phases 1-9)**:
  - Frontend components have been structurally isolated into `layouts`, `features`, `styles`, and `services`.
  - Backend modules have been strictly segregated into `api`, `core`, `models`, `services`, and `database`.
  - Migrated entirely away from Prisma; standardizing on SQLAlchemy.
- Updated `.env` structures for complete separation of frontend (`VITE_CLERK_PUBLISHABLE_KEY`) and backend (`CLERK_SECRET_KEY`) secrets.
- Redesigned `Heatmaps` visualization to use dynamic data fetching.

### Removed
- Deprecated Supabase Auth UI components (`Auth.tsx`, `AuthCallback.tsx`).
- Legacy global `.env.local` mixed configuration file.
- Dead frontend layouts (`AnimatedBackground.tsx`, `HeroVisuals.tsx`).

## [0.1.0] - 2025-10-15

### Added
- Initial project release.
- Base integration of Vite + React + Tailwind CSS.
- Base integration of FastAPI backend.
- Simple Yahoo Finance (`yfinance`) data fetching.
- VADER sentiment analysis proof-of-concept.
