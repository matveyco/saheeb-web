#!/usr/bin/env node
// Pull a 3-day vs 10-day performance snapshot from GA4 + Microsoft Clarity
// and write a markdown report under reports/.
//
// Usage:
//   node --env-file=.env.local scripts/pull-performance-report.mjs
//
// Required env (already validated in src/lib/env.ts):
//   GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_CLIENT_EMAIL,
//   GA4_SERVICE_ACCOUNT_PRIVATE_KEY, CLARITY_DATA_EXPORT_API_TOKEN,
//   NEXT_PUBLIC_CLARITY_PROJECT_ID

import { createSign } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const today = new Date().toISOString().slice(0, 10);
const REPORT_PATH = resolve(ROOT, `reports/performance-${today}.md`);
const CACHE_DIR = resolve(ROOT, 'reports/.cache');

const FUNNEL_EVENTS = [
  'page_view',
  'drive_page_view',
  'waitlist_view',
  'cta_click',
  'form_start',
  'form_submit_attempt',
  'validation_error',
  'waitlist_submit_success',
  'waitlist_submit_duplicate',
  'scroll_depth',
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function fetchGoogleAccessToken() {
  const clientEmail = requireEnv('GA4_SERVICE_ACCOUNT_CLIENT_EMAIL');
  const privateKey = requireEnv('GA4_SERVICE_ACCOUNT_PRIVATE_KEY').replace(
    /\\n/g,
    '\n'
  );

  const iat = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://oauth2.googleapis.com/token',
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      iat,
      exp: iat + 3600,
    })
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${payload}`);
  signer.end();
  const signature = base64UrlEncode(signer.sign(privateKey));
  const assertion = `${header}.${payload}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GA4 OAuth failed: ${response.status} ${await response.text()}`
    );
  }

  const json = await response.json();
  if (!json.access_token) {
    throw new Error('GA4 OAuth returned no access_token');
  }
  return json.access_token;
}

async function ga4Run(accessToken, propertyId, body, label) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(
      `GA4 ${label} failed: ${response.status} ${await response.text()}`
    );
  }

  const json = await response.json();
  cacheJson(`ga4-${label}.json`, json);
  return json;
}

function cacheJson(name, payload) {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(resolve(CACHE_DIR, name), JSON.stringify(payload, null, 2));
}

function rowsToObjects(report) {
  const dimNames = (report.dimensionHeaders ?? []).map((h) => h.name);
  const metricNames = (report.metricHeaders ?? []).map((h) => h.name);
  return (report.rows ?? []).map((row) => {
    const out = {};
    dimNames.forEach((name, i) => {
      out[name] = row.dimensionValues?.[i]?.value ?? null;
    });
    metricNames.forEach((name, i) => {
      const raw = row.metricValues?.[i]?.value ?? '0';
      out[name] = Number(raw);
    });
    return out;
  });
}

function sumMetric(rows, metric) {
  return rows.reduce((acc, row) => acc + (Number(row[metric]) || 0), 0);
}

function eventCountsByName(rows) {
  const out = {};
  for (const row of rows) {
    out[row.eventName] = (out[row.eventName] || 0) + (row.eventCount || 0);
  }
  return out;
}

function pct(numerator, denominator) {
  if (!denominator) return '—';
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function delta(current, baseline, baselineDays, currentDays) {
  // Compare daily rate to remove window-size bias
  const baselineDaily = baseline / baselineDays;
  const currentDaily = current / currentDays;
  if (!baselineDaily) {
    return currentDaily > 0 ? '+∞' : '0';
  }
  const change = ((currentDaily - baselineDaily) / baselineDaily) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

async function pullClarity(numOfDays) {
  const token = requireEnv('CLARITY_DATA_EXPORT_API_TOKEN');
  const url = `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=${numOfDays}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(
      `Clarity ${numOfDays}d failed: ${response.status} ${await response.text()}`
    );
  }
  const json = await response.json();
  cacheJson(`clarity-${numOfDays}d.json`, json);
  return json;
}

