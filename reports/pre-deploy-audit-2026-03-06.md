# Pre-Deploy Hardening + Legal Alignment Audit

Date: 2026-03-06  
Project: Saheeb Web (`/Users/m/Work/saheeb-web`)  
Mode: Report-first (no commit, no deploy)

## 1) Executive Status

Status: `READY FOR APPROVAL` to proceed to commit/deploy workflow.

Completed:

- Security/runtime hardening changes implemented.
- API contracts normalized and strictly validated.
- Legal/corporate content updated (Oman-first, GCC-safe wording).
- Asset compression completed with major size reduction.
- Quality gates and endpoint smoke tests passed.

Not executed yet (intentionally deferred for approval gate):

- Git history rewrite + force-push.
- Commit and deployment.

## 2) Baseline vs Current

### Baseline findings addressed

- Repo felt oversized for website scope.
- `npm run lint` previously failing.
- Production dependency audit previously flagged high advisory on older `next` version.
- Waitlist UI and API payload mismatch.
- Missing DB env caused runtime failures.
- Malformed `Referer` path had nondeterministic behavior instead of consistent `403`.

### Current outcome

- `lint`: pass
- `build`: pass
- `npm audit --omit=dev`: `found 0 vulnerabilities`
- API smoke matrix: pass (`201`, `400`, `403`, `401`, `200` as expected)
- Asset guard: pass

## 3) Implemented Changes

### A. Runtime and security hardening

- Upgraded dependencies:
  - `next` and `eslint-config-next` to `16.1.6`
  - Removed `@vercel/postgres`
  - Added/used `pg` with Drizzle node-postgres integration
- Added strict env validation (`src/lib/env.ts`):
  - Required: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
  - Optional: `RESEND_API_KEY`
- Added startup validation hook (`src/instrumentation.ts`) to fail fast at server startup with clear diagnostics.
- Reworked DB access (`src/db/index.ts`) to lazy initialize pool/DB while keeping strict runtime env enforcement.
- Hardened CSRF validation (`src/lib/csrf.ts`):
  - Malformed `Origin`/`Referer` now deterministic `403`
  - Optional allowlist override via `ALLOWED_ORIGINS`
- Hardened admin endpoint auth (`src/app/api/admin/waitlist/route.ts`):
  - Timing-safe credential compare
  - Auth rate limiting
  - No-store cache headers
- Added CSP and extra security headers (`next.config.ts`).
- Escaped/sanitized user input in HTML email notification templates (`src/lib/email.ts`).

### B. API/form contract consistency

- Added shared Zod validation schemas (`src/lib/validation.ts`) with strict limits and enum checks.
- Updated `/api/contact` and `/api/waitlist` to use strict schemas.
- Canonicalized waitlist `userType` to `buyer | seller | dealer` end-to-end.
- Fixed Saheeb Drive form payload to include required fields (`city`, `consentTimestamp`) and canonical `userType`.

### C. Legal + company information updates

- Added CR-derived corporate information in constants/legal text:
  - Legal entity: `SAHEEB TECH VENTURES LLC`
  - CR: `1642589`
  - Registered HQ: Duqm (Al Wusta)
  - Operational location: Muscat
- Updated EN/AR Privacy and Terms wording to remove unprovable absolutes and keep Oman/GCC-safe language.
- Added service licensing disclaimer text and surfaced it on services page.
- Removed unverified social links from structured metadata.
- Kept `/admin/waitlist` and `/[locale]/style-guide` reachable and non-indexed.

### D. Repository size remediation

- Added asset guard script (`scripts/check-asset-sizes.mjs`) and npm script `check:assets`.
- Compressed oversized PNG assets in `public/images` with conservative resize/compression settings.

## 4) Verification Evidence

### Quality gates

- `npm run lint`: pass
- `npm run build`: pass
- `npm audit --omit=dev`: pass (`0 vulnerabilities`)
- `npm run check:assets`: pass

### Env fail-fast check

Running `npm run start` without required env values returns startup failure with explicit diagnostics:

- Missing: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- Error surfaced during instrumentation startup hook.

### Endpoint smoke matrix (local, with DB configured)

Environment used:

- `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5499/taptrade`
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=admin-password-123`

Results:

- `contact_valid` -> `201` (`{"success":true,...}`)
- `contact_missing_fields` -> `400`
- `contact_invalid_origin` -> `403`
- `contact_malformed_referer` -> `403`
- `waitlist_valid` -> `201`
- `waitlist_missing_fields` -> `400`
- `waitlist_invalid_origin` -> `403`
- `admin_without_auth` -> `401`
- `admin_with_auth` -> `200` with entries payload

## 5) Size Metrics

Measured before optimization:

- `public/images`: `129M`
- `.git`: `128M`
- `git size-pack`: `122.33 MiB`

Measured after optimization:

- `public/images`: `27M` (reduced by ~102MB, ~79.1%)
- `.git`: `128M` (unchanged until history rewrite)

Interpretation:

- Working tree media weight reduced significantly.
- Repository pack size remains high because old blobs are still in git history.

## 6) Open Items / Deferred Actions

### A. Git history rewrite (approved in plan, not executed yet)

Reason deferred:

- Report-first gate requested before commit/deploy.
- Rewrite requires coordinated push and collaborator instructions.

Planned safe procedure:

1. Create backup tag.
2. Run history rewrite to remove/repoint old oversized image blobs.
3. Force-push rewritten branches/tags.
4. Share mandatory collaborator re-clone/reset steps.
5. Validate fresh clone size reduction.

### B. Legal review note

- Text is hardened for Oman-first/GCC-safe wording and aligned to provided references, but this is implementation-level compliance hardening, not formal legal counsel.

## 7) Files Added/Updated (high impact)

- `src/lib/env.ts`
- `src/instrumentation.ts`
- `src/lib/validation.ts`
- `src/lib/csrf.ts`
- `src/db/index.ts`
- `src/app/api/contact/route.ts`
- `src/app/api/waitlist/route.ts`
- `src/app/api/admin/waitlist/route.ts`
- `src/lib/email.ts`
- `src/lib/constants.ts`
- `src/messages/en.json`
- `src/messages/ar.json`
- `next.config.ts`
- `scripts/check-asset-sizes.mjs`
- `README.md`
- `public/images/*.png` (optimized set)

## 8) Approval Gate

No commit or deploy action has been taken.

If approved, next phase is:

1. Perform commit(s) with clear scope split.
2. Execute git history rewrite procedure.
3. Re-verify on fresh clone.
4. Prepare deploy command/runbook.

## 9) Legal Reference Links Used

- https://www.mtc.gov.om/itaportal/Data/English/DocLibrary/2024115132533256/PROMULGATING%20THE%20PERSONAL%20DATA%20PROTECTION%20LAW.pdf
- https://www.ita.gov.om/itaportal/Data/English/DocLibrary/2024115131527120/Issuing%20the%20Executive%20Regulation%20of%20the%20Personal%20Data%20Protection%20Law.pdf
- https://test.mtcit.gov.om/services-5/services-13/services-92/personal-data-protection-permits-service-378
