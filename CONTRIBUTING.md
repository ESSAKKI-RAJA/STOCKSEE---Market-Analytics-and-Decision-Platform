# Contributing to STOCKSEE

Welcome to STOCKSEE. We are building an institutional-grade market intelligence platform. 

## Project Philosophy
STOCKSEE is designed around one core idea: **"Don't predict the market. Understand it."**
We prioritize evidence over hype, explanation over prediction, and absolute transparency over false confidence.

As a contributor, you must adhere to the following rules:
- **No Fake Data**: Never visually imply real market data when the backend is using demo or fallback data.
- **Maintain Data Quality Badging**: If you implement a new data source, ensure it hooks into the `_meta` fallback system so users know exactly what data they are viewing.
- **Institutional Aesthetics**: Do not add unnecessary animations, generic cards, or "crypto-bro" visual paradigms. Maintain the Ink & Slate, high-density, sharp-edged aesthetic.

## Development Setup
1. Clone the repository.
2. Install frontend dependencies: `cd frontend && npm install`
3. Install backend dependencies: `cd backend && pip install -r requirements.txt`
4. Set up your local environment variables in `frontend/.env` and `backend/.env`. (Use the examples provided; **never** commit secrets).

## Commit Conventions
We follow standard semantic commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation updates
- `refactor:` for code restructuring without behavioral changes
- `chore:` for routine tasks

## Pull Requests
- Keep your PRs small and focused.
- Ensure `npm run build` succeeds on the frontend.
- Ensure backend startup tests and database migrations pass without errors.
- Never include sensitive tokens, API keys, or database credentials in your PR.

## Security Requirements
- All API keys must be loaded via environment variables.
- Do not bypass authentication just to make a test pass.
- For security vulnerabilities, please refer to our `SECURITY.md` file.

Thank you for contributing to STOCKSEE!
