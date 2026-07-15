import { useEffect, useState } from 'react';
import { applyServiceWorkerUpdate, isStandaloneApp, registerServiceWorker } from '../pwa';
import { Icon } from './ui/Icon';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const INSTALL_TIP_DISMISSED_KEY = 'sxra:pwa-install-tip-dismissed';

function isIosSafari(): boolean {
  const userAgent = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const safari = /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
  return iOS && safari;
}

function installTipWasDismissed(): boolean {
  try {
    return localStorage.getItem(INSTALL_TIP_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function PwaStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [offlineDismissed, setOfflineDismissed] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(() => isStandaloneApp());
  const [installTipDismissed, setInstallTipDismissed] = useState(
    installTipWasDismissed,
  );
  const iosInstallTip = isIosSafari() && !standalone;

  useEffect(() => {
    function syncOnline() {
      const nextOnline = navigator.onLine;
      setOnline(nextOnline);
      if (!nextOnline) setOfflineDismissed(false);
    }

    function captureInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function markInstalled() {
      setInstallPrompt(null);
      setStandalone(true);
    }

    window.addEventListener('online', syncOnline);
    window.addEventListener('offline', syncOnline);
    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    window.addEventListener('appinstalled', markInstalled);
    registerServiceWorker({
      onUpdateReady: () => setUpdateReady(true),
    });

    return () => {
      window.removeEventListener('online', syncOnline);
      window.removeEventListener('offline', syncOnline);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice.catch(() => undefined);
    setInstallPrompt(null);
    if (choice?.outcome === 'dismissed') dismissInstallTip();
  }

  function dismissInstallTip() {
    setInstallTipDismissed(true);
    try {
      localStorage.setItem(INSTALL_TIP_DISMISSED_KEY, 'true');
    } catch {
      // The prompt remains dismissed for this session.
    }
  }

  if (updateReady) {
    return (
      <PwaToast
        tone="update"
        title="New academy content is ready."
        body="Refresh once to load the latest content and app improvements."
        actionLabel="Refresh"
        onAction={applyServiceWorkerUpdate}
        onDismiss={() => setUpdateReady(false)}
      />
    );
  }

  if (!online && !offlineDismissed) {
    return (
      <PwaToast
        tone="offline"
        title="Offline mode"
        body="Core pages and previously opened images stay available. Videos need internet."
        onDismiss={() => setOfflineDismissed(true)}
      />
    );
  }

  if (!standalone && !installTipDismissed && (installPrompt || iosInstallTip)) {
    return (
      <PwaToast
        tone="install"
        title="Add X-Ray Academy to your Home Screen"
        body={
          iosInstallTip && !installPrompt
            ? 'In Safari, tap Share, then Add to Home Screen.'
            : 'Install it for faster access and a full-screen app experience.'
        }
        actionLabel={installPrompt ? 'Install' : undefined}
        onAction={installPrompt ? () => void installApp() : undefined}
        onDismiss={dismissInstallTip}
      />
    );
  }

  return null;
}

function PwaToast({
  tone,
  title,
  body,
  actionLabel,
  onAction,
  onDismiss,
}: {
  tone: 'offline' | 'update' | 'install';
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}) {
  const icon = tone === 'offline' ? 'alert' : tone === 'update' ? 'refresh' : 'download';

  return (
    <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-40 mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-3 shadow-elevated lg:bottom-4 lg:right-4 lg:left-auto">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ucla-50 text-ucla-800">
          <Icon name={icon} size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-ucla-950">{title}</div>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{body}</p>
        </div>
        {actionLabel && onAction && (
          <button type="button" className="btn-primary px-3 py-2 text-xs" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            onClick={onDismiss}
            aria-label="Dismiss message"
          >
            <Icon name="x" size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
