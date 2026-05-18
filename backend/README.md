# Bookmark Manager Backend

Production-ready REST API backend for the Bookmark Manager frontend, built with Express, TypeScript, Sequelize, PostgreSQL, JWT, and OAuth (Google + GitHub).

## Tech Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- Passport.js (Google OAuth, GitHub OAuth)
- JWT authentication
- Zod validation
- Helmet + CORS + dotenv

## Folder Structure

```text
backend/
  src/
    app.ts
    server.ts
    configs/
      db.ts
      passport.ts
    utils/
      db.ts
      metadataFetcher.ts
      responseHandler.ts
    middlewares/
      authMiddleware.ts
      errorMiddleware.ts
      validationMiddleware.ts
    modules/
      auth/
      user/
      bookmark/
      tag/
    routes/
      index.ts
  .env
  .gitignore
  package.json
  tsconfig.json
```

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Google OAuth app credentials
- GitHub OAuth app credentials

## Environment Setup

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/bookmark_manager
JWT_SECRET=replace_with_strong_jwt_secret
GOOGLE_CLIENT_ID=replace_with_google_client_id
GOOGLE_CLIENT_SECRET=replace_with_google_client_secret
GITHUB_CLIENT_ID=replace_with_github_client_id
GITHUB_CLIENT_SECRET=replace_with_github_client_secret
SESSION_SECRET=replace_with_strong_session_secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
DB_SYNC=true
```

Notes:
- Use a strong random value for `JWT_SECRET` and `SESSION_SECRET`.
- Set `DB_SYNC=false` in production and use migrations.

## Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE bookmark_manager;
```

2. Update `DATABASE_URL` in `.env`.

3. For local bootstrapping, keep `DB_SYNC=true` so Sequelize can create tables automatically.

## Install and Run

From the `backend` directory:

```bash
npm install
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## Authentication Flow

- Start Google OAuth: `GET /api/auth/google`
- Start GitHub OAuth: `GET /api/auth/github`
- OAuth callback returns JWT (or redirects to frontend callback with token)
- Send JWT as bearer token:

```http
Authorization: Bearer <your_jwt_token>
```

## API Overview

### Auth

- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/auth/github`
- `GET /api/auth/github/callback`
- `GET /api/auth/me` (protected)

### Users

- `GET /api/users/me` (protected)
- `PATCH /api/users/me` (protected)

### Bookmarks

- `POST /api/bookmarks` (protected)
- `GET /api/bookmarks` (protected)
- `GET /api/bookmarks/search?search=term` (protected)
- `GET /api/bookmarks/favorites` (protected)
- `GET /api/bookmarks/:id` (protected)
- `PATCH /api/bookmarks/:id` (protected)
- `DELETE /api/bookmarks/:id` (protected)

Supports filtering and pagination:
- `?search=`
- `?category=`
- `?tag=`
- `?isFavorite=true|false`
- `?page=` and `?limit=`

### Tags

- `POST /api/tags` (protected)
- `GET /api/tags` (protected)
- `POST /api/tags/:id/bookmarks/:bookmarkId` (protected)
- `GET /api/tags/:id?page=1&limit=10` (protected)

## Metadata Extraction

When a bookmark is created or URL is changed, backend attempts to fetch:

- Page title
- Meta description
- Favicon
- Preview image
- Domain

using `link-preview-js`.

## Security Notes

- Helmet enabled
- CORS restricted via `FRONTEND_URL`
- dotenv for secrets/config
- JWT-protected routes
- ORM-based DB access through Sequelize

## Extensibility

The feature-first modular architecture makes it easy to add:
- Collections
- AI tagging
- Sharing
- Analytics
- Browser extension APIs
