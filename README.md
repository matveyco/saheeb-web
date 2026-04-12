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
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional; public GA4 measurement ID for limited landing/conversion attribution plus consented behavioral analytics)
- `NEXT_PUBLIC_META_PIXEL_ID` (optional; public Meta Pixel ID for landing/conversion attribution plus consented behavioral analytics)
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` (optional; Clarity project ID for public Saheeb Drive pages)
- `CLARITY_DATA_EXPORT_API_TOKEN` (optional; Clarity export token for diagnostics)
- `GA4_PROPERTY_ID` (optional; enables server-side GA4 reconciliation in admin)
- `GA4_SERVICE_ACCOUNT_CLIENT_EMAIL` (optional; GA4 reporting service account email)
- `GA4_SERVICE_ACCOUNT_PRIVATE_KEY` (optional; GA4 reporting service account private key with `\n` escapes)
- `META_CAPI_ACCESS_TOKEN` (optional; enables server-side Meta lead delivery)
- `GOOGLE_SITE_VERIFICATION` (optional; Google Search Console verification token)
- `META_DOMAIN_VERIFICATION` (optional; Meta domain verification token)
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
- Server-side locale redirects for the root URL plus canonical host/protocol middleware
- Always-on public attribution and behavioral analytics for Saheeb Drive

## API Contracts

### `POST /api/contact`

Required:

- `name`, `email`, `message`, `consent=true`, `locale`, `consentTimestamp`

Optional:

- `phone`, `subject`

### `POST /api/waitlist`

Required:

- `name`, `email`, `userType`, `locale`, `consentTimestamp`

Optional:

- `consent=true` (the public waitlist now treats submit as passive consent if omitted)
- `phone`
- `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`
- `referrer`, `landingPath`

`userType` accepted values:

- `buyer`
- `seller`

### `POST /api/funnel`

Internal first-party funnel logging endpoint for anonymous Drive conversion events.

Accepted `eventName` values:

- `drive_page_view`
- `waitlist_view`
- `cta_click`
- `form_start`
- `form_submit_attempt`
- `validation_error`
- `waitlist_submit_success`
- `waitlist_submit_duplicate`
- `share_click`
- `privacy_click`
- `language_switch`
- `nav_exit`

## Pre-Deploy Checks

Run:

```bash
npm run lint
npm run build
npm audit --omit=dev
npm run check:assets
```

For production readiness, ensure `DATABASE_URL`, admin credentials, and origin allowlist are correctly configured for the deployment domain.

If GA4 or Meta Pixel is enabled, also set `NEXT_PUBLIC_GA_MEASUREMENT_ID` and/or `NEXT_PUBLIC_META_PIXEL_ID` in the production build environment and confirm the privacy page reflects the live tracking configuration. Set `GOOGLE_SITE_VERIFICATION` and `META_DOMAIN_VERIFICATION` when webmaster verification tags are needed.

After deploying the current Saheeb Drive funnel, mark `waitlist_submit_success` as a GA4 key event in the GA4 UI and verify Meta `Lead` fires from the live site.
