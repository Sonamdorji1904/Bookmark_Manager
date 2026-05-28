# Render Deployment Guide

Use the files in this repository as production env templates, but set the real values in the Render dashboard.

## What each file is for

- `Backend/.env.production` is a template for backend production values.
- `Frontend/.env.production` is the frontend production API base URL.
- Render itself does not read these files directly; it uses the environment variables you configure in the service settings.

## Backend service

Set these environment variables in the Render backend service:

- `DATABASE_URL`
- `JWT_SECRET`
- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`
- `DB_SYNC=true` for the first deploy if the database is empty

Recommended values:

- `FRONTEND_URL` should be your deployed frontend URL, for example `https://bookmark-fe-v1.onrender.com`
- `BACKEND_URL` should be your deployed backend URL, for example `https://bookmark-be-v1.onrender.com`
- After the tables are created, switch `DB_SYNC` back to `false` and redeploy to avoid accidental schema changes

If you are seeing `relation "users" does not exist`, the database schema has not been created yet. The quickest fix is:

1. Set `DB_SYNC=true` in the Render backend environment.
2. Redeploy the backend once so Sequelize creates the tables.
3. Confirm the app works.
4. Change `DB_SYNC=false` again and redeploy.

## Frontend service

Set this environment variable in the Render frontend service:

- `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

This must point to the public backend URL so the browser sends Google login requests to the deployed API, not localhost.

Important: `NEXT_PUBLIC_API_URL` is baked into the frontend build. After changing it in Render, redeploy the frontend service so the new value is compiled into the app.

## Google OAuth setup

Update the Google OAuth callback URL to:

```text
https://bookmark-be-v1.onrender.com/api/auth/google/callback
```

Do not use `http://localhost:5001/api/auth/google/callback` in production. If the callback URL is still `localhost`, Google sign-in will send the user back to your local machine instead of Render.

If you also want local development to keep working, add both redirect URIs in Google Console:

- `http://localhost:5001/api/auth/google/callback`
- `https://bookmark-be-v1.onrender.com/api/auth/google/callback`

Google requires an exact match, including `http` vs `https`, host, port, and path.

Also make sure the Render backend service has:

- `FRONTEND_URL=https://bookmark-fe-v1.onrender.com`
- `BACKEND_URL=https://bookmark-be-v1.onrender.com`
- `NEXT_PUBLIC_API_URL=https://bookmark-be-v1.onrender.com` on the frontend service

## Deployment steps

1. Push the latest code to GitHub.
2. Update Render backend env vars.
3. Update Render frontend env vars.
4. Redeploy the frontend service first if you changed `NEXT_PUBLIC_API_URL`.
5. Redeploy the backend service if you changed any backend env var.
6. Open the frontend URL and test Google sign-in.

## Local use

If you want to use the same values locally:

```bash
cp Backend/.env.production Backend/.env
cp Frontend/.env.production Frontend/.env.local
```

Then replace the placeholder values with your local URLs and secrets.