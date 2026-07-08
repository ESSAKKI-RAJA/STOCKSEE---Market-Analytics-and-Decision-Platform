# Contributing to STOCKSEE

First off, thank you for considering contributing to STOCKSEE! It's people like you that make STOCKSEE such a great platform for the open-source and financial technology community.

We welcome all contributions, from bug fixes and documentation updates to entirely new AI intelligence engines.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### 1. Fork the Repository
Fork the project on GitHub and clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/STOCKSEE.git
cd STOCKSEE
```

### 2. Environment Setup

STOCKSEE requires Node.js (20.x+) for the frontend and Python (3.12+) for the backend.

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Branching Strategy

We follow a strict branching model:
- `main` is the production-ready branch.
- `develop` is the active development branch.
- Create feature branches off `develop`.

Branch naming conventions:
- `feat/description` for new features
- `fix/description` for bug fixes
- `docs/description` for documentation
- `refactor/description` for code refactoring

## Coding Standards

### Frontend (React / TypeScript)
- We use **ESLint** and **Prettier**. Run `npm run lint` before committing.
- Prefer Functional Components and Hooks.
- Ensure strict typings in TypeScript. Avoid `any`.
- Adhere to the Shadcn UI and Tailwind utility class patterns. Do not write custom CSS unless strictly necessary.

### Backend (FastAPI / Python)
- We follow **PEP 8** standard. Run `flake8` to verify.
- Type hints are required for all function arguments and returns.
- Write docstrings for all services and API endpoints.

## Testing
- **Frontend**: Unit tests are located in `frontend/src/tests`. We use Vitest. Run with `npm run test`.
- **Backend**: Unit tests are located in `backend/app/tests`. We use Pytest. Run with `pytest`.

Ensure all tests pass before opening a Pull Request.

## Pull Request Process

1. Ensure your branch is up to date with `develop`.
2. Run all linting and testing commands.
3. Push to your fork and submit a Pull Request targeting the `develop` branch.
4. Fill out the **Pull Request Template** completely.
5. Request a review from the core maintainers.

Upon review, maintainers might request changes. Once approved and CI passes, your PR will be merged.

## Reporting Issues

If you find a bug or have a feature request, please use the GitHub Issues tab. We have templates for:
- **Bug Reports**
- **Feature Requests**

Please search existing issues before creating a new one to avoid duplicates.
