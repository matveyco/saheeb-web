import assert from 'node:assert/strict';
import { chromium, devices, webkit } from 'playwright';

const BASE_URL = (process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3333').replace(
  /\/$/,
  ''
);

const MOBILE_VIEWPORTS = [
  { width: 320, height: 568, label: '320x568' },
  { width: 375, height: 812, label: '375x812' },
  { width: 390, height: 844, label: '390x844' },
  { width: 430, height: 932, label: '430x932' },
];

async function gotoPath(page, path) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForFunction(
    () => {
      const bodyStyles = window.getComputedStyle(document.body);
      const cta = document.querySelector('[data-testid="drive-hero-primary-cta"]');
      if (!cta) {
        return false;
      }

      const ctaStyles = window.getComputedStyle(cta);
      return (
        bodyStyles.backgroundColor === 'rgb(9, 9, 11)' &&
        ctaStyles.backgroundColor === 'rgb(201, 168, 124)'
      );
    },
    undefined,
    { timeout: 15000 }
  );
}

async function assertVisibleAboveFold(page, testId, label) {
  const locator = page.getByTestId(testId);
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();

  assert(box, `${label} should be visible`);
  assert(viewport, 'Viewport should be available');
  assert(
    box.y + box.height <= viewport.height,
    `${label} should fit above the fold (bottom=${box.y + box.height}, viewport=${viewport.height})`
  );
}

async function assertWaitlistFlow(page, path, intent) {
  await gotoPath(page, path);
  await assertVisibleAboveFold(page, 'drive-hero-primary-cta', `${path} hero CTA`);
  await page.waitForTimeout(600);

  await page.getByTestId('drive-hero-primary-cta').click();
  await page.getByTestId('drive-waitlist-title').waitFor({
    state: 'visible',
    timeout: 10000,
  });
  await page.waitForTimeout(500);

  const viewport = page.viewportSize();
  const titleBox = await page.getByTestId('drive-waitlist-title').boundingBox();
  const inputBox = await page.getByTestId('drive-waitlist-name').boundingBox();
  const sticky = page.getByTestId('drive-sticky-bar');
  const intentToggle = page.getByTestId(
    intent === 'seller' ? 'drive-form-intent-seller' : 'drive-form-intent-buyer'
  );
  const passivePrivacy = page.getByTestId('drive-waitlist-passive-privacy');
  const socialProof = page.getByTestId('drive-waitlist-social-proof');

  assert(viewport, 'Viewport should be available');
  assert(titleBox, 'Waitlist title should be visible');
  assert(inputBox, 'Waitlist name input should be visible');
  assert(
    titleBox.y >= 0 && titleBox.y < viewport.height * 0.6,
    `${path} waitlist title should land in a readable viewport position (titleY=${titleBox.y}, viewport=${viewport.height})`
  );
  assert(
    inputBox.y >= 0 && inputBox.y + inputBox.height <= viewport.height,
    `${path} first input should be fully visible after CTA click (inputY=${inputBox.y}, inputBottom=${inputBox.y + inputBox.height}, viewport=${viewport.height})`
  );
  assert.equal(
    await intentToggle.getAttribute('aria-pressed'),
    'true',
    `${path} should preserve ${intent} intent into the form`
  );
  assert.equal(
    await sticky.isVisible().catch(() => false),
    false,
    `${path} sticky bar should hide while the waitlist is in view`
  );
  assert.equal(
    await page.locator('input[name="consent"]').count(),
    0,
    `${path} should not render a blocking consent checkbox`
  );
  assert.equal(
    await passivePrivacy.isVisible().catch(() => false),
    true,
    `${path} should show the passive privacy line`
  );
  assert.equal(
    await socialProof.isVisible().catch(() => false),
    true,
    `${path} should show the social proof badge`
  );

  const bannerText = page.getByText(/Allow optional analytics cookies|Accept cookies/);
  const cookieSettings = page.getByText(/Cookie Settings|إعدادات ملفات تعريف الارتباط/);
  assert.equal(
    await bannerText.isVisible().catch(() => false),
    false,
    `${path} should not show the old analytics consent banner`
  );
  assert.equal(
    await cookieSettings.isVisible().catch(() => false),
    false,
    `${path} should not show cookie settings controls`
  );
}

