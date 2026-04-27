#!/usr/bin/env node
// Playwright smoke for the Meta CAPI fbc/fbp deploy.
// Verifies, against the live production host:
//   1. /?fbclid=... causes the server to set _fbc=fb.1.<ms>.<fbclid>
//      with Secure + SameSite=Lax + 90d Max-Age (and HttpOnly=false so
//      the pixel can read it).
//   2. The same URL with a pre-existing _fbc cookie does NOT overwrite it.
//   3. /ar/projects/saheeb-drive (no fbclid) does NOT set _fbc.
//   4. The Meta pixel script loads, reads the server-set _fbc within the
//      first second of the page load (closing the original race), and
//      fbevents.js can find it via document.cookie.
//   5. The pixel _fbp cookie also gets written by Meta on first paint.
//   6. /api/waitlist/count is reachable (sanity check the API surface
//      didn't break in the deploy).
//
// Read-only: does NOT submit any waitlist entries.
//
// Usage:
//   node scripts/qa-fbc-deploy-smoke.mjs
//   QA_BASE_URL=https://saheeb.com node scripts/qa-fbc-deploy-smoke.mjs

import { chromium, devices } from 'playwright';

const BASE = (process.env.QA_BASE_URL ?? 'https://saheeb.com').replace(/\/$/, '');
const FBCLID_VALUE = `qa_smoke_${Date.now()}`;
const PRESET_FBC = `fb.1.1700000000.preset_must_not_overwrite`;

