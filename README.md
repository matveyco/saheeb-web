# Saheeb Web

Marketing website and lead-capture platform for Saheeb, with bilingual content (`en`/`ar`), company/project pages, contact form, and waitlist intake.

## Stack

- Next.js 16 (App Router)
- TypeScript
- next-intl
- Drizzle ORM + PostgreSQL (`pg`)
- Tailwind CSS

## Runtime Requirements

- Node.js 20+
- PostgreSQL (self-hosted or managed)

Copy `.env.example` to `.env.local` and configure:

- `DATABASE_URL` (required)
- `ADMIN_USERNAME` (required)
- `ADMIN_PASSWORD` (required, minimum 12 chars)
- `RESEND_API_KEY` (optional; if omitted, email notifications are skipped)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional; public GA4 measurement ID, loaded only on approved production hosts after analytics consent)
- `ALLOWED_ORIGINS` (optional, comma-separated CSRF allowlist override)

## Scripts

- `npm run dev` - start local dev server on `:3333`
- `npm run build` - production build
- `npm run start` - run production server on `:3333`
- `npm run lint` - lint checks
- `npm run check:assets` - fail if any file in `public/images` exceeds 6MB

## Security Controls

- Strict runtime env validation via Zod (`src/lib/env.ts`)
- CSRF origin/referer validation with deterministic `403` on malformed/invalid origin
- Rate limiting on contact, waitlist, and admin auth endpoints
- Timing-safe Basic Auth comparison for admin data endpoint
- CSP and hardening response headers in `next.config.ts`
- HTML escaping for outbound contact email templates
- Shared Zod request schemas for contact/waitlist APIs
- Consent-gated GA4 analytics with manual page views and non-PII funnel events

## API Contracts

### `POST /api/contact`

Required:

- `name`, `email`, `message`, `consent=true`, `locale`, `consentTimestamp`

Optional:

- `phone`, `subject`

### `POST /api/waitlist`

Required:

- `name`, `phone`, `userType`, `city`, `consent=true`, `locale`, `consentTimestamp`

Optional:

- `email`

`userType` accepted values:

- `buyer`
- `seller`
- `dealer`

## Pre-Deploy Checks

Run:

```bash
npm run lint
npm run build
npm audit --omit=dev
npm run check:assets
```

For production readiness, ensure `DATABASE_URL`, admin credentials, and origin allowlist are correctly configured for the deployment domain.

If GA4 is enabled, also set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the production build environment and confirm the privacy page reflects the live analytics configuration.
