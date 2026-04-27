# Saheeb Web — Performance snapshot (2026-04-27)

GA4 property `527517275` · Clarity project `w6yrv3zg8w`. All windows end at "today" in property timezone (Europe/Berlin).

## Headline

| Metric | Last 3 days | Last 10 days | Daily-rate Δ (3d vs 10d) |
| --- | ---: | ---: | ---: |
| Total users | 1,450 | 16,156 | -70.1% |
| Sessions | 1,526 | 21,662 | -76.5% |
| Engaged sessions | 339 | 6,087 | -81.4% |
| Avg session duration (s) | 48.0 | 92.8 | — |
| Bounce rate | 77.8% | 71.9% | — |
| **Waitlist submits** | **73** | **91** | **+167.4%** |
| Submits / 1k sessions | 47.84 | 4.20 | — |

## Funnel — last 10 days

| Stage | Events (10d) | Per day | Drop from previous |
| --- | ---: | ---: | ---: |
| drive_page_view | 24,442 | 2444.2 | — |
| waitlist_view | 13,039 | 1303.9 | 46.7% |
| form_start | 2,098 | 209.8 | 83.9% |
| form_submit_attempt | 63 | 6.3 | 97.0% |
| waitlist_submit_success | 91 | 9.1 | +44.4% (more events than upstream — see note) |
| validation_error _(sideband)_ | 1,048 | 104.8 | — |
| waitlist_submit_duplicate _(sideband)_ | 24 | 2.4 | — |

### Conversion rates (10d window)

- **drive_page_view → waitlist_view**: 53.3%
- **waitlist_view → form_start**: 16.1%
- **form_start → submit_success**: 4.3%
- **drive_page_view → submit_success (overall)**: 0.4%
- **validation_error per form_start**: 50.0% (each form_start can produce multiple field-level validation errors; ratios >100% are expected and indicate friction)

> Note: `form_submit_attempt` is emitted from the client only on certain paths, while `waitlist_submit_success` is also confirmed server-side, so `success / attempt` can exceed 100% in GA4 and is not a reliable conversion signal here. Use `form_start → submit_success` as the primary completion metric.

## Funnel — last 3 days

| Stage | Events (3d) | Per day | Drop from previous |
| --- | ---: | ---: | ---: |
| drive_page_view | 1,139 | 379.7 | — |
| waitlist_view | 939 | 313.0 | 17.6% |
| form_start | 214 | 71.3 | 77.2% |
| form_submit_attempt | 59 | 19.7 | 72.4% |
| waitlist_submit_success | 73 | 24.3 | +23.7% (more events than upstream — see note) |
| validation_error _(sideband)_ | 3 | 1.0 | — |
| waitlist_submit_duplicate _(sideband)_ | 23 | 7.7 | — |

## Microsoft Clarity behavior signals

### Last 3 days

| Signal | % of sessions | Total events | Pages affected |
| --- | ---: | ---: | ---: |
| DeadClickCount | 3.40% | 129 | 57 |
| ExcessiveScroll | 0.00% | 0 | 0 |
| RageClickCount | 0.19% | 17 | 3 |
| QuickbackClick | 0.95% | 18 | 18 |
| ScriptErrorCount | 1.95% | 84 | 32 |
| ErrorClickCount | 0.00% | 0 | 0 |
| ScrollDepth | 0.00% | 0 | 0 |
| Traffic | 0.00% | 0 | 0 |
| EngagementTime | 0.00% | 0 | 0 |
| Browser | 0.00% | 0 | 0 |
| Device | 0.00% | 0 | 0 |
| OS | 0.00% | 0 | 0 |
| Country | 0.00% | 0 | 0 |
| PageTitle | 0.00% | 0 | 0 |
| ReferrerUrl | 0.00% | 0 | 0 |
| PopularPages | 0.00% | 0 | 0 |

_Clarity API caps `numOfDays` at 3; 10-day window is unavailable from the live-insights endpoint._

## Top traffic sources (10d, by sessions)

| Channel | Source | Medium | Sessions | Users |
| --- | --- | --- | ---: | ---: |
| Display | MetaADS | banner | 21,489 | 16,024 |
| Unassigned | (not set) | (not set) | 130 | 122 |
| Direct | (direct) | (none) | 71 | 55 |
| Organic Search | google | organic | 7 | 1 |
| Paid Other | qa | paid | 5 | 5 |
| Organic Social | facebook.com | referral | 4 | 4 |
| Unassigned | MetaADS | carousel | 3 | 3 |
| Organic Social | m.facebook.com | referral | 2 | 2 |
| Cross-network | (data not available) | (data not available) | 1 | 1 |
| Paid Other | qa-retry | paid | 1 | 1 |
| Paid Social | fb | paid | 1 | 1 |

## Device split (10d)

| Device | Sessions | Users | Share |
| --- | ---: | ---: | ---: |
| mobile | 21,228 | 15,855 | 98.2% |
| tablet | 331 | 294 | 1.5% |
| desktop | 59 | 41 | 0.3% |
| smart tv | 1 | 1 | 0.0% |

## Recommendations

These are derived mechanically from the funnel + Clarity numbers above. Review against intuition before acting.

- **CTA prominence at form view.** 16.1% of users that see the form actually start typing. Test bigger primary CTA copy / contrast / friction-removal (e.g. fewer fields above fold).
- **Validation friction is high.** 50.0% validation events per form_start. Inspect inline error copy and field formats (phone for Saudi/Oman locales is the usual culprit) — autofill bug was already fixed in commit 6d493fb but worth re-checking field-level validators.
- **Submit completion gap.** Only 4.3% of users that started the form actually completed. Likely causes: dedupe path mistaken for failure, or unrecoverable validation.
- **Dead-click hot spot (3.40% of sessions).** 129 dead clicks across 57 pages — inspect the top dead-click pages in Clarity and fix the unresponsive elements (often non-button styled as button).
- **Rage-click signal (0.19% of sessions).** Check Clarity replays of those sessions; rage-clicks usually point to a CTA that fails silently or a slow async action with no feedback.
- **Quickback (0.95% of sessions).** Users navigating in then bouncing back fast — mismatch between landing page promise and content. Worth a paid-traffic LP audit.
- **JS errors detected (84 events, 1.95% of sessions).** Surface in Clarity → Errors view and prioritize anything blocking the form path.
- **Submits trending up.** Daily submit rate rose from 9.1/day (10d) to 24.3/day (3d). Likely tied to recent autofill fix (commit 6d493fb) — verify by spot-checking recent waitlist entries and consider mirror creatives.
- **Traffic step-down.** Sessions/day dropped from 2166 (10d avg) to 509 (3d avg). Confirm with media-buying team whether ad spend was paused or capped — combined with the submit-rate jump, conversion-rate is up sharply.
- **Mobile-dominant audience (98.2%).** Treat mobile as the primary surface for any UX work; desktop is a rounding error. Form usability + paste/autofill paths are the highest-leverage targets.
- **Meta CAPI `fbc` fix shipped today.** Re-pull EMQ score for the Lead event 24h after deploy — expect ~+0.7 bump per Meta diagnostic.

---

_Raw API responses cached under `reports/.cache/` (gitignored). Rerun: `npm run report:performance`._
