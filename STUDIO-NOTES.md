# Yvonne Studios website

## Local preview

Run `npm run dev` from the root and visit http://localhost:5173.
Run `npm run build` followed by `npm start` to serve the built site and API together.

## Artwork and temporary details

All displayed artwork is lightweight SVG defined in `apps/web/src/components/Artwork.tsx`, as requested. No generated raster images are used. These are clearly identified as sample illustrations, ready to be replaced by Yvonne's actual portfolio.

The design uses cream, lavender, peach and sage with self-hosted Fraunces, DM Sans and Caveat fonts. The page includes a responsive menu, filterable gallery with detailed views, custom portrait configuration, reference photo upload, live event enquiry, FAQs and privacy information.

The logo and artist introduction are draft brand content. No fake reviews, event bookings, availability counts or business prices have been invented. Pricing, contact details and a payment provider remain temporary/unconfigured.

## Requests

Both forms submit multipart data to `POST /api/requests`. The backend validates fields, checks consent, validates reference image signatures, enforces a 5 MB upload limit and throttles submissions. Successful requests return a unique reference number.

Requests are appended to `apps/api/data/requests.jsonl`; optional photos are saved under `apps/api/data/references/`. This folder is gitignored and is never served publicly. Set `STUDIO_DATA_DIR` to an absolute path on a persistent disk when deploying. Maintain private backups. This starter uses local files, so a host with ephemeral storage requires a database and object-storage integration before launch.

There is intentionally no public endpoint exposing customer requests or photos. The studio owner can inspect records directly on the server. The website honestly identifies this preview as local request storage: no email is sent, no payment is collected and no event booking is confirmed.

## Before public launch

1. Replace sample SVG art and draft studio copy with approved artwork and brand details.
2. Confirm services, delivery times, printing/shipping terms, contact email and business policies.
3. Connect transactional email delivery and a private owner notification workflow.
4. Confirm prices and payment provider, then integrate server-verified checkout and payment webhooks.
5. Configure persistent private storage, HTTPS and the production domain. Use a shared rate-limit store if deploying multiple API instances.
6. Finalize privacy and order terms and review the entire order journey with real business details.

## Validation

Use `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`.
Run `npm run test:browser` for Chrome checks covering both forms, gallery filters, FAQs, mobile navigation and overflow at desktop, tablet and mobile sizes. These tests use a locally installed Chrome browser and save screenshots under the ignored `test-results` folder.
