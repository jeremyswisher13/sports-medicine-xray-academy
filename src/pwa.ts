import { APP_VERSION } from './config/appVersion';

interface RegisterOptions {
  onOfflineReady?: () => void;
  onUpdateReady?: () => void;
}

let waitingWorker: ServiceWorker | null = null;
let refreshing = false;

function syncControlState(): void {
  document.documentElement.dataset.pwaControlled = navigator.serviceWorker.controller
    ? 'true'
    : 'false';
}

async function syncShellState(): Promise<void> {
  try {
    const cache = await caches.open(`sxra-shell-${APP_VERSION}`);
    const requests = await cache.keys();
    document.documentElement.dataset.pwaShellAssets = String(requests.length);
  } catch {
    document.documentElement.dataset.pwaShellAssets = 'unavailable';
  }
}

export function isStandaloneApp(): boolean {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean(navigatorWithStandalone.standalone)
  );
}

export function registerServiceWorker(options: RegisterOptions = {}): void {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  syncControlState();

  function startRegistration() {
    void navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        void navigator.serviceWorker.ready.then(() => {
          document.documentElement.dataset.pwaReady = 'true';
          syncControlState();
          void syncShellState();
        });
        if (registration.waiting) {
          waitingWorker = registration.waiting;
          options.onUpdateReady?.();
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state !== 'installed') return;

            if (navigator.serviceWorker.controller) {
              waitingWorker = newWorker;
              options.onUpdateReady?.();
            } else {
              options.onOfflineReady?.();
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[pwa] service worker registration failed', err);
      });
  }

  if (document.readyState === 'complete') {
    startRegistration();
  } else {
    window.addEventListener('load', startRegistration, { once: true });
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    syncControlState();
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

export function applyServiceWorkerUpdate(): void {
  waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
}
