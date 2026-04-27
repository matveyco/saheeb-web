# Follow-up — instrumentation deploy 2026-04-27

The two new event types (`field_blur`, `client_error`) shipped to production at commit `b4f37e0` and are verified live by `npm run smoke:instrumentation` (13/13 passing) plus `npm run smoke:fbc` (22/22 passing).

The data is being collected. To **query** it from the GA4 admin/exploration UI, register two GA4 custom dimensions (one-time setup, ~2 minutes, dashboard-only — no code).

## GA4 console setup (do this once)

GA4 Admin → Data display → Custom definitions → Create custom dimensions:

| Dimension name | Scope | Event parameter | Description |
| --- | --- | --- | --- |
| Form field name | Event | `field_name` | Which form field the user blurred. Values: `email`, `phone`, `name` |
| Browser app | Event | `browser_app` | UA bucket. Values: `facebook_app`, `instagram_app`, `chrome`, `safari`, `firefox`, `edge`, `other` |
| Error stage | Event | `error_stage` | Source of the captured error. Values: `error`, `unhandledrejection` |

After registration, GA4 takes ~24h to backfill these into the exploration UI. After that:

## Quick analyses to run after 48h of data

### A. Where exactly do users abandon the form
GA4 → Explore → Free-form
- Rows: `Form field name`
- Values: `Event count` of `field_blur`
- Compare against `Event count` of `waitlist_submit_success`

If `field_blur` events for `phone` are much higher than for `email` while submits stay flat, the phone field is the abandonment point. Same logic for any other field.

### B. Errors by browser app
GA4 → Explore → Free-form
- Rows: `Browser app`
- Values: `Event count` of `client_error`
- Filter: `event_name = client_error`

Expectation based on Clarity: most errors will be in `facebook_app` and `instagram_app`. Drill in by `Page path` to find the page where it happens.

### C. Funnel by browser app
GA4 → Explore → Funnel
- Steps: `drive_page_view` → `waitlist_view` → `form_start` → `field_blur` → `waitlist_submit_success`
- Breakdown: `Browser app`

This is the chart that tells you whether in-app browser users complete at the same rate as Mobile Safari users. If they don't, it justifies the Tier 3 "open in your default browser" UX change.

## Verification

- `npm run smoke:fbc` — 22/22 (Meta CAPI fbc/fbp + idempotency + pixel)
- `npm run smoke:instrumentation` — 13/13 (field_blur + client_error end-to-end)
- Live: `https://saheeb.com/api/funnel` accepts `field_blur` and `client_error` (verified, status 202, accepted=1)
- Live: blurring the email field on `/ar/projects/saheeb-drive` POSTs a field_blur with no raw value content (verified, browser e2e)
- Live: window.onerror is forwarded to /api/funnel as client_error (verified, browser e2e)

## What's NOT done (intentionally)

- **GA4 custom dimensions**: console-only, see above.
- **Tier 3 UX changes** (in-app browser actionable banner, AR /lp redirect re-test): out of scope per "minimal risk, no FB campaign touches".
- **Performance optimizations**: no current data points to a perf bottleneck. Engagement on the EN /lp is 23.9s — healthy. The AR engagement gap (3.2s) is more likely a content/messaging issue than a perf issue.

## Rollback

If anything looks wrong, on the prod box:
```
cd /var/www/saheeb.com
git reset --hard b8e7134   # last green commit before this work
cp .env.local.backup.20260427-instrumentation .env.local
npm ci && npm run build
pm2 restart saheeb-web --update-env
```

Backup is at `/var/www/saheeb.com/.env.local.backup.20260427-instrumentation` (3,344 bytes, root:root).