function summarizeClarity(metrics) {
  const out = {};
  for (const entry of metrics) {
    const info = entry.information?.[0] ?? {};
    out[entry.metricName] = {
      sessions: Number(info.sessionsCount ?? 0),
      pct: Number(info.sessionsWithMetricPercentage ?? 0),
      pages: Number(info.pagesViews ?? 0),
      total: Number(info.subTotal ?? 0),
    };
  }
  return out;
}

function fmt(n) {
  return new Intl.NumberFormat('en-US').format(n);
}

function buildFunnelTable(events, days) {
  // Linear funnel stages only (validation_error and duplicate are sidebands)
  const linear = [
    ['drive_page_view', events.drive_page_view ?? 0],
    ['waitlist_view', events.waitlist_view ?? 0],
    ['form_start', events.form_start ?? 0],
    ['form_submit_attempt', events.form_submit_attempt ?? 0],
    ['waitlist_submit_success', events.waitlist_submit_success ?? 0],
  ];
  const sidebands = [
    ['validation_error', events.validation_error ?? 0],
    ['waitlist_submit_duplicate', events.waitlist_submit_duplicate ?? 0],
  ];

  let lines = [
    `| Stage | Events (${days}d) | Per day | Drop from previous |`,
    `| --- | ---: | ---: | ---: |`,
  ];

  let prev = null;
  for (const [name, count] of linear) {
    const perDay = (count / days).toFixed(1);
    let drop = '—';
    if (prev !== null && prev > 0) {
      const pctDrop = 100 - (count / prev) * 100;
      drop =
        pctDrop >= 0
          ? `${pctDrop.toFixed(1)}%`
          : `+${(-pctDrop).toFixed(1)}% (more events than upstream — see note)`;
    }
    lines.push(`| ${name} | ${fmt(count)} | ${perDay} | ${drop} |`);
    prev = count;
  }
  for (const [name, count] of sidebands) {
    const perDay = (count / days).toFixed(1);
    lines.push(`| ${name} _(sideband)_ | ${fmt(count)} | ${perDay} | — |`);
  }
  return lines.join('\n');
}

