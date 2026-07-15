import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:5173';
const outDir = process.env.SMOKE_OUTPUT_DIR ?? '/private/tmp/xray_playwright_smoke';
const headless = process.env.SMOKE_HEADLESS !== '0';
const expectPwa = process.env.SMOKE_EXPECT_PWA === '1';

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

async function clickOnceWhenEnabled(page, locator) {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  const button = await locator.elementHandle();
  if (!button) throw new Error('Expected an enabled transition button');
  await page.waitForFunction(
    (element) => element.isConnected && !element.matches(':disabled'),
    button,
    { timeout: 10_000 },
  );
  await button.evaluate((element) => element.click());
}

async function assertMinTouchTarget(locator, label) {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  const box = await locator.boundingBox();
  assert(
    Boolean(box && box.width >= 44 && box.height >= 44),
    `${label} keeps a 44px mobile touch target`,
    { box },
  );
}

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: globalThis.innerWidth,
    document: globalThis.document.documentElement.scrollWidth,
  }));
  assert(
    dimensions.document <= dimensions.viewport + 1,
    `${label} has no horizontal overflow`,
    dimensions,
  );
}

async function answerBaseline(page) {
  await page.waitForURL(route('/quiz/pre'), { timeout: 10_000 });
  for (let index = 0; index < 7; index += 1) {
    await page
      .getByText(`Question ${index + 1} of 7`, { exact: true })
      .first()
      .waitFor({ timeout: 10_000 });
    await page.locator('article fieldset button').first().waitFor({ timeout: 10_000 });
    await chooseFirstVisible(page.locator('article fieldset button'));

    if (index < 6) {
      await clickOnceWhenEnabled(
        page,
        page.getByRole('button', { name: 'Next question' }),
      );
      await page
        .getByText(`Question ${index + 2} of 7`, { exact: true })
        .first()
        .waitFor({ timeout: 10_000 });
    } else {
      await clickOnceWhenEnabled(
        page,
        page.getByRole('button', { name: 'Submit quiz' }),
      );
    }
  }

  await page.getByRole('button', { name: 'Continue to confidence rating' }).waitFor();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Submit ratings' }).waitFor({ timeout: 10_000 });
  assert(
    await page.getByRole('button', { name: 'Submit quiz' }).count() === 0,
    'Interrupted course baseline resumes at confidence without permitting a quiz retake',
  );
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

async function answerModuleEntryCheck(page) {
  await page.getByText('Module entry check').waitFor({ timeout: 10_000 });
  for (let index = 0; index < 3; index += 1) {
    await page
      .getByText(`Question ${index + 1} of 3`, { exact: true })
      .first()
      .waitFor({ timeout: 10_000 });
    const question = page.locator('article fieldset').first();
    await question.waitFor({ timeout: 10_000 });
    await chooseFirstVisible(question.locator('button'));

    if (index < 2) {
      await clickOnceWhenEnabled(
        page,
        page.getByRole('button', { name: 'Next question' }),
      );
      await page
        .getByText(`Question ${index + 2} of 3`, { exact: true })
        .first()
        .waitFor({ timeout: 10_000 });
    } else {
      await clickOnceWhenEnabled(
        page,
        page.getByRole('button', { name: 'Submit answers' }),
      );
    }
  }

  await page.getByRole('button', { name: 'Continue to confidence' }).waitFor();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Save and continue' }).waitFor({ timeout: 10_000 });
  assert(
    await page.getByRole('button', { name: 'Submit answers' }).count() === 0,
    'Interrupted module check resumes at confidence without permitting a quiz retake',
  );
  await page.getByRole('radio', { name: /4/ }).click();
  await page.getByRole('button', { name: 'Save and continue' }).click();
  await page.getByRole('heading', { name: 'How to read it' }).waitFor({ timeout: 10_000 });
}

async function assertPwaMetadata(page) {
  const manifestResponse = await page.request.get(route('/site.webmanifest'));
  assert(manifestResponse.ok(), 'Web app manifest is reachable', {
    status: manifestResponse.status(),
  });
  const manifest = await manifestResponse.json();
  const iconSizes = new Set(
    (manifest.icons ?? []).flatMap((icon) => String(icon.sizes ?? '').split(/\s+/)),
  );
  assert(manifest.display === 'standalone', 'Manifest uses standalone display mode');
  assert(manifest.orientation === 'any', 'Manifest supports phone and tablet orientation');
  assert(manifest.start_url?.includes('/dashboard'), 'Manifest launches to dashboard', {
    startUrl: manifest.start_url,
  });
  assert(iconSizes.has('192x192') && iconSizes.has('512x512'), 'Manifest includes 192 and 512 PNG icons', {
    iconSizes: [...iconSizes],
  });
  assert(
    (manifest.icons ?? []).some((icon) => String(icon.purpose ?? '').includes('maskable')),
    'Manifest includes a maskable icon',
  );

  const serviceWorkerResponse = await page.request.get(route('/sw.js'));
  assert(serviceWorkerResponse.ok(), 'Service worker script is reachable', {
    status: serviceWorkerResponse.status(),
  });
  step('pwa-metadata', {
    display: manifest.display,
    startUrl: manifest.start_url,
    icons: [...iconSizes],
  });
}

async function assertPwaOfflineLaunch(page, context) {
  const registration = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return { supported: false };
    const ready = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('service worker ready timeout')), 10_000)),
    ]);
    return {
      supported: true,
      active: Boolean(ready.active),
      scope: ready.scope,
    };
  });
  assert(registration.supported && registration.active, 'Service worker activates for PWA mode', {
    registration,
  });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await context.setOffline(true);
  await page.goto(route('/dashboard'), { waitUntil: 'domcontentloaded' });
  await page.locator('main h1').waitFor({ timeout: 10_000 });
  await page.getByText('Offline mode').waitFor({ timeout: 10_000 });
  await page.screenshot({ path: path.join(outDir, '07-dashboard-offline.png'), fullPage: true });
  const offlineText = await page.locator('main').innerText();
  assert(
    offlineText.includes('Take the pre-course baseline') || offlineText.includes('Resume') || offlineText.includes('Start'),
    'Offline dashboard renders app shell content',
  );
  assert(await page.getByText('Offline mode').isVisible(), 'Offline banner is visible');
  await context.setOffline(false);
  step('offline-dashboard', { url: page.url() });
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

  await assertPwaMetadata(page);

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

  await page.goto(route('/cases'), { waitUntil: 'domcontentloaded' });
  await page.waitForURL(route('/quiz/pre'), { timeout: 10_000 });
  assert(page.url().endsWith('/quiz/pre'), 'Case library cannot bypass the course baseline');

  await page.goto(route('/quiz/post'), { waitUntil: 'domcontentloaded' });
  await page.waitForURL(route('/quiz/pre'), { timeout: 10_000 });
  assert(page.url().endsWith('/quiz/pre'), 'Post-course assessment cannot bypass the baseline');

  await answerBaseline(page);
  await page.locator('h1', { hasText: 'X-Ray Foundations' }).waitFor({ timeout: 10_000 });
  await page.screenshot({ path: path.join(outDir, '03-module-foundations.png'), fullPage: true });
  const moduleText = await page.locator('main').innerText();
  assert(
    moduleText.includes('X-Ray Foundations') && moduleText.toLowerCase().includes('module entry check'),
    'Foundations module opens at its required entry check',
  );
  step('module-entry-check', { url: page.url() });

  await page.goto(route('/quiz/pre'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Assessment already saved' }).waitFor({ timeout: 10_000 });
  assert(
    await page.getByRole('button', { name: 'Submit quiz' }).count() === 0,
    'Completed course baseline is immutable and does not expose a retake',
  );

  await page.goto(route('/quiz/post'), { waitUntil: 'domcontentloaded' });
  await page.waitForURL(route('/dashboard'), { timeout: 10_000 });
  assert(page.url().endsWith('/dashboard'), 'Post-course assessment remains locked until modules are complete');

  await page.goto(route('/modules/xray-foundations'), { waitUntil: 'domcontentloaded' });
  await answerModuleEntryCheck(page);
  const diagram = page.locator('img[src*="/diagrams/"]').first();
  await diagram.scrollIntoViewIfNeeded();
  assert(await diagram.isVisible(), 'A real teaching diagram renders after the module entry check');
  await page.waitForFunction(() => {
    const image = globalThis.document.querySelector('img[src*="/diagrams/"]');
    return image?.tagName === 'IMG' && image.complete && image.naturalWidth > 0;
  }, undefined, { timeout: 10_000 });
  const diagramLoaded = await diagram.evaluate(
    (image) => image.tagName === 'IMG' && image.naturalWidth > 0,
  );
  assert(diagramLoaded, 'Teaching diagram asset loads with nonzero width');
  const finishGate = page.locator('#finish');
  await finishGate.scrollIntoViewIfNeeded();
  assert(
    (await finishGate.innerText()).includes('Finish Learn, Views, Images, Practice, Quiz first.'),
    'Post-module check names the unfinished required phases',
  );
  assert(
    await finishGate.getByRole('button', { name: 'Not ready' }).isDisabled(),
    'Post-module check cannot complete the module before required activities',
  );

  const caseCard = page
    .getByRole('heading', { name: 'Snowboarder with persistent wrist pain' })
    .locator('xpath=ancestor::article[1]');
  assert(
    await caseCard.getByText('Management commitment').count() === 0,
    'Management cases use the authored best-next-step answer without a duplicate management prompt',
  );
  assert(
    await caseCard.getByText('Teaching radiograph').count() === 0 &&
      await caseCard.locator('img').count() === 0,
    'Contradictory teaching radiograph stays hidden before the case commitment',
  );
  await caseCard
    .getByRole('button', { name: 'Thumb spica splint, repeat radiographs in 10–14 days or MRI' })
    .click();
  await caseCard.getByRole('radio', { name: /4/ }).click();
  await caseCard.getByRole('button', { name: 'Submit answer' }).click();
  await caseCard.getByText('Teaching radiograph').waitFor();
  assert(
    await caseCard.locator('img').count() > 0,
    'Teaching radiograph reveals only after the case commitment',
  );

  const formativeQuestion = page
    .getByRole('heading', {
      name: 'Which step of the Systematic X-Ray Read is most likely to catch a posterior shoulder dislocation?',
    })
    .locator('xpath=ancestor::article[1]');
  const revealExplanation = formativeQuestion.getByRole('button', { name: 'Show explanation' });
  assert(await revealExplanation.isDisabled(), 'Formative explanation is locked until an answer is chosen');
  await formativeQuestion.locator('fieldset button').first().click();
  assert(await revealExplanation.isEnabled(), 'Formative explanation unlocks after a committed answer');
  await revealExplanation.click();
  assert(
    await formativeQuestion.locator('fieldset button:enabled').count() === 0,
    'Formative answer choices lock after explanation reveal',
  );
  await page.screenshot({ path: path.join(outDir, '03b-module-unlocked.png'), fullPage: true });
  step('module-unlocked', { url: page.url() });

  await page.goto(route('/flashcards'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Flashcards' }).waitFor({ timeout: 10_000 });
  await page.screenshot({ path: path.join(outDir, '04-flashcards.png'), fullPage: true });
  const flashText = await page.locator('main').innerText();
  assert(flashText.includes('Flashcards'), 'Flashcards page renders');
  assert(flashText.includes('due') || flashText.includes('Due'), 'Flashcards page shows due/review state');
  step('flashcards', { url: page.url() });

  await page.goto(route('/videos'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'AMSSM video library' }).waitFor({ timeout: 10_000 });
  await page.getByText('Supplemental AMSSM Video').first().waitFor({ timeout: 10_000 });
  await page.screenshot({ path: path.join(outDir, '05-videos.png'), fullPage: true });
  assert(await page.getByText('Supplemental AMSSM Video').first().isVisible(), 'Videos page renders AMSSM cards');
  step('videos', { url: page.url() });

  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(route('/modules/xray-foundations'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'How to read it' }).waitFor({ timeout: 10_000 });
  await assertNoHorizontalOverflow(page, 'Mobile module');
  await page.screenshot({ path: path.join(outDir, '05b-module-mobile.png'), fullPage: true });
  await page.evaluate(() => globalThis.scrollTo(0, 1800));
  await page.getByRole('link', { name: 'Cards', exact: true }).click();
  await page.waitForURL(route('/flashcards'), { timeout: 10_000 });
  await page.waitForFunction(() => globalThis.scrollY === 0);
  assert(await page.evaluate(() => globalThis.scrollY === 0), 'Primary navigation resets route scroll position');
  await assertNoHorizontalOverflow(page, 'Mobile flashcards');
  await assertMinTouchTarget(page.getByRole('button', { name: 'Skip' }), 'Flashcard skip');
  await assertMinTouchTarget(
    page.locator('summary').filter({ hasText: 'Choose deck and study mode' }),
    'Flashcard deck disclosure',
  );

  await page.goto(route('/modules'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Modules', exact: true }).waitFor({ timeout: 10_000 });
  await assertNoHorizontalOverflow(page, 'Mobile module catalog');
  await assertMinTouchTarget(page.getByRole('button', { name: 'All', exact: true }), 'Module filter');
  await assertMinTouchTarget(page.getByRole('link', { name: 'Cheat sheet' }).first(), 'Module cheat sheet');
  await assertMinTouchTarget(page.getByRole('button', { name: 'Save' }).first(), 'Module save');

  await page.goto(route('/videos'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'AMSSM video library' }).waitFor({ timeout: 10_000 });
  await assertNoHorizontalOverflow(page, 'Mobile video library');
  await assertMinTouchTarget(
    page.locator('summary').filter({ hasText: 'Reflection prompt' }).first(),
    'Video reflection disclosure',
  );

  await page.goto(route('/atlas'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Image atlas' }).waitFor({ timeout: 10_000 });
  await assertNoHorizontalOverflow(page, 'Mobile image atlas');
  await assertMinTouchTarget(page.getByRole('button', { name: /^All \(\d+\)$/ }), 'Atlas filter');
  await assertMinTouchTarget(page.getByRole('button', { name: 'Random' }), 'Atlas random');
  await page.getByRole('button', { name: 'Key clue' }).click();
  await page.getByText('0/0 correct · 0 revealed · streak 0').waitFor();
  await page.getByRole('button', { name: 'Reveal clue' }).click();
  assert(
    await page.getByText('0/0 correct · 1 revealed · streak 0').isVisible(),
    'Atlas clue reveal is tracked separately and does not inflate answered, accuracy, or streak',
  );

  await page.goto(route('/cases'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Sports medicine case practice' }).waitFor({ timeout: 10_000 });
  await assertNoHorizontalOverflow(page, 'Mobile case practice');

  await page.goto(route('/cheatsheets'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Cheat sheets' }).waitFor({ timeout: 10_000 });
  await assertNoHorizontalOverflow(page, 'Mobile cheat sheets');

  await page.goto(route('/progress'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Progress dashboard' }).waitFor({ timeout: 10_000 });
  await assertNoHorizontalOverflow(page, 'Mobile progress dashboard');

  await page.goto(route('/quiz/pre'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Assessment already saved' }).waitFor({ timeout: 10_000 });
  await assertNoHorizontalOverflow(page, 'Mobile saved assessment');

  await page.goto(route('/dashboard'), { waitUntil: 'domcontentloaded' });
  await page.locator('main h1').waitFor({ timeout: 10_000 });
  await page.screenshot({ path: path.join(outDir, '06-dashboard-mobile.png'), fullPage: true });
  const mobileText = await page.locator('main').innerText();
  assert(
    mobileText.includes('Sports Medicine MSK X-Ray Academy'),
    'Mobile dashboard renders the academy brand heading',
  );
  assert(
    await page.getByRole('heading', { level: 2, name: /X-Ray Foundations/ }).isVisible(),
    'Mobile dashboard keeps the next learning action directly below the brand',
  );
  await assertNoHorizontalOverflow(page, 'Mobile dashboard');
  step('mobile-dashboard', { url: page.url() });

  if (expectPwa) {
    await assertPwaOfflineLaunch(page, context);
  }

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