async function assertPaidShell(page, path) {
  await gotoPath(page, path);

  await page.getByTestId('drive-paid-header').waitFor({
    state: 'visible',
    timeout: 10000,
  });

  const navExits = page.locator(
    'a[href$="/services"], a[href$="/projects"], a[href$="/contact"]'
  );
  assert.equal(
    await navExits.count(),
    0,
    `${path} paid LP should not expose main navigation exits`
  );
  assert.equal(
    await page
      .getByRole('button', { name: /English|العربية|Switch to English|التبديل/ })
      .count(),
    0,
    `${path} paid LP should not show a language switcher`
  );
}

async function assertLegacyRedirect(page) {
  await page.goto(
    `${BASE_URL}/en/projects/saheeb-drive/waitlist?intent=seller`,
    { waitUntil: 'domcontentloaded' }
  );
  await page.waitForLoadState('networkidle').catch(() => {});

  const redirectedUrl = new URL(page.url());
  assert.equal(
    redirectedUrl.pathname,
    '/en/projects/saheeb-drive',
    'Legacy waitlist URL should redirect to the main Drive page'
  );
  assert.equal(
    redirectedUrl.searchParams.get('focus'),
    'waitlist',
    'Legacy waitlist redirect should preserve waitlist focus'
  );
  assert.equal(
    redirectedUrl.searchParams.get('intent'),
    'seller',
    'Legacy waitlist redirect should preserve intent'
  );
  assert.equal(
    redirectedUrl.hash,
    '#drive-waitlist',
    'Legacy waitlist redirect should preserve the waitlist anchor'
  );
}

async function main() {
  const preferredBrowser = process.env.PLAYWRIGHT_BROWSER?.toLowerCase();
  const browserFactories = [
    { label: 'chromium', factory: chromium },
    { label: 'webkit', factory: webkit },
  ];
  if (preferredBrowser) {
    browserFactories.sort((left, right) => {
      if (left.label === preferredBrowser) {
        return -1;
      }

      if (right.label === preferredBrowser) {
        return 1;
      }

      return 0;
    });
  }
  let browser = null;
  const baseDevice = devices['iPhone 12'];

  try {
    for (const candidate of browserFactories) {
      try {
        browser = await candidate.factory.launch({ headless: true });
        console.log(`Using ${candidate.label} for mobile smoke checks`);
        break;
      } catch (error) {
        console.warn(`Failed to launch ${candidate.label}:`, error.message);
      }
    }

    assert(browser, 'Unable to launch a Playwright browser for smoke testing');

    for (const viewport of MOBILE_VIEWPORTS) {
      const context = await browser.newContext({
        ...baseDevice,
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      });
      const page = await context.newPage();

      await assertWaitlistFlow(
        page,
        '/en/projects/saheeb-drive',
        'buyer'
      );
      await assertWaitlistFlow(
        page,
        '/ar/projects/saheeb-drive',
        'buyer'
      );

      await context.close();
      console.log(`Verified mobile CTA + form flow on ${viewport.label}`);
    }

    const paidContext = await browser.newContext({
      ...baseDevice,
      viewport: {
        width: 390,
        height: 844,
      },
    });
    const paidPage = await paidContext.newPage();

    await assertPaidShell(paidPage, '/en/projects/saheeb-drive/lp?intent=buyer');
    await assertWaitlistFlow(
      paidPage,
      '/en/projects/saheeb-drive/lp?intent=buyer',
      'buyer'
    );
    await assertPaidShell(paidPage, '/en/projects/saheeb-drive/lp?intent=seller');
    await assertWaitlistFlow(
      paidPage,
      '/en/projects/saheeb-drive/lp?intent=seller',
      'seller'
    );
    await assertPaidShell(paidPage, '/ar/projects/saheeb-drive/lp?intent=buyer');
    await assertWaitlistFlow(
      paidPage,
      '/ar/projects/saheeb-drive/lp?intent=buyer',
      'buyer'
    );
    await assertLegacyRedirect(paidPage);

    await paidContext.close();
    console.log(`Verified paid LP shell + redirect checks against ${BASE_URL}`);
  } finally {
    await browser?.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
