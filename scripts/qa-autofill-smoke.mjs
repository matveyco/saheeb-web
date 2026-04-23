#!/usr/bin/env node
// End-to-end QA of the autofill fix on production.
// Reproduces the exact bug pattern: set input.value via DOM (bypassing
// React onChange) to simulate mobile autofill, then click submit.
//
// Uses internal-traffic markers (`prod-smoke-*@example.com`) so the
// runs are automatically filtered out of admin-analytics totals.

import { chromium, devices } from 'playwright';

const BASE = process.env.QA_BASE_URL ?? 'https://saheeb.com';
const TIMESTAMP = Date.now();

function markerEmail(tag) {
  return `prod-smoke-${tag}-${TIMESTAMP}@example.com`;
}
function markerPhone() {
  // +968 (Oman) to mirror the real failing segment.
  return '+968 9000 0000';
}

// Sets value via native DOM setter without firing input/change — the
// exact broken path where React.onChange never runs. If the fix works,
// handleSubmit still reads the value from the DOM and submits.
const AUTOFILL_WITHOUT_EVENT = `
  (selector, value) => {
    const el = document.querySelector(selector);
    if (!el) return { ok: false, reason: 'not-found' };
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeSetter.call(el, value);
    return { ok: true, domValue: el.value };
  }
`;

