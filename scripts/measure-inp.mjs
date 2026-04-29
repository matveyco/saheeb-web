#!/usr/bin/env node
// Measure INP-style interaction latency on the Saheeb Drive landing.
//
// Uses the Event Timing API + a wrapped click that records
// (event start) → (next-paint completion). This is the same model
// the browser uses to compute INP for Core Web Vitals.
//
// Each interaction is run N times, the slowest is reported (matches
// how INP is computed: 98th percentile, single worst interaction in
// real CrUX data).
//
// Usage:
//   node scripts/measure-inp.mjs
//   QA_BASE_URL=http://localhost:3333 node scripts/measure-inp.mjs

import { chromium, devices } from 'playwright';

const BASE = (process.env.QA_BASE_URL ?? 'http://localhost:3333').replace(
  /\/$/,
  ''
);
const RUNS = Number(process.env.RUNS ?? 5);

async function measureInteractions(page, label) {
  // Ensure event-timing observer is installed (and historical entries are buffered).
  await page.evaluate(() => {
    window.__interactionTimings = [];
    if (!window.__inpObserver) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__interactionTimings.push({
            name: entry.name,
            duration: Math.round(entry.duration),
            interactionId: entry.interactionId,
            processingStart: Math.round(entry.processingStart),
            processingEnd: Math.round(entry.processingEnd),
            startTime: Math.round(entry.startTime),
          });
        }
      });
      observer.observe({
        type: 'event',
        durationThreshold: 16,
        buffered: true,
      });
      window.__inpObserver = observer;
    }
  });

  // Generic per-interaction timing wrapper. Returns ms from
  // event dispatch to two RAFs after handlers run (the closest we
  // can get to "input delay + processing + presentation delay" in
  // a synthetic harness).
  async function timed(name, action) {
    const start = Date.now();
    const t = await page.evaluate(() => performance.now());
    await action();
    const after = await page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              resolve(performance.now());
            });
          });
        })
    );
    return { name, ms: Math.round(after - t), wall: Date.now() - start };
  }

  const results = [];

  // 1. Direct DRIVE_WAITLIST_EVENT dispatch — measures WaitlistForm's
  //    openWaitlist() response (the suspected scroll-cascade culprit).
  for (let i = 0; i < RUNS; i++) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    results.push(
      await timed(`open_waitlist_event_run${i + 1}`, async () => {
        await page.evaluate(() => {
          window.dispatchEvent(
            new CustomEvent('saheeb-drive-waitlist', {
              detail: { intent: 'buyer', source: 'measure_script' },
            })
          );
        });
      })
    );
  }

  // 2. Same as #1 but from far down the page — exercises a longer scroll
  //    distance, which is the realistic worst-case (sticky bar / inline CTA
  //    after FAQ).
  for (let i = 0; i < RUNS; i++) {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight - 200)
    );
    await page.waitForTimeout(300);
    results.push(
      await timed(`open_waitlist_from_bottom_run${i + 1}`, async () => {
        await page.evaluate(() => {
          window.dispatchEvent(
            new CustomEvent('saheeb-drive-waitlist', {
              detail: { intent: 'buyer', source: 'measure_script_bottom' },
            })
          );
        });
      })
    );
  }

  // 3. Email focus then blur (fires field_blur via our new instrumentation).
  for (let i = 0; i < RUNS; i++) {
    const email = page.locator('[data-testid="drive-waitlist-email"]');
    if ((await email.count()) === 0) continue;
    await email.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    results.push(
      await timed(`email_focus_run${i + 1}`, async () => {
        await email.focus();
      })
    );
    results.push(
      await timed(`email_blur_run${i + 1}`, async () => {
        await page.evaluate(
          () =>
            (
              document.querySelector(
                '[data-testid="drive-waitlist-email"]'
              )
            )?.blur()
        );
      })
    );
  }

  // 4. Sticky bar CTA (mobile only — usually absent on iPhone 13 viewport
  //    BEFORE scrolling past the hero, present after).
  for (let i = 0; i < RUNS; i++) {
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(400);
    const sticky = page.locator('[data-testid="drive-sticky-bar"] button');
    if ((await sticky.count()) === 0) {
      // sticky bar not visible — record a marker
      results.push({
        name: `sticky_cta_click_run${i + 1}`,
        ms: -1,
        wall: 0,
        note: 'sticky bar not present',
      });
      continue;
    }
    results.push(
      await timed(`sticky_cta_click_run${i + 1}`, async () => {
        await sticky.first().click({ force: true });
      })
    );
  }

  // Pull event-timing entries the browser actually recorded.
  const eventTimings = await page.evaluate(() => window.__interactionTimings);
  const realInteractions = eventTimings.filter(
    (e) =>
      e.interactionId &&
      ['click', 'pointerdown', 'pointerup', 'keydown', 'keyup'].includes(e.name)
  );
  const worstInteraction = realInteractions.reduce(
    (max, e) => (e.duration > (max?.duration ?? 0) ? e : max),
    null
  );

  console.log(`\n--- ${label} ---`);
  console.table(results);
  console.log(`\nReal browser-reported interaction events (Event Timing API):`);
  console.table(
    realInteractions.slice(-15).map((e) => ({
      name: e.name,
      duration_ms: e.duration,
      interactionId: e.interactionId,
    }))
  );
  console.log(
    `\nWorst real interaction: ${worstInteraction?.duration ?? 'n/a'}ms (${worstInteraction?.name ?? 'n/a'})`
  );
  console.log(
    `Median timed (synthetic): ${median(results.filter((r) => r.ms > 0).map((r) => r.ms))}ms`
  );
  console.log(
    `Max timed (synthetic): ${Math.max(...results.filter((r) => r.ms > 0).map((r) => r.ms))}ms`
  );
  return { results, worstInteraction };
}

function median(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

async function run() {
  console.log(`Target: ${BASE}/ar/projects/saheeb-drive`);
  console.log(`Runs per interaction: ${RUNS}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    locale: 'ar-SA',
  });
  const page = await context.newPage();

  // Throttle CPU 4x to mirror Lighthouse mobile defaults — closer to a
  // mid-range Android in a Facebook WebView (which is where most of our
  // real users are, per Clarity 2026-04-25..27 breakdown).
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(`${BASE}/ar/projects/saheeb-drive`, {
    waitUntil: 'load',
  });
  // Let hydration settle.
  await page.waitForTimeout(3000);

  await measureInteractions(page, 'AR landing — interaction latency');

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