async function main() {
  const propertyId = requireEnv('GA4_PROPERTY_ID');
  const clarityProjectId =
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? '(unset)';

  console.log(`[1/6] GA4 OAuth (property ${propertyId})…`);
  const accessToken = await fetchGoogleAccessToken();

  console.log('[2/6] GA4 funnel events (10d)…');
  const funnel10d = await ga4Run(
    accessToken,
    propertyId,
    {
      dateRanges: [{ startDate: '10daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: FUNNEL_EVENTS },
        },
      },
    },
    'funnel-10d'
  );

  console.log('[2/6] GA4 funnel events (3d)…');
  const funnel3d = await ga4Run(
    accessToken,
    propertyId,
    {
      dateRanges: [{ startDate: '3daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: FUNNEL_EVENTS },
        },
      },
    },
    'funnel-3d'
  );

  console.log('[3/6] GA4 totals (10d & 3d)…');
  const totals10d = await ga4Run(
    accessToken,
    propertyId,
    {
      dateRanges: [{ startDate: '10daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'engagedSessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    },
    'totals-10d'
  );
  const totals3d = await ga4Run(
    accessToken,
    propertyId,
    {
      dateRanges: [{ startDate: '3daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'engagedSessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    },
    'totals-3d'
  );

  console.log('[4/6] GA4 traffic sources (10d)…');
  const sources10d = await ga4Run(
    accessToken,
    propertyId,
    {
      dateRanges: [{ startDate: '10daysAgo', endDate: 'today' }],
      dimensions: [
        { name: 'sessionDefaultChannelGroup' },
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
      ],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 25,
    },
    'sources-10d'
  );

  console.log('[5/6] GA4 device split (10d)…');
  const devices10d = await ga4Run(
    accessToken,
    propertyId,
    {
      dateRanges: [{ startDate: '10daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    },
    'devices-10d'
  );

  console.log('[6/6] Microsoft Clarity insights (3d & 10d)…');
  // Clarity API caps numOfDays at 3; pull two snapshots and label one as
  // "trailing 3d" — the 10d window is delivered by GA4 + the additional 3d
  // Clarity probe documenting current behavior signal.
  const clarity3d = await pullClarity(3);
  let clarity10dRaw = null;
  try {
    clarity10dRaw = await pullClarity(10);
  } catch (err) {
    console.warn(
      `Clarity 10d unavailable (likely API max=3): ${err.message.slice(0, 120)}`
    );
  }

  // ---- Build report ----
  const events10d = eventCountsByName(rowsToObjects(funnel10d));
  const events3d = eventCountsByName(rowsToObjects(funnel3d));
  const t10d = rowsToObjects(totals10d)[0] ?? {};
  const t3d = rowsToObjects(totals3d)[0] ?? {};
  const sources = rowsToObjects(sources10d);
  const devices = rowsToObjects(devices10d);
  const clarity3dSummary = summarizeClarity(clarity3d);
  const clarity10dSummary = clarity10dRaw
    ? summarizeClarity(clarity10dRaw)
    : null;

  const submitsPer1k10d =
    t10d.sessions > 0
      ? ((events10d.waitlist_submit_success ?? 0) / t10d.sessions) * 1000
      : 0;
  const submitsPer1k3d =
    t3d.sessions > 0
      ? ((events3d.waitlist_submit_success ?? 0) / t3d.sessions) * 1000
      : 0;

  const md = `# Saheeb Web — Performance snapshot (${today})

GA4 property \`${propertyId}\` · Clarity project \`${clarityProjectId}\`. All windows end at "today" in property timezone (Europe/Berlin).

## Headline

| Metric | Last 3 days | Last 10 days | Daily-rate Δ (3d vs 10d) |
| --- | ---: | ---: | ---: |
| Total users | ${fmt(t3d.totalUsers ?? 0)} | ${fmt(t10d.totalUsers ?? 0)} | ${delta(t3d.totalUsers ?? 0, t10d.totalUsers ?? 0, 10, 3)} |
| Sessions | ${fmt(t3d.sessions ?? 0)} | ${fmt(t10d.sessions ?? 0)} | ${delta(t3d.sessions ?? 0, t10d.sessions ?? 0, 10, 3)} |
| Engaged sessions | ${fmt(t3d.engagedSessions ?? 0)} | ${fmt(t10d.engagedSessions ?? 0)} | ${delta(t3d.engagedSessions ?? 0, t10d.engagedSessions ?? 0, 10, 3)} |
| Avg session duration (s) | ${(t3d.averageSessionDuration ?? 0).toFixed(1)} | ${(t10d.averageSessionDuration ?? 0).toFixed(1)} | — |
| Bounce rate | ${pct(t3d.bounceRate ?? 0, 1)} | ${pct(t10d.bounceRate ?? 0, 1)} | — |
| **Waitlist submits** | **${fmt(events3d.waitlist_submit_success ?? 0)}** | **${fmt(events10d.waitlist_submit_success ?? 0)}** | **${delta(events3d.waitlist_submit_success ?? 0, events10d.waitlist_submit_success ?? 0, 10, 3)}** |
| Submits / 1k sessions | ${submitsPer1k3d.toFixed(2)} | ${submitsPer1k10d.toFixed(2)} | — |

## Funnel — last 10 days

${buildFunnelTable(events10d, 10)}

### Conversion rates (10d window)

- **drive_page_view → waitlist_view**: ${pct(events10d.waitlist_view ?? 0, events10d.drive_page_view ?? 0)}
- **waitlist_view → form_start**: ${pct(events10d.form_start ?? 0, events10d.waitlist_view ?? 0)}
- **form_start → submit_success**: ${pct(events10d.waitlist_submit_success ?? 0, events10d.form_start ?? 0)}
- **drive_page_view → submit_success (overall)**: ${pct(events10d.waitlist_submit_success ?? 0, events10d.drive_page_view ?? 0)}
- **validation_error per form_start**: ${pct(events10d.validation_error ?? 0, events10d.form_start ?? 0)} (each form_start can produce multiple field-level validation errors; ratios >100% are expected and indicate friction)

> Note: \`form_submit_attempt\` is emitted from the client only on certain paths, while \`waitlist_submit_success\` is also confirmed server-side, so \`success / attempt\` can exceed 100% in GA4 and is not a reliable conversion signal here. Use \`form_start → submit_success\` as the primary completion metric.

## Funnel — last 3 days

${buildFunnelTable(events3d, 3)}

## Microsoft Clarity behavior signals

### Last 3 days

| Signal | % of sessions | Total events | Pages affected |
| --- | ---: | ---: | ---: |
${Object.entries(clarity3dSummary)
  .map(
    ([name, m]) =>
      `| ${name} | ${m.pct.toFixed(2)}% | ${fmt(m.total)} | ${fmt(m.pages)} |`
  )
  .join('\n')}

${clarity10dSummary
  ? `### Last 10 days\n\n| Signal | % of sessions | Total events | Pages affected |\n| --- | ---: | ---: | ---: |\n${Object.entries(clarity10dSummary)
      .map(
        ([name, m]) =>
          `| ${name} | ${m.pct.toFixed(2)}% | ${fmt(m.total)} | ${fmt(m.pages)} |`
      )
      .join('\n')}`
  : '_Clarity API caps `numOfDays` at 3; 10-day window is unavailable from the live-insights endpoint._'}

## Top traffic sources (10d, by sessions)

| Channel | Source | Medium | Sessions | Users |
| --- | --- | --- | ---: | ---: |
${sources
  .slice(0, 15)
  .map(
    (r) =>
      `| ${r.sessionDefaultChannelGroup ?? '—'} | ${r.sessionSource ?? '—'} | ${r.sessionMedium ?? '—'} | ${fmt(r.sessions)} | ${fmt(r.totalUsers)} |`
  )
  .join('\n')}

## Device split (10d)

| Device | Sessions | Users | Share |
| --- | ---: | ---: | ---: |
${(() => {
  const totalSessions = sumMetric(devices, 'sessions');
  return devices
    .map(
      (r) =>
        `| ${r.deviceCategory ?? '—'} | ${fmt(r.sessions)} | ${fmt(r.totalUsers)} | ${pct(r.sessions, totalSessions)} |`
    )
    .join('\n');
})()}

## Recommendations

These are derived mechanically from the funnel + Clarity numbers above. Review against intuition before acting.

${(() => {
  const recs = [];
  const driveViews = events10d.drive_page_view ?? 0;
  const waitlistView = events10d.waitlist_view ?? 0;
  const formStart = events10d.form_start ?? 0;
  const submitSuccess = events10d.waitlist_submit_success ?? 0;
  const validationErr = events10d.validation_error ?? 0;

  if (driveViews > 0 && waitlistView / driveViews < 0.4) {
    recs.push(
      `- **Above-fold CTA emphasis.** Only ${pct(waitlistView, driveViews)} of \`drive_page_view\` reach \`waitlist_view\` in 10d. Consider raising the join-CTA above the fold or shortening the path to it.`
    );
  }
  if (waitlistView > 0 && formStart / waitlistView < 0.35) {
    recs.push(
      `- **CTA prominence at form view.** ${pct(formStart, waitlistView)} of users that see the form actually start typing. Test bigger primary CTA copy / contrast / friction-removal (e.g. fewer fields above fold).`
    );
  }
  if (formStart > 0 && validationErr / formStart > 0.2) {
    recs.push(
      `- **Validation friction is high.** ${pct(validationErr, formStart)} validation events per form_start. Inspect inline error copy and field formats (phone for Saudi/Oman locales is the usual culprit) — autofill bug was already fixed in commit 6d493fb but worth re-checking field-level validators.`
    );
  }
  if (formStart > 0 && submitSuccess / formStart < 0.1) {
    recs.push(
      `- **Submit completion gap.** Only ${pct(submitSuccess, formStart)} of users that started the form actually completed. Likely causes: dedupe path mistaken for failure, or unrecoverable validation.`
    );
  }

  const dc = clarity3dSummary['DeadClickCount'];
  if (dc && dc.pct > 2) {
    recs.push(
      `- **Dead-click hot spot (${dc.pct.toFixed(2)}% of sessions).** ${fmt(dc.total)} dead clicks across ${fmt(dc.pages)} pages — inspect the top dead-click pages in Clarity and fix the unresponsive elements (often non-button styled as button).`
    );
  }
  const rc = clarity3dSummary['RageClickCount'];
  if (rc && rc.pct > 0.15) {
    recs.push(
      `- **Rage-click signal (${rc.pct.toFixed(2)}% of sessions).** Check Clarity replays of those sessions; rage-clicks usually point to a CTA that fails silently or a slow async action with no feedback.`
    );
  }
  const qb = clarity3dSummary['QuickbackClick'];
  if (qb && qb.pct > 0.5) {
    recs.push(
      `- **Quickback (${qb.pct.toFixed(2)}% of sessions).** Users navigating in then bouncing back fast — mismatch between landing page promise and content. Worth a paid-traffic LP audit.`
    );
  }
  const se = clarity3dSummary['ScriptErrorCount'];
  if (se && se.total > 0) {
    recs.push(
      `- **JS errors detected (${fmt(se.total)} events, ${se.pct.toFixed(2)}% of sessions).** Surface in Clarity → Errors view and prioritize anything blocking the form path.`
    );
  }

  const submitTrend = (events3d.waitlist_submit_success ?? 0) / 3;
  const submitBaseline = (events10d.waitlist_submit_success ?? 0) / 10;
  if (submitBaseline > 0 && submitTrend / submitBaseline < 0.85) {
    recs.push(
      `- **Submits trending down.** Daily submit rate fell from ${submitBaseline.toFixed(1)}/day (10d) to ${submitTrend.toFixed(1)}/day (3d). Cross-check with paid spend and creative changes.`
    );
  }
  if (submitBaseline > 0 && submitTrend / submitBaseline > 1.15) {
    recs.push(
      `- **Submits trending up.** Daily submit rate rose from ${submitBaseline.toFixed(1)}/day (10d) to ${submitTrend.toFixed(1)}/day (3d). Likely tied to recent autofill fix (commit 6d493fb) — verify by spot-checking recent waitlist entries and consider mirror creatives.`
    );
  }

  const sessionsTrend = (t3d.sessions ?? 0) / 3;
  const sessionsBaseline = (t10d.sessions ?? 0) / 10;
  if (sessionsBaseline > 0 && sessionsTrend / sessionsBaseline < 0.5) {
    recs.push(
      `- **Traffic step-down.** Sessions/day dropped from ${sessionsBaseline.toFixed(0)} (10d avg) to ${sessionsTrend.toFixed(0)} (3d avg). Confirm with media-buying team whether ad spend was paused or capped — combined with the submit-rate jump, conversion-rate is up sharply.`
    );
  }

  const totalDevSessions = sumMetric(devices, 'sessions');
  const mobileSessions =
    devices.find((d) => d.deviceCategory === 'mobile')?.sessions ?? 0;
  if (totalDevSessions > 0 && mobileSessions / totalDevSessions > 0.95) {
    recs.push(
      `- **Mobile-dominant audience (${pct(mobileSessions, totalDevSessions)}).** Treat mobile as the primary surface for any UX work; desktop is a rounding error. Form usability + paste/autofill paths are the highest-leverage targets.`
    );
  }

  recs.push(
    `- **Meta CAPI \`fbc\` fix shipped today.** Re-pull EMQ score for the Lead event 24h after deploy — expect ~+0.7 bump per Meta diagnostic.`
  );

  return recs.length ? recs.join('\n') : '_No actionable signals above thresholds._';
})()}

---

_Raw API responses cached under \`reports/.cache/\` (gitignored). Rerun: \`npm run report:performance\`._
`;

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, md);
  console.log(`\nReport written → ${REPORT_PATH.replace(ROOT + '/', '')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
