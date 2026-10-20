# Yvonne Studios

A warm, whimsical studio website for Melbourne live portraits and custom illustration.
Built with React, Vite, TypeScript and Express in an npm workspace monorepo.

## Start locally

Use Node.js 22.12+ (Node 24 recommended) and npm 10+.

```sh
npm install
npm run dev
```

Open http://localhost:5173. The API listens on http://127.0.0.1:3001,
and Vite proxies `/api` requests to it. Both servers reload as you edit.

## What's included

- Responsive studio landing page with self-hosted typography and SVG illustrations
- Filterable portfolio with artwork detail dialogs
- Two-step custom portrait request form with optional reference photo upload
- Live illustration event enquiry form
- Server validation, private request persistence and submission throttling
- Mobile navigation, keyboard-friendly dialogs, FAQs and privacy information

Business details are temporary. The forms save requests, with no email delivery,
payment collection or confirmed bookings yet. See [STUDIO-NOTES.md](STUDIO-NOTES.md)
for storage details and the remaining production integrations.

## Commands

```sh
npm run dev          # Frontend and backend together
npm run dev:web      # Frontend only
npm run dev:api      # Backend only
npm run lint         # ESLint
npm run typecheck    # TypeScript checks
npm test             # API validation and persistence tests
npm run test:browser # Desktop/mobile Chrome integration tests
npm run build        # Production builds for both workspaces
npm start            # Serve built site and API on port 3001
```

Browser tests use a locally installed Google Chrome browser. They save screenshots
under the gitignored `test-results` directory.

## Structure

```text
apps/
  web/src/StudioApp.tsx            Page content and navigation
  web/src/components/Artwork.tsx   Sample SVG portfolio artwork
  web/src/components/RequestDialog.tsx
                                  Portrait and event request forms
  api/src/app.ts                  Express application
  api/src/requests.ts             Validated requests and private storage
tests/browser/                    Browser integration tests
```

## Environment and production

Defaults work without environment files. Copy either workspace's `.env.example`
to `.env` for local overrides.

- API: `HOST`, `PORT`, and optional `STUDIO_DATA_DIR` for persistent private storage.
- Web: `API_PROXY_TARGET` to change the development API target.
- Frontend variables starting with `VITE_` are public; keep secrets in the API.

Run `npm run build` before `npm start`. Express serves the built frontend with
an SPA fallback and preserves JSON 404 responses for unknown API routes.
Set `HOST=0.0.0.0` to listen outside the local machine. Configure HTTPS at your host.
Keep request data on persistent storage; the default directory is `apps/api/data`.
