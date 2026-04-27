#!/usr/bin/env node
// Verifies new instrumentation events (field_blur + client_error) end-to-end:
//   1. Server-side: POST a synthetic field_blur event to /api/funnel and
//      confirm the schema accepts it (202 Accepted).
//   2. Server-side: same for client_error.
//   3. Browser-side: load /ar/projects/saheeb-drive, focus + blur the
//      email input, intercept network requests to /api/funnel, and
//      assert a field_blur event was sent with the right shape.
//   4. Browser-side: synthesize a window error and assert the
//      error capture forwards it as a client_error event.
//
// Read-only: never submits the waitlist form. The funnel events it
// posts are tagged with `qa-smoke` markers so they're easy to filter
// out of analytics later.
//
// Usage:
//   node scripts/qa-instrumentation-smoke.mjs
//   QA_BASE_URL=https://saheeb.com node scripts/qa-instrumentation-smoke.mjs

import { chromium, devices } from 'playwright';

const BASE = (process.env.QA_BASE_URL ?? 'https://saheeb.com').replace(/\/$/, '');
const RUN_ID = `qa-smoke-${Date.now()}`;
const IS_LOCAL = /^https?:\/\/(localhost|127\.|0\.0\.0\.0)/.test(BASE);

const results = [];
function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`);
}

async function main() {
  console.log(`QA target: ${BASE}`);
  console.log(`Run id: ${RUN_ID}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    locale: 'ar-SA',
  });

  // ---- TEST 1: server schema accepts field_blur ----
  console.log('TEST 1: POST /api/funnel { eventName: "field_blur" }');
  {
    const r = await context.request.post(`${BASE}/api/funnel`, {
      headers: {
        'Content-Type': 'application/json',
        Origin: BASE,
      },
      data: {
        eventName: 'field_blur',
        path: '/ar/projects/saheeb-drive',
        siteLocale: 'ar',
        formName: 'saheeb_drive_waitlist',
        pageVariant: 'organic_main',
        anonymousId: RUN_ID,
        sessionId: RUN_ID,
        payload: {
          form_name: 'saheeb_drive_waitlist',
          field_name: 'email',
          has_value: true,
          value_length: 12,
        },
      },
    });
    const body = await r.json().catch(() => ({}));
    record(
      '1a. status 202',
      r.status() === 202,
      `got ${r.status()} — body: ${JSON.stringify(body).slice(0, 120)}`
    );
    if (IS_LOCAL) {
      record(
        '1b. local DB write may fail without postgres — schema accept is enough',
        body.received === 1,
        `received=${body.received} accepted=${body.accepted}`
      );
    } else {
      record(
        '1b. accepted >= 1',
        body.accepted >= 1,
        `accepted=${body.accepted}`
      );
    }
  }

  // ---- TEST 2: server schema accepts client_error ----
  console.log('\nTEST 2: POST /api/funnel { eventName: "client_error" }');
  {
    const r = await context.request.post(`${BASE}/api/funnel`, {
      headers: {
        'Content-Type': 'application/json',
        Origin: BASE,
      },
      data: {
        eventName: 'client_error',
        path: '/ar/projects/saheeb-drive',
        siteLocale: 'ar',
        pageVariant: 'organic_main',
        errorStage: 'error',
        anonymousId: RUN_ID,
        sessionId: RUN_ID,
        payload: {
          message: 'qa-smoke synthetic error',
          source: 'qa-smoke',
          line: 1,
          column: 1,
          browser_app: 'chrome',
          error_stage: 'error',
        },
      },
    });
    const body = await r.json().catch(() => ({}));
    record(
      '2a. status 202',
      r.status() === 202,
      `got ${r.status()} — body: ${JSON.stringify(body).slice(0, 120)}`
    );
    if (IS_LOCAL) {
      record(
        '2b. local DB write may fail without postgres — schema accept is enough',
        body.received === 1,
        `received=${body.received} accepted=${body.accepted}`
      );
    } else {
      record(
        '2b. accepted >= 1',
        body.accepted >= 1,
        `accepted=${body.accepted}`
      );
    }
  }

  // ---- TEST 3: server REJECTS unknown eventName (regression guard) ----
  console.log('\nTEST 3: POST /api/funnel with unknown eventName must 400');
  {
    const r = await context.request.post(`${BASE}/api/funnel`, {
      headers: {
        'Content-Type': 'application/json',
        Origin: BASE,
      },
      data: {
        eventName: 'definitely_not_a_real_event_name_qa_smoke',
        path: '/ar/projects/saheeb-drive',
        siteLocale: 'ar',
      },
    });
    record('3a. status 400', r.status() === 400, `got ${r.status()}`);
  }

  // ---- TEST 4: browser fires field_blur on email blur ----
  console.log('\nTEST 4: browser fires field_blur on email blur');
  {
    const browserContext = await browser.newContext({
      ...devices['iPhone 13'],
      locale: 'ar-SA',
    });
    const page = await browserContext.newPage();

    const funnelRequests = [];
    page.on('request', (req) => {
      if (
        req.method() === 'POST' &&
        req.url().includes('/api/funnel')
      ) {
        try {
          const body = req.postDataJSON();
          const events = Array.isArray(body) ? body : [body];
          for (const e of events) {
            funnelRequests.push(e);
          }
        } catch {}
      }
    });

    await page.goto(`${BASE}/ar/projects/saheeb-drive`, {
      waitUntil: 'load',
    });

    // Scroll to the form (lazy mounting safety)
    const emailInput = page.locator('[data-testid="drive-waitlist-email"]');
    await emailInput.scrollIntoViewIfNeeded({ timeout: 8000 }).catch(() => {});
    await emailInput.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

    // Focus then blur
    await emailInput.focus();
    await emailInput.fill('qa-smoke@example.com');
    await page.locator('body').click({ position: { x: 5, y: 5 }, force: true });

    // Wait for the funnel queue flush (~350ms) plus a generous buffer
    await page.waitForTimeout(2500);

    const blurEvents = funnelRequests.filter(
      (e) => e.eventName === 'field_blur'
    );
    record(
      '4a. field_blur event was POSTed to /api/funnel',
      blurEvents.length >= 1,
      `blur events: ${blurEvents.length} of ${funnelRequests.length} total`
    );
    if (blurEvents.length >= 1) {
      const e = blurEvents.find(
        (b) => b.payload?.field_name === 'email'
      );
      record(
        '4b. payload.field_name = "email"',
        Boolean(e),
        e ? JSON.stringify(e.payload).slice(0, 120) : 'no email field_blur'
      );
      record(
        '4c. payload.has_value = true',
        e?.payload?.has_value === true,
        String(e?.payload?.has_value)
      );
      record(
        '4d. payload.value_length > 0',
        (e?.payload?.value_length ?? 0) > 0,
        String(e?.payload?.value_length)
      );
      record(
        '4e. NO raw value content in payload',
        e && !JSON.stringify(e.payload).includes('qa-smoke@example.com'),
        'value not leaked'
      );
    }

    await page.close();
    await browserContext.close();
  }

  // ---- TEST 5: browser captures synthesized window.onerror ----
  // The error listener only installs when canUseAnalyticsRuntime() is true,
  // which requires NODE_ENV=production AND hostname in PRODUCTION_HOSTS.
  // On localhost it never installs by design, so we skip this test there.
  if (IS_LOCAL) {
    console.log('\nTEST 5: SKIPPED on localhost (analytics gated to production hosts)');
  } else {
  console.log('\nTEST 5: browser forwards window.onerror as client_error');
  {
    const browserContext = await browser.newContext({
      ...devices['iPhone 13'],
      locale: 'ar-SA',
    });
    const page = await browserContext.newPage();

    const funnelRequests = [];
    page.on('request', (req) => {
      if (
        req.method() === 'POST' &&
        req.url().includes('/api/funnel')
      ) {
        try {
          const body = req.postDataJSON();
          const events = Array.isArray(body) ? body : [body];
          for (const e of events) {
            funnelRequests.push(e);
          }
        } catch {}
      }
    });

    await page.goto(`${BASE}/ar/projects/saheeb-drive`, {
      waitUntil: 'load',
    });

    // Wait for analytics provider to install the listeners.
    await page.waitForTimeout(800);

    // Synthesize an uncaught error.
    await page.evaluate(() => {
      window.dispatchEvent(
        new ErrorEvent('error', {
          message: 'qa-smoke synthetic browser error',
          filename: 'qa-smoke.js',
          lineno: 42,
          colno: 13,
        })
      );
    });

    await page.waitForTimeout(2500);

    const errEvents = funnelRequests.filter(
      (e) => e.eventName === 'client_error'
    );
    record(
      '5a. client_error event was POSTed to /api/funnel',
      errEvents.length >= 1,
      `client_error events: ${errEvents.length} of ${funnelRequests.length}`
    );
    if (errEvents.length >= 1) {
      const e = errEvents[0];
      record(
        '5b. payload.message contains synthetic marker',
        (e.payload?.message ?? '').includes('qa-smoke'),
        e.payload?.message
      );
      record(
        '5c. payload.browser_app present',
        typeof e.payload?.browser_app === 'string' && e.payload.browser_app.length > 0,
        String(e.payload?.browser_app)
      );
    }

    await page.close();
    await browserContext.close();
  }
  }

  // ---- TEST 6: third-party scripts loaded with crossorigin=anonymous ----
  // Without this, the browser strips error details from cross-origin scripts
  // (GA4, Meta pixel, Clarity), reporting them only as "Script error." with
  // no message/stack. Clarity reported 74 of 77 errors (96.10%) as
  // "Script error." on 2026-04-25–27 — this attribute is the fix.
  console.log('\nTEST 6: GA4/Meta/Clarity script tags load with crossorigin=anonymous');
  {
    const ctx = await browser.newContext({
      ...devices['iPhone 13'],
      locale: 'ar-SA',
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/ar/projects/saheeb-drive`, {
      waitUntil: 'load',
    });
    await page.waitForTimeout(2000);

    const scriptInfo = await page.evaluate(() => {
      const out = {};
      const all = Array.from(document.scripts);
      const find = (predicate) => all.find(predicate);
      const ga4 = find((s) =>
        (s.src || '').includes('googletagmanager.com/gtag/js')
      );
      const meta = find((s) =>
        (s.src || '').includes('connect.facebook.net') &&
        (s.src || '').includes('fbevents.js')
      );
      const clarity = find((s) => (s.src || '').includes('clarity.ms/tag/'));
      out.ga4 = ga4 ? { src: ga4.src.slice(0, 80), crossOrigin: ga4.crossOrigin } : null;
      out.meta = meta ? { src: meta.src.slice(0, 80), crossOrigin: meta.crossOrigin } : null;
      out.clarity = clarity ? { src: clarity.src.slice(0, 80), crossOrigin: clarity.crossOrigin } : null;
      return out;
    });

    const checkScript = (label, info) => {
      record(
        `6. ${label} script present`,
        Boolean(info),
        info ? info.src : 'NOT FOUND'
      );
      if (info) {
        record(
          `6. ${label} crossOrigin = anonymous`,
          info.crossOrigin === 'anonymous',
          `got "${info.crossOrigin}"`
        );
      }
    };
    if (IS_LOCAL) {
      console.log('   (skipped: third-party scripts only render on production hosts)');
    } else {
      checkScript('ga4', scriptInfo.ga4);
      checkScript('clarity', scriptInfo.clarity);

      // Meta pixel intentionally has NO crossOrigin attribute. Facebook's
      // CDN (connect.facebook.net) does not return Access-Control-Allow-Origin
      // on fbevents.js, so setting crossOrigin would CORS-block the script
      // and kill the pixel (no _fbp, no PageView). Verified 2026-04-27.
      record(
        '6. meta-pixel script present',
        Boolean(scriptInfo.meta),
        scriptInfo.meta ? scriptInfo.meta.src : 'NOT FOUND'
      );
      if (scriptInfo.meta) {
        record(
          '6. meta-pixel crossOrigin is NOT set (CORS would block)',
          !scriptInfo.meta.crossOrigin || scriptInfo.meta.crossOrigin === '',
          `crossOrigin="${scriptInfo.meta.crossOrigin}" — must be empty`
        );
      }
    }

    await page.close();
    await ctx.close();
  }

  await browser.close();

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log('\n========================================');
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('========================================\n');

  if (failed > 0) {
    console.log('Failed checks:');
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  - ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
    }
    process.exit(1);
  }
  console.log('All checks passed ✔');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
