# Conversion improvement analysis — 2026-04-27

Built from GA4 (`527517275`) + Microsoft Clarity (`w6yrv3zg8w`) + the deploy verification I just shipped. Ranked by leverage × confidence × risk.

## Headline pattern (what actually happened in the last 10 days)

The autofill fix in commit [6d493fb](commits/6d493fb) (Apr 23) was a step-change. Daily trend, last 11 days, paid-traffic-dominated:

| Date | drive_view | form_start | submit | conversion | validation_err |
|---|---:|---:|---:|---:|---:|
| Apr 17 | 2,818 | 120 | 0 | 0.00% | 44 |
| Apr 18 | 2,942 | 187 | 0 | 0.00% | **466** |
| Apr 19 | 3,178 | 222 | 0 | 0.00% | 69 |
| Apr 20 | 4,101 | 339 | 3 | 0.07% | 166 |
| Apr 21 | 4,196 | 401 | 2 | 0.05% | 95 |
| Apr 22 | 3,618 | 351 | 1 | 0.03% | 159 |
| **Apr 23** | 2,450 | 264 | **12** | **0.49%** | 46 |
| **Apr 24** | 262 | 66 | **26** | **9.92%** | 0 |
| Apr 25 | 367 | 91 | 32 | 8.72% | 1 |
| Apr 26 | 352 | 49 | 15 | 4.26% | 2 |
| Apr 27 | 160 | 8 | 1 | 0.63% | 0 |

Two distinct things happened: (1) the autofill fix took validation_error from ~150/day to ~0, and (2) someone cut paid spend ~10× starting Apr 24 (4k → 250 sessions/day). Net effect: lead volume per spend is up ~50–100×.

**Open question for the team:** is the spend cut deliberate? If yes, conversion is now operating in healthier waters and this report focuses on next-bottleneck wins. If the spend cut was an accident (paused campaign, billing issue), un-pausing combined with the now-fixed funnel should be the single biggest near-term lever — bigger than anything else in this doc.

## The audience reality check

Last 10d, paid Meta only:

- **98.2% mobile**, 99% from MetaADS source
- **Geographically: 66 of 77 Meta-paid submits from Oman** (96%). Other countries are 1–2 each, all from anomaly single-session spikes.
- **Browser distribution (Clarity, last 3d):** FacebookApp 980 sessions, InstagramApp 545, ChromeMobile 31, MobileSafari 12, Chrome desktop 16, SamsungInternet 7. **96% of paid traffic is in the Facebook or Instagram in-app WebView, not a regular browser.**

This frames everything else: optimizing for "mobile" really means optimizing for FB/IG WebView on Android (Android : iOS = 1,165 : 410 = 74:26 of paid sessions).

## Tier 1 — Zero-code, do today (no risk)

### 1.1 Verify Meta EMQ uplift from the fbc fix
The deploy at `b8e7134` is live (verified by `npm run smoke:fbc`, 22/22). Per Meta's own diagnostic, expect ~+0.7 EMQ on the `Lead` event within 24h. **Action**: log into Meta Events Manager → Datasets → Pixel 1822416752477116 → Lead → Match Quality, screenshot today's score, recheck 2026-04-28.

### 1.2 Investigate the JS errors in the FacebookApp WebView
Clarity flags 81 ScriptError events in 28 unique pages, concentrated entirely in `FacebookApp` (2.76% of those sessions) and Android (2.66%). Mobile Safari and iOS see effectively zero. **Action**: log into Clarity dashboard → Insights → Errors, filter `Browser = FacebookApp` and `Path = /projects/saheeb-drive/lp`, copy the top 3 stack traces. If any are inside our `WaitlistForm` component path, that's the next code fix and worth doing immediately.

### 1.3 Filter junk traffic in GA4
Two landing-page entries are skewing every aggregate metric:
- `(not set)` — 266 sessions, 96.2% bounce, 21s avg
- empty path `''` — 99 sessions, 100% bounce, 2s avg

These are bot/prefetch noise. **Action**: GA4 Admin → Data Settings → Data Filters → Internal Traffic → add a "junk landing" filter, or a Definition exclusion in the relevant exploration. Pure dashboard hygiene, no code change.

