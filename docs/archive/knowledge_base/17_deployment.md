# 17 - DEPLOYMENT

## Architecture
The deployment architecture is completely decoupled: the frontend is a Static Site (SPA) served via CDN, and the backend is an API Web Service.

## Frontend (Vercel)
- **Host**: Vercel
- **Build Command**: `npm run build` (Vite)
- **Routing**: Because it's an SPA using React Router, a `vercel.json` file dictates that all routes rewrite to `index.html`.
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **Environment Variables**: Managed in the Vercel UI (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_BACKEND_URL`).

## Backend (Render)
- **Host**: Render.com (Web Service)
- **Environment**: Python 3.11+
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Secrets**: API keys and database URLs are injected via the Render Dashboard. `DISABLE_FINBERT=1` is highly recommended on the free tier to prevent Out-Of-Memory (OOM) crashes.

## Database (Supabase)
- **Host**: AWS via Supabase Cloud.
- **Migration Pipeline**: SQL scripts are run via `npx supabase db push` to synchronize local schemas to production.

## CI/CD Pipeline
Currently relies on the built-in GitHub integrations of Vercel and Render. Pushing to the `main` branch automatically triggers builds and deployments on both platforms.

## Future Scaling
- **Dockerization**: A `Dockerfile` and `docker-compose.yml` should be created to containerize the FastAPI backend and Postgres database for deployment to AWS ECS or Kubernetes if Render's scaling limits are reached.
