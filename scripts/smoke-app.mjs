import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:5173';
const outDir = process.env.SMOKE_OUTPUT_DIR ?? '/private/tmp/xray_playwright_smoke';
const headless = process.env.SMOKE_HEADLESS !== '0';

const results = {
  baseUrl,
  outDir,
  steps: [],
  assertions: [],
  consoleErrors: [],
  pageErrors: [],
  failure: null,
};

function route(pathname) {
  return new URL(pathname, baseUrl).toString();
}

function step(name, details = {}) {
  results.steps.push({ name, ...details });
}

function assert(condition, message, details = {}) {
  const assertion = { ok: Boolean(condition), message, ...details };
  results.assertions.push(assertion);
  if (!condition) throw new Error(message);
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch (projectErr) {
    const bundledPath = path.join(
      process.env.HOME ?? '',
      '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs',
    );
    try {
      return await import(pathToFileURL(bundledPath).href);
    } catch (bundledErr) {
      throw new AggregateError(
        [projectErr, bundledErr],
        [
          'Playwright is not available. Install it in the project or run inside a Codex runtime with bundled Playwright.',
          `Project import: ${projectErr.message}`,
          `Bundled import: ${bundledErr.message}`,
        ].join('\n'),
        { cause: bundledErr },
      );
    }
  }
}

async function chooseFirstVisible(locator) {
  const count = await locator.count();
  assert(count > 0, 'Expected at least one matching control');
  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible()) {
      await candidate.click();
      return index;
    }
  }
  throw new Error('No visible candidate found');
}

async function answerBaseline(page) {
  await page.waitForURL(route('/quiz/pre'), { timeout: 10_000 });
  for (let index = 0; index < 7; index += 1) {
    await page.locator('article fieldset button').first().waitFor({ timeout: 10_000 });
    await chooseFirstVisible(page.locator('article fieldset button'));

    const next = page.getByRole('button', { name: 'Next question' });
    const submit = page.getByRole('button', { name: 'Submit quiz' });
    if (await next.isVisible().catch(() => false)) {
      await next.click();
    } else {
      await submit.click();
    }
  }

  await page.getByRole('button', { name: 'Continue to confidence rating' }).click();
  await page.waitForSelector('[role="radiogroup"]');

  const groups = page.locator('[role="radiogroup"]');
  const groupCount = await groups.count();
  assert(groupCount === 6, 'Expected six confidence domains', { groupCount });
  for (let index = 0; index < groupCount; index += 1) {
    await groups.nth(index).getByRole('radio', { name: /4/ }).click();
  }

  await page.getByRole('button', { name: 'Submit ratings' }).click();
  await page.locator('a[href="/modules/xray-foundations"]').click();
  await page.waitForURL(route('/modules/xray-foundations'), { timeout: 10_000 });
}

await fs.mkdir(outDir, { recursive: true });

let browser;
try {
  const { chromium } = await loadPlaywright();
  browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      results.consoleErrors.push({ type: msg.type(), text: msg.text() });
    }
  });
  page.on('pageerror', (err) => results.pageErrors.push(err.message));

  await page.goto(route('/'), { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(outDir, '01-login.png'), fullPage: true });
  assert(
    await page.getByRole('button', { name: 'Continue as guest' }).isVisible(),
    'Login page renders guest sign-in',
  );

  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await page.waitForURL(route('/welcome'), { timeout: 10_000 });
  step('guest-login', { url: page.url() });

  await page.getByRole('link', { name: 'Go to dashboard' }).click();
  await page.waitForURL(route('/dashboard'), { timeout: 10_000 });
  await page.screenshot({ path: path.join(outDir, '02-dashboard-before-baseline.png'), fullPage: true });
  const dashboardText = await page.locator('main').innerText();
  assert(dashboardText.includes('Cards due'), 'Dashboard shows cards due summary');
  assert(dashboardText.includes('Take the pre-course baseline'), 'Dashboard prompts baseline before modules');
  step('dashboard-before-baseline', { url: page.url() });

  await page.goto(route('/modules/xray-foundations'), { waitUntil: 'domcontentloaded' });
  await page.waitForURL(route('/quiz/pre'), { timeout: 10_000 });
  assert(page.url().endsWith('/quiz/pre'), 'Module route redirects to baseline when prerequisite missing', {
    url: page.url(),
  });
  step('baseline-gate', { url: page.url() });

  await answerBaseline(page);
  await page.locator('h1', { hasText: 'X-Ray Foundations' }).waitFor({ timeout: 10_000 });
  await page.screenshot({ path: path.join(outDir, '03-module-foundations.png'), fullPage: true });
  const moduleText = await page.locator('main').innerText();
  assert(
    moduleText.includes('X-Ray Foundations') || moduleText.includes('Systematic X-Ray Read'),
    'Foundations module renders after baseline',
  );
  step('module-unlocked', { url: page.url() });

  await page.goto(route('/flashcards'), { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(outDir, '04-flashcards.png'), fullPage: true });
  const flashText = await page.locator('main').innerText();
  assert(flashText.includes('Flashcards'), 'Flashcards page renders');
  assert(flashText.includes('due') || flashText.includes('Due'), 'Flashcards page shows due/review state');
  step('flashcards', { url: page.url() });

  await page.goto(route('/videos'), { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(outDir, '05-videos.png'), fullPage: true });
  assert(await page.getByText('Supplemental AMSSM Video').first().isVisible(), 'Videos page renders AMSSM cards');
  step('videos', { url: page.url() });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route('/dashboard'), { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(outDir, '06-dashboard-mobile.png'), fullPage: true });
  const mobileText = await page.locator('main').innerText();
  assert(mobileText.includes('Sports Medicine X-Ray Academy'), 'Mobile dashboard renders main heading');
  step('mobile-dashboard', { url: page.url() });

  const noisyConsole = results.consoleErrors.filter((entry) => {
    const text = entry.text.toLowerCase();
    return !text.includes('vite') && !text.includes('firebase') && !text.includes('favicon');
  });
  assert(results.pageErrors.length === 0, 'No browser page errors', { pageErrors: results.pageErrors });
  assert(noisyConsole.length === 0, 'No relevant browser console errors/warnings', {
    consoleErrors: noisyConsole,
  });
} catch (err) {
  results.failure = err instanceof Error ? err.message : String(err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  console.log(JSON.stringify(results, null, 2));
}