### 1.4 Confirm the spend-cut intent with media buyers
See "open question" above. If the Apr 24 spend cut is deliberate, the next step is gradually scaling spend back up while watching conversion stay >5% — this is the validation you actually want before re-investing.

## Tier 2 — Tiny, additive code change (very low risk)

### 2.1 Capture which form field people abandon on
Right now we know 35% of `form_start` reaches `submit` on the best days. We don't know **which field** the other 65% give up at. A single new event — `form_field_blur` with `{ field_name, is_valid, has_value }` — emitted from the existing form's onBlur handlers would tell us in a week.

- **Files touched**: `src/components/forms/WaitlistForm.tsx` only
- **Risk**: zero — additive event, doesn't change any visible behavior
- **Cost**: ~1k extra GA4 events/day at current volumes (well within free quota)
- **Payoff**: lets you target the next round of UX tweaks at the actual abandonment point instead of guessing. Especially valuable for diagnosing the AR locale gap (AR converts at 0.27% vs EN 0.57% on /lp; we don't know if it's a first-name field issue, phone format issue, or something else).

I have not implemented this — say the word and I'll add it. ~30 lines of changes, type-safe, lint-clean.

### 2.2 Capture window.onerror to GA4 (independent of Clarity)
We're depending on Clarity Errors view to spot WebView issues, but Clarity samples and rate-limits. A 5-line `window.addEventListener('error', …)` that pushes the message + URL + stack to a new `client_error` GA4 event would give us first-party error data, queryable in the same admin tool we already use.

- **Files touched**: `src/lib/analytics.ts` only (new helper alongside `trackEvent`)
- **Risk**: zero — listener-only, can't affect rendering
- **Payoff**: when a media buyer says "leads are down" we can answer in 30 seconds with "saw a JS error spike on the LP starting at 14:00 in FB WebView".

Same as 2.1: not implemented yet, say the word.

## Tier 3 — Worth considering, but actually ships UI risk (NOT recommended without explicit approval)

### 3.1 Make the in-app-browser banner actionable
[`DriveInAppBrowserBanner.tsx`](src/components/sections/drive/DriveInAppBrowserBanner.tsx) currently shows a dismissible passive notice. Given that 96% of paid sessions are stuck in FB/IG WebView and that's where all the JS errors are, an "Open in your default browser" button (using an `intent://` URL on Android, or a copy-link affordance on iOS) could lift conversion materially. **But** it adds friction — clicks the user has to make, opens up trust questions, and may lose the click ID on the WebView→Safari transition (re-introducing the same fbc problem we just fixed). Worth A/B-testing if the team can afford it; otherwise leave alone.

### 3.2 Re-test the AR /lp redirect with current data
[src/app/[locale]/projects/saheeb-drive/page.tsx:67-72](src/app/[locale]/projects/saheeb-drive/page.tsx#L67-L72) explicitly opts AR out of the paid→/lp redirect with the comment "AR organic 16% engagement vs AR LP 7% engagement". That decision was made on pre-Apr-23 data when validation errors were also masking the real signal. Worth re-testing now that the funnel is clean — but a real A/B test, not a flip. Not for me to change unilaterally.

## Things explicitly NOT broken (so don't touch them)

- **Validation errors:** were ~150/day, now ~0/day. The autofill fix solved this entirely. Don't add more validation logic.
- **Phone field for Oman:** despite earlier-report wording, validation_error is now near zero, so the `+968` formatter is fine.
- **Bounce rate on /en/lp at 68%:** that's normal for paid mobile cold traffic. The 23.9s avg engagement is healthier than it looks given the audience.

## What I want to do next (ask first)

If you want me to ship something concrete from this, my recommendation in order:

1. **Tier 2.1 (form_field_blur instrumentation).** Tiny, additive, fills the diagnostic gap on the start→submit drop-off.
2. **Tier 2.2 (client_error GA4 forwarding).** Tiny, additive, makes future WebView diagnostics 10× faster.
3. **Wait for the EMQ uplift confirmation (Tier 1.1)** before touching anything else — that's the validation that the work I just shipped is paying off.

Any one of those, all of them, or none — your call.