const results = [];
function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`);
}

function parseSetCookie(headers) {
  // Playwright responses() flattens multi-value Set-Cookie into a single
  // string joined by \n. Split it back.
  const raw = headers['set-cookie'] ?? '';
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function findCookieAttrs(setCookieLines, name) {
  for (const line of setCookieLines) {
    const [pair, ...attrParts] = line.split(';').map((p) => p.trim());
    const eq = pair.indexOf('=');
    if (eq < 0) continue;
    const cookieName = pair.slice(0, eq);
    const cookieValue = pair.slice(eq + 1);
    if (cookieName !== name) continue;
    const attrs = {};
    for (const attr of attrParts) {
      const idx = attr.indexOf('=');
      if (idx >= 0) {
        attrs[attr.slice(0, idx).toLowerCase()] = attr.slice(idx + 1);
      } else {
        attrs[attr.toLowerCase()] = true;
      }
    }
    return { value: cookieValue, attrs };
  }
  return null;
}

async function fetchSetCookie(context, url, extraHeaders = {}) {
  const response = await context.request.fetch(url, {
    method: 'GET',
    headers: extraHeaders,
    maxRedirects: 0,
  });
  const headers = response.headers();
  const setCookies = parseSetCookie(headers);
  return { status: response.status(), setCookies, headers };
}

async function main() {
  console.log(`QA target: ${BASE}`);
  console.log(`Test fbclid: ${FBCLID_VALUE}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    locale: 'ar-SA',
  });

  // ----- TEST 1: Server sets _fbc on first hit with fbclid -----
  console.log('TEST 1: server sets _fbc=fb.1.<ms>.<fbclid> with Secure+Lax+Max-Age=7776000');
  {
    const url = `${BASE}/ar/projects/saheeb-drive?fbclid=${FBCLID_VALUE}`;
    const { status, setCookies } = await fetchSetCookie(context, url);
    const fbc = findCookieAttrs(setCookies, '_fbc');
    record(
      '1a. status 200',
      status === 200,
      `got ${status}`
    );
    record(
      '1b. _fbc cookie set',
      Boolean(fbc),
      fbc ? fbc.value : `set-cookie: ${JSON.stringify(setCookies)}`
    );
    if (fbc) {
      const expectedPrefix = `fb.1.`;
      const expectedSuffix = `.${FBCLID_VALUE}`;
      record(
        '1c. _fbc value matches fb.1.<ms>.<fbclid>',
        fbc.value.startsWith(expectedPrefix) && fbc.value.endsWith(expectedSuffix),
        fbc.value
      );
      record(
        '1d. Max-Age = 90 days (7776000s)',
        fbc.attrs['max-age'] === '7776000',
        `got ${fbc.attrs['max-age']}`
      );
      record(
        '1e. SameSite=Lax',
        (fbc.attrs['samesite'] ?? '').toLowerCase() === 'lax',
        `got ${fbc.attrs['samesite']}`
      );
      record(
        '1f. Secure flag set',
        fbc.attrs['secure'] === true,
        fbc.attrs['secure'] ? 'yes' : 'missing'
      );
      record(
        '1g. HttpOnly NOT set (pixel must read via JS)',
        !fbc.attrs['httponly'],
        fbc.attrs['httponly'] ? 'unexpectedly set' : 'absent'
      );
      record(
        '1h. Path=/',
        fbc.attrs['path'] === '/',
        `got ${fbc.attrs['path']}`
      );
    }
  }

  // ----- TEST 2: Idempotent — does not overwrite existing _fbc -----
  console.log('\nTEST 2: existing _fbc is NOT overwritten');
  {
    const url = `${BASE}/ar/projects/saheeb-drive?fbclid=should_be_ignored_${Date.now()}`;
    const { status, setCookies } = await fetchSetCookie(context, url, {
      Cookie: `_fbc=${PRESET_FBC}`,
    });
    const fbc = findCookieAttrs(setCookies, '_fbc');
    record('2a. status 200', status === 200, `got ${status}`);
    record(
      '2b. server did NOT emit a new Set-Cookie for _fbc',
      fbc === null,
      fbc ? `unexpectedly emitted: ${fbc.value}` : 'absent (correct)'
    );
  }

  // ----- TEST 3: No fbclid → no _fbc cookie set -----
  console.log('\nTEST 3: no fbclid in URL → no _fbc set');
  {
    const url = `${BASE}/ar/projects/saheeb-drive`;
    const { status, setCookies } = await fetchSetCookie(context, url);
    const fbc = findCookieAttrs(setCookies, '_fbc');
    record('3a. status 200', status === 200, `got ${status}`);
    record(
      '3b. no _fbc Set-Cookie emitted',
      fbc === null,
      fbc ? `unexpectedly emitted: ${fbc.value}` : 'absent (correct)'
    );
  }

  // ----- TEST 4: Browser reads _fbc set by server, pixel sees it -----
  // Use a FRESH context so prior request-API cookies don't poison the run.
  console.log('\nTEST 4: browser sees server-set _fbc on first paint, pixel can read it');
  {
    const browserContext = await browser.newContext({
      ...devices['iPhone 13'],
      locale: 'ar-SA',
    });
    const page = await browserContext.newPage();
    const browserFbclid = `qa_browser_${Date.now()}`;
    const url = `${BASE}/ar/projects/saheeb-drive?fbclid=${browserFbclid}`;
    await page.goto(url, { waitUntil: 'load' });

    // Wait for the Meta pixel to finish initializing (it writes _fbp).
    await page
      .waitForFunction(
        () => typeof window.fbq === 'function' && Boolean(window.fbq.loaded),
        { timeout: 12000 }
      )
      .catch(() => {});
    // Pixel writes _fbp asynchronously after init — give it a beat.
    await page.waitForTimeout(1500);

    const cookies = await browserContext.cookies();
    const fbc = cookies.find((c) => c.name === '_fbc');
    const fbp = cookies.find((c) => c.name === '_fbp');

    record(
      '4a. _fbc cookie present in browser',
      Boolean(fbc),
      fbc ? fbc.value : `cookies: ${cookies.map((c) => c.name).join(',')}`
    );
    record(
      '4b. _fbc value contains the fbclid we sent',
      Boolean(fbc) && fbc.value.endsWith(`.${browserFbclid}`),
      fbc?.value
    );
    record(
      '4c. _fbp cookie written by pixel',
      Boolean(fbp),
      fbp ? fbp.value.slice(0, 40) + '…' : `cookies: ${cookies.map((c) => c.name).join(',')}`
    );

    // Pixel's own document.cookie read — confirms it can find _fbc.
    const pixelCanReadFbc = await page.evaluate(() => {
      return /(?:^|;\s*)_fbc=fb\.1\.\d+\./.test(document.cookie);
    });
    record(
      '4d. document.cookie exposes _fbc to pixel JS (HttpOnly not blocking)',
      pixelCanReadFbc,
      pixelCanReadFbc ? 'visible' : 'NOT visible'
    );

    // Make sure fbclid was stripped from the visible URL by attribution.ts
    const urlAfter = page.url();
    record(
      '4e. fbclid stripped from address bar after capture',
      !urlAfter.includes('fbclid='),
      urlAfter
    );

    await page.close();
    await browserContext.close();
  }

  // ----- TEST 5: API surface intact -----
  console.log('\nTEST 5: API surface unchanged');
  {
    const response = await context.request.get(`${BASE}/api/waitlist/count`);
    const status = response.status();
    record('5a. /api/waitlist/count returns 200', status === 200, `got ${status}`);
    if (status === 200) {
      const body = await response.json();
      record(
        '5b. response shape has a numeric count',
        typeof body?.count === 'number' || typeof body?.total === 'number',
        JSON.stringify(body).slice(0, 80)
      );
    }
  }

  // ----- TEST 6: Robots / homepage still serve -----
  console.log('\nTEST 6: smoke that nothing broke');
  {
    const r1 = await context.request.get(`${BASE}/robots.txt`);
    record('6a. /robots.txt 200', r1.status() === 200, `got ${r1.status()}`);
    const r2 = await context.request.get(`${BASE}/en/projects/saheeb-drive`);
    record('6b. /en/projects/saheeb-drive 200', r2.status() === 200, `got ${r2.status()}`);
    const r3 = await context.request.get(`${BASE}/ar/projects/saheeb-drive`);
    record('6c. /ar/projects/saheeb-drive 200', r3.status() === 200, `got ${r3.status()}`);
  }

  await browser.close();

  // ----- Summary -----
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