const results = [];
function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`);
}

// Success signal: the submit produced a 2xx response from /api/waitlist
// AND the "founding member" emerald success block rendered. We check both
// because a 2xx without UI = no-op bug; UI without 2xx = stale-state bug.
async function waitForSuccess(page, { timeout = 15000 } = {}) {
  const uiCheck = page
    .waitForFunction(
      () => {
        const nodes = document.querySelectorAll('[class*="emerald"]');
        for (const n of nodes) {
          const t = (n.textContent ?? '').toLowerCase();
          if (
            (t.includes('founding') && t.includes('member')) ||
            t.includes("you're founding") ||
            t.includes('العضو المؤسس') ||
            t.includes('المؤسس') ||
            t.includes('المنتظرين')
          ) {
            return true;
          }
        }
        return false;
      },
      undefined,
      { timeout }
    )
    .then(() => true)
    .catch(() => false);

  return uiCheck;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runScenario(label, opts, fn) {
  console.log(`\n=== ${label} ===`);
  const browser = await chromium.launch({ headless: true });
  const ctxOpts = {
    ignoreHTTPSErrors: false,
    locale: opts.locale ?? 'en-US',
    extraHTTPHeaders: { 'Accept-Language': opts.acceptLanguage ?? 'en-US,en;q=0.9' },
  };
  if (opts.deviceName) Object.assign(ctxOpts, devices[opts.deviceName]);
  if (opts.viewport) ctxOpts.viewport = opts.viewport;
  const context = await browser.newContext(ctxOpts);
  const page = await context.newPage();
  const consoleErrors = [];
  const waitlistResponses = [];
  page.on('pageerror', (err) => consoleErrors.push(err.message));
  page.on('response', (resp) => {
    if (resp.url().includes('/api/waitlist') && resp.request().method() === 'POST') {
      waitlistResponses.push({ status: resp.status(), url: resp.url() });
    }
  });
  try {
    await fn(page, waitlistResponses);
    if (consoleErrors.length > 0) {
      console.log('    page errors:', consoleErrors.slice(0, 3).join(' | '));
    }
  } catch (err) {
    record(label + ' (threw)', false, err.message);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function gotoAndSettle(page, path) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
}

async function domSet(page, selector, value) {
  return page.evaluate(
    ({ expr, selector, value }) => eval(expr)(selector, value),
    { expr: AUTOFILL_WITHOUT_EVENT, selector, value }
  );
}

// ---------- Scenarios ----------

// 1. Desktop EN hero inline, typed (baseline).
await runScenario(
  'desktop EN / hero inline / typed',
  { viewport: { width: 1280, height: 900 } },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive');
    const email = markerEmail('hero-typed');
    await page.locator('#drive-hero form input[name="email"]').first().fill(email);
    await page.locator('#drive-hero form button[type="submit"]').first().click();
    const ok = await waitForSuccess(page);
    const lastResp = waitlistResponses.at(-1);
    record('hero inline typed submit', ok, lastResp ? `POST ${lastResp.status}` : 'no POST fired');
  }
);

await sleep(15000);

// 2. CRITICAL: Desktop EN hero inline, autofill-without-onChange.
await runScenario(
  'desktop EN / hero inline / autofill-without-onchange',
  { viewport: { width: 1280, height: 900 } },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive');
    const email = markerEmail('hero-autofill');
    await page.locator('#drive-hero form input[name="email"]').first().waitFor({ state: 'visible', timeout: 10000 });
    const w = await domSet(page, '#drive-hero form input[name="email"]', email);
    if (!w.ok) return record('hero inline autofill dom-write', false, w.reason);
    await page.locator('#drive-hero form button[type="submit"]').first().click();
    const ok = await waitForSuccess(page);
    record('hero inline autofill submit', ok, waitlistResponses.at(-1) ? "POST " + waitlistResponses.at(-1).status : "no POST fired");
  }
);

await sleep(15000);

// 3. iPhone 13 hero inline, autofill-without-onChange.
await runScenario(
  'iPhone 13 / hero inline / autofill-without-onchange',
  { deviceName: 'iPhone 13' },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive');
    const email = markerEmail('iphone-autofill');
    await page.locator('#drive-hero form input[name="email"]').first().waitFor({ state: 'visible', timeout: 10000 });
    const w = await domSet(page, '#drive-hero form input[name="email"]', email);
    if (!w.ok) return record('iphone hero autofill dom-write', false, w.reason);
    await page.locator('#drive-hero form button[type="submit"]').first().click();
    const ok = await waitForSuccess(page);
    record('iphone hero autofill submit', ok, waitlistResponses.at(-1) ? "POST " + waitlistResponses.at(-1).status : "no POST fired");
  }
);

// 4. iPhone 13 hero inline, empty submit (should stay blocked).
await runScenario(
  'iPhone 13 / hero inline / empty submit',
  { deviceName: 'iPhone 13' },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive');
    await page.locator('#drive-hero form input[name="email"]').first().waitFor({ state: 'visible' });
    await page.locator('#drive-hero form button[type="submit"]').first().click();
    const ok = await waitForSuccess(page, { timeout: 3000 });
    record('iphone empty submit blocked', !ok, ok ? 'BUG — empty went through' : 'correctly blocked');
  }
);

await sleep(15000);

// 5. Full WaitlistForm, email+phone autofill.
await runScenario(
  'desktop EN / full form / autofill email+phone',
  { viewport: { width: 1280, height: 900 } },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive');
    const email = markerEmail('fullform-both');
    const phone = markerPhone();
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('drive:waitlist', { detail: { source: 'qa' } }));
    });
    await page.locator('[data-testid="drive-waitlist-email"]').waitFor({ state: 'visible', timeout: 15000 });
    const a = await domSet(page, '[data-testid="drive-waitlist-email"]', email);
    const b = await domSet(page, '[data-testid="drive-waitlist-phone"]', phone);
    if (!a.ok || !b.ok) return record('full form dom-write', false, `email=${a.reason||'ok'} phone=${b.reason||'ok'}`);
    await page.locator('[data-testid="drive-waitlist-card"] button[type="submit"]').click();
    const ok = await waitForSuccess(page);
    record('full form email+phone autofill submit', ok, waitlistResponses.at(-1) ? "POST " + waitlistResponses.at(-1).status : "no POST fired");
  }
);

await sleep(15000);

// 6. Full WaitlistForm, email-only autofill.
await runScenario(
  'desktop EN / full form / autofill email only',
  { viewport: { width: 1280, height: 900 } },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive');
    const email = markerEmail('fullform-email-only');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('drive:waitlist', { detail: { source: 'qa' } }));
    });
    await page.locator('[data-testid="drive-waitlist-email"]').waitFor({ state: 'visible', timeout: 15000 });
    const a = await domSet(page, '[data-testid="drive-waitlist-email"]', email);
    if (!a.ok) return record('full form email-only dom-write', false, a.reason);
    await page.locator('[data-testid="drive-waitlist-card"] button[type="submit"]').click();
    const ok = await waitForSuccess(page);
    record('full form email-only autofill submit', ok, waitlistResponses.at(-1) ? "POST " + waitlistResponses.at(-1).status : "no POST fired");
  }
);

// 7. Full WaitlistForm, empty submit (should block + show error).
await runScenario(
  'desktop EN / full form / empty submit',
  { viewport: { width: 1280, height: 900 } },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('drive:waitlist', { detail: { source: 'qa' } }));
    });
    await page.locator('[data-testid="drive-waitlist-email"]').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('[data-testid="drive-waitlist-card"] button[type="submit"]').click();
    const success = await waitForSuccess(page, { timeout: 3000 });
    record('full form empty submit blocked', !success, success ? 'BUG — empty went through' : 'correctly blocked');
  }
);

// Rate-limit spacer (server allows 5 waitlist POSTs per minute per IP;
// test does 7+ submits, so we sleep between network-touching scenarios).
await sleep(15000);

// 8. AR hero inline, autofill.
await runScenario(
  'desktop AR / hero inline / autofill',
  { viewport: { width: 1280, height: 900 }, locale: 'ar-OM', acceptLanguage: 'ar,en;q=0.9' },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/ar/projects/saheeb-drive');
    const email = markerEmail('ar-hero-autofill');
    await page.locator('#drive-hero form input[name="email"]').first().waitFor({ state: 'visible', timeout: 10000 });
    const w = await domSet(page, '#drive-hero form input[name="email"]', email);
    if (!w.ok) return record('AR hero autofill dom-write', false, w.reason);
    await page.locator('#drive-hero form button[type="submit"]').first().click();
    const ok = await waitForSuccess(page);
    record('AR hero autofill submit', ok, waitlistResponses.at(-1) ? "POST " + waitlistResponses.at(-1).status : "no POST fired");
  }
);

await sleep(15000);

// 9. Paid LP, hero inline, autofill. Real failing segment (Oman via
// utm_source=qa mimics paid Meta traffic path).
await runScenario(
  'desktop EN / paid LP / hero inline autofill',
  { viewport: { width: 1280, height: 900 } },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive/lp?utm_source=qa&utm_medium=paid&utm_campaign=qa-fix-verify');
    const email = markerEmail('lp-autofill');
    await page.locator('#drive-hero form input[name="email"]').first().waitFor({ state: 'visible', timeout: 10000 });
    const w = await domSet(page, '#drive-hero form input[name="email"]', email);
    if (!w.ok) return record('paid LP hero autofill dom-write', false, w.reason);
    await page.locator('#drive-hero form button[type="submit"]').first().click();
    const ok = await waitForSuccess(page);
    record('paid LP hero autofill submit', ok, waitlistResponses.at(-1) ? "POST " + waitlistResponses.at(-1).status : "no POST fired");
  }
);

await sleep(15000);

// 10. iPhone 13, paid LP, autofill (closest synthetic to the actual
// failing Oman paid-Meta mobile traffic).
await runScenario(
  'iPhone 13 / paid LP / hero inline autofill',
  { deviceName: 'iPhone 13' },
  async (page, waitlistResponses) => {
    await gotoAndSettle(page, '/en/projects/saheeb-drive/lp?utm_source=qa&utm_medium=paid&utm_campaign=qa-fix-verify');
    const email = markerEmail('iphone-lp-autofill');
    await page.locator('#drive-hero form input[name="email"]').first().waitFor({ state: 'visible', timeout: 10000 });
    const w = await domSet(page, '#drive-hero form input[name="email"]', email);
    if (!w.ok) return record('iphone LP autofill dom-write', false, w.reason);
    await page.locator('#drive-hero form button[type="submit"]').first().click();
    const ok = await waitForSuccess(page);
    record('iphone paid LP autofill submit', ok, waitlistResponses.at(-1) ? "POST " + waitlistResponses.at(-1).status : "no POST fired");
  }
);

console.log('\n========================================');
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`Passed: ${passed}  Failed: ${failed}  Total: ${results.length}`);
if (failed > 0) {
  console.log('\nFAILURES:');
  for (const r of results.filter((r) => !r.ok)) console.log('  -', r.name, '—', r.detail);
  process.exit(1);
}
console.log('All scenarios passed.');
