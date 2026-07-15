const APP_VERSION = '2026.07.15-pwa.6';
const CACHE_PREFIX = 'sxra';
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${APP_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${APP_VERSION}`;
const BUILT_ASSET_URLS = /* __BUILT_ASSET_URLS__ */ [];

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/dashboard?source=pwa',
  '/site.webmanifest',
  '/brand/app-icon-bone.svg',
  '/brand/apple-touch-icon.png',
  '/brand/pwa-icon-192.png',
  '/brand/pwa-icon-512.png',
  '/brand/pwa-icon-maskable-512.png',
  '/brand/wordmark-color.png',
  '/brand/wordmark-on-dark.png',
  '/brand/mark-white.svg',
  '/brand/favicon-32.png',
  '/brand/favicon-64.png',
  '/fonts/inter-latin.woff2',
  '/fonts/source-serif-4-latin.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(precacheShell());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith(CACHE_PREFIX) && ![SHELL_CACHE, RUNTIME_CACHE].includes(name))
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (
    sameOrigin &&
    (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/'))
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (sameOrigin && url.pathname === '/site.webmanifest') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (sameOrigin && isMutableMedia(url)) {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});

function isMutableMedia(url) {
  return (
    url.pathname.startsWith('/brand/') ||
    url.pathname.startsWith('/diagrams/') ||
    url.pathname.startsWith('/uploads/') ||
    /\.(?:png|jpg|jpeg|svg|webp|ico)$/i.test(url.pathname)
  );
}

async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  const requiredShellUrls = [...new Set([...PRECACHE_URLS, ...BUILT_ASSET_URLS])];
  await cache.addAll(requiredShellUrls);

  try {
    const response = await fetch('/index.html', { cache: 'no-store' });
    if (!response.ok) return;
    const html = await response.clone().text();
    await cache.put('/index.html', response);
    const builtAssets = Array.from(
      html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g),
      (match) => match[1],
    );
    await Promise.allSettled(builtAssets.map((url) => cache.add(url)));
  } catch {
    // The fixed shell still provides an offline landing page.
  }
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cachedShell = (await cache.match('/index.html')) || (await cache.match('/'));
  try {
    const response = cachedShell
      ? await fetchWithTimeout(request, 3500)
      : await fetch(request);
    if (response.ok) {
      await cache.put('/index.html', response.clone());
    }
    return response;
  } catch {
    return cachedShell || Response.error();
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request)) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await caches.match(request, { ignoreVary: true });
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const update = fetch(request)
    .then(async (response) => {
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    event.waitUntil(update.then(() => undefined));
    return cached;
  }
  return cached || (await update) || Response.error();
}

async function fetchWithTimeout(request, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}
