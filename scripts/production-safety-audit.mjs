import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const issues = [];

function addIssue(severity, area, id, message) {
  issues.push({ severity, area, id, message });
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

function fileExists(relOrPublicUrl) {
  const rel = relOrPublicUrl.startsWith('/') ? relOrPublicUrl.slice(1) : relOrPublicUrl;
  return fs.existsSync(path.join(root, 'public', rel));
}

function readText(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function cacheHeader(hosting, source) {
  const entry = hosting.headers?.find((item) => item.source === source);
  const header = entry?.headers?.find(
    (item) => item.key.toLowerCase() === 'cache-control',
  );
  return header?.value ?? null;
}

function assertNoCache(hosting, source, target) {
  const value = cacheHeader(hosting, source);
  if (!value || !value.includes('no-cache') || !value.includes('no-store')) {
    addIssue('error', 'firebase headers', `${target}:${source}`, `expected no-cache/no-store, saw ${value ?? 'missing'}`);
  }
}

function assertImmutable(hosting, source, target) {
  const value = cacheHeader(hosting, source);
  if (!value || !value.includes('max-age=31536000') || !value.includes('immutable')) {
    addIssue('error', 'firebase headers', `${target}:${source}`, `expected immutable asset cache, saw ${value ?? 'missing'}`);
  }
}

function assertMutableAssetCache(hosting, source, target) {
  const value = cacheHeader(hosting, source);
  if (
    !value ||
    !value.includes('max-age=86400') ||
    !value.includes('stale-while-revalidate=604800') ||
    value.includes('immutable')
  ) {
    addIssue('error', 'firebase headers', `${target}:${source}`, `expected one-day mutable asset cache with stale-while-revalidate, saw ${value ?? 'missing'}`);
  }
}

const manifest = readJson('public/site.webmanifest');
const firebase = readJson('firebase.json');
const packageJson = readJson('package.json');
const sw = readText('public/sw.js');
const indexHtml = readText('index.html');
const appVersionFile = readText('src/config/appVersion.ts');
const firestoreRules = readText('firestore.rules');

const appVersion = appVersionFile.match(/APP_VERSION\s*=\s*'([^']+)'/)?.[1];
if (!appVersion) {
  addIssue('error', 'app version', 'APP_VERSION', 'APP_VERSION constant not found');
} else if (!sw.includes(`APP_VERSION = '${appVersion}'`)) {
  addIssue('error', 'service worker', 'version', `sw.js version does not match APP_VERSION ${appVersion}`);
}

if (manifest.display !== 'standalone') {
  addIssue('error', 'manifest', 'display', `expected standalone, saw ${manifest.display}`);
}
if (manifest.orientation !== 'any') {
  addIssue('error', 'manifest', 'orientation', `expected any orientation for tablet/phone use, saw ${manifest.orientation}`);
}
if (!String(manifest.start_url ?? '').includes('/dashboard')) {
  addIssue('error', 'manifest', 'start_url', `expected dashboard start_url, saw ${manifest.start_url}`);
}
if (manifest.launch_handler?.client_mode !== 'navigate-existing') {
  addIssue('warn', 'manifest', 'launch_handler', 'navigate-existing launch handling is missing');
}
const icons = manifest.icons ?? [];
const iconSizes = new Set(icons.flatMap((icon) => String(icon.sizes ?? '').split(/\s+/)));
if (!iconSizes.has('192x192') || !iconSizes.has('512x512')) {
  addIssue('error', 'manifest', 'icons', `missing 192x192 or 512x512 icon (${[...iconSizes].join(', ')})`);
}
if (!icons.some((icon) => String(icon.purpose ?? '').includes('maskable'))) {
  addIssue('error', 'manifest', 'maskable', 'missing maskable icon');
}
for (const icon of icons) {
  if (icon.src && !fileExists(icon.src)) {
    addIssue('error', 'manifest', icon.src, 'icon file is missing from public/');
  }
}

for (const required of [
  'mobile-web-app-capable',
  'apple-mobile-web-app-capable',
  'apple-mobile-web-app-title',
  'viewport-fit=cover',
]) {
  if (!indexHtml.includes(required)) {
    addIssue('error', 'index.html', required, 'required installed-app metadata is missing');
  }
}

for (const required of [
  'self.skipWaiting()',
  'self.clients.claim()',
  "request.mode === 'navigate'",
  "cache.match('/index.html')",
  "html.matchAll",
  'staleWhileRevalidate',
  "url.pathname.startsWith('/assets/')",
  "url.pathname.startsWith('/fonts/')",
  'caches.match(request, { ignoreVary: true })',
  'fetchWithTimeout',
  'BUILT_ASSET_URLS',
  'cache.addAll(requiredShellUrls)',
]) {
  if (!sw.includes(required)) {
    addIssue('error', 'service worker', required, 'expected PWA update/offline behavior is missing');
  }
}

for (const font of [
  '/fonts/inter-latin.woff2',
  '/fonts/source-serif-4-latin.woff2',
]) {
  if (!fileExists(font)) {
    addIssue('error', 'fonts', font, 'self-hosted font is missing from public/');
  }
  if (!sw.includes(`'${font}'`)) {
    addIssue('error', 'service worker', font, 'self-hosted font is not precached');
  }
}
if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(indexHtml)) {
  addIssue('error', 'index.html', 'external fonts', 'font loading should not depend on a third-party network request');
}

