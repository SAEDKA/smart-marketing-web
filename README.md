# Smart Marketing Web

Next.js + TypeScript web dashboard for the Smart Marketing Platform.

## Local setup

Start the backend and infrastructure first, then run:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

The web app runs on `http://localhost:3000` by default. If the backend also runs on port 3000, start the web app on another port:

```powershell
npm run dev -- -p 3001
```

Set the backend API URL in `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Current foundation

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Arabic RTL application shell.
- Landing page.
- Login page connected to the backend login API.
- Dashboard shell and navigation placeholders.
- Shared API client with Bearer token support.
- Local access-token storage helper.

## Backend contract

The backend Swagger contract is available at `http://localhost:3000/docs` when the backend is running. The initial web integration uses:

```text
POST /api/v1/auth/login
GET  /api/v1/users/me
GET  /api/v1/products
```

## Verification

```powershell
npm run lint
npm run build
```

The production build uses Next.js Webpack mode for stable CSS builds in the team environment.

## Team workflow

Create a feature branch from `main`, keep API calls inside `src/lib`, and update loading/error states when adding a page. Do not connect the browser directly to PostgreSQL or social provider APIs.