const hostingConfigs = Array.isArray(firebase.hosting) ? firebase.hosting : [firebase.hosting];
for (const hosting of hostingConfigs) {
  const target = hosting.target ?? 'default';
  if (hosting.public !== 'dist') {
    addIssue('error', 'firebase hosting', target, `expected public dist, saw ${hosting.public}`);
  }
  if (!hosting.rewrites?.some((rewrite) => rewrite.source === '**' && rewrite.destination === '/index.html')) {
    addIssue('error', 'firebase hosting', target, 'missing SPA rewrite to /index.html');
  }
  assertNoCache(hosting, '**', target);
  assertNoCache(hosting, '/sw.js', target);
  assertNoCache(hosting, '/site.webmanifest', target);
  assertNoCache(hosting, '/index.html', target);
  assertImmutable(hosting, '/assets/**', target);
  assertImmutable(hosting, '/fonts/**', target);
  for (const source of ['/brand/**', '/diagrams/**', '/uploads/**']) {
    assertMutableAssetCache(hosting, source, target);
  }
}

if (/allow\s+list:\s+if\s+isAdminEmail\(\)\s*\|\|/.test(firestoreRules)) {
  addIssue('error', 'firestore rules', 'broad list', 'non-admin collection list access is too broad');
}
if (/request\.query\.limit/.test(firestoreRules)) {
  addIssue('error', 'firestore rules', 'query limit gate', 'limit-only list gates can expose learner data');
}
for (const collectionName of [
  'moduleProgress',
  'quizAttempts',
  'confidenceRatings',
  'caseAttempts',
  'videoProgress',
  'auditLogs',
]) {
  const block = firestoreRules.match(new RegExp(`match /${collectionName}/\\{docId\\} \\{([\\s\\S]*?)\\n    \\}`))?.[1] ?? '';
  if (!block.includes('ownsExisting() || isAdminEmail()')) {
    addIssue('error', 'firestore rules', collectionName, 'missing owner-or-admin read rule');
  }
  if (!/allow\s+(?:update,\s*)?delete:\s*if\s+false/.test(block)) {
    addIssue('error', 'firestore rules', collectionName, 'delete should be denied');
  }
}

for (const collectionName of ['moduleProgress', 'videoProgress']) {
  const block = firestoreRules.match(new RegExp(`match /${collectionName}/\\{docId\\} \\{([\\s\\S]*?)\\n    \\}`))?.[1] ?? '';
  if (!/allow\s+update:\s+if\s+ownsExisting\(\)\s*&&\s*ownsIncoming\(\)/.test(block)) {
    addIssue('error', 'firestore rules', collectionName, 'updates must verify both existing and incoming ownership');
  }
}

const bookmarkBlock = firestoreRules.match(/match \/bookmarks\/\{docId\} \{([\s\S]*?)\n {4}\}/)?.[1] ?? '';
if (!/allow\s+delete:\s+if\s+ownsExisting\(\)/.test(bookmarkBlock)) {
  addIssue('error', 'firestore rules', 'bookmarks delete', 'bookmark deletion must verify existing ownership');
}

const userBlock = firestoreRules.match(/match \/users\/\{uid\} \{([\s\S]*?)\n {4}\}/)?.[1] ?? '';
for (const required of ['expectedRole()', '.affectedKeys()', ".hasOnly(['displayName', 'photoURL', 'lastLogin'])"]) {
  if (!userBlock.includes(required)) {
    addIssue('error', 'firestore rules', 'user profile', `missing profile privilege protection: ${required}`);
  }
}

if (!packageJson.scripts?.check?.includes('audit:production')) {
  addIssue('error', 'package scripts', 'check', 'npm run check should include audit:production');
}
if (!packageJson.scripts?.build?.includes('inject-sw-assets.mjs')) {
  addIssue('error', 'package scripts', 'build', 'production builds must inject every lazy route asset into the offline shell');
}
if (!packageJson.scripts?.test?.includes('test:rules')) {
  addIssue('error', 'package scripts', 'test', 'npm test should exercise Firestore rules in the emulator');
}

const summary = {
  hostingTargets: hostingConfigs.map((hosting) => hosting.target ?? 'default'),
  manifestIcons: icons.length,
  appVersion,
  issuesBySeverity: issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] ?? 0) + 1;
    return acc;
  }, {}),
};

console.log(JSON.stringify({ summary, issues }, null, 2));

if (issues.some((issue) => issue.severity === 'error')) {
  process.exitCode = 1;
}
