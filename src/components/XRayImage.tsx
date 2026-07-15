import { useEffect, useRef, useState } from 'react';
import { Icon } from './ui/Icon';
import { PlaceholderImagePanel } from './PlaceholderImagePanel';
import type { XRayImageEntry } from '../types';
import { imagePreviewSrc } from '../utils/imagePreview';

interface Props {
  entry?: XRayImageEntry | null;
  // Used when no entry is provided — falls back to a labeled placeholder.
  fallbackView?: 'AP' | 'Lateral' | 'Oblique' | 'Special' | 'Annotated' | 'Comparison';
  fallbackCaption?: string;
  className?: string;
}

export function XRayImage({
  entry,
  fallbackView = 'AP',
  fallbackCaption,
  className = '',
}: Props) {
  const [errored, setErrored] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewerOpen(false);
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        viewerRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [viewerOpen]);

  if (!entry || errored) {
    return (
      <PlaceholderImagePanel
        view={fallbackView}
        caption={fallbackCaption}
        className={className}
      />
    );
  }

  return (
    <>
    <figure
      className={[
        'group relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-soft',
        className,
      ].join(' ')}
    >
      <img
        src={imagePreviewSrc(entry.src)}
        alt={entry.alt}
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
        className="absolute inset-0 h-full w-full object-contain"
      />
      <button
        type="button"
        onClick={() => setViewerOpen(true)}
        className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-950/70 text-white opacity-90 backdrop-blur transition-opacity hover:opacity-100"
        aria-label={`Open larger view of ${entry.caption ?? entry.alt}`}
      >
        <Icon name="maximize" size={14} />
      </button>
      <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
        {entry.isDiagram ? (
          <span className="pill-primary">
            <Icon name="sparkles" size={11} />
            Illustrative diagram
          </span>
        ) : entry.isNormal ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 text-xs font-semibold">
            <Icon name="check-circle" size={11} />
            Normal · {entry.view}
          </span>
        ) : (
          <span className="pill-primary">
            <Icon name="image" size={11} />
            {entry.view}
          </span>
        )}
        {entry.license && (
          <span className="pill bg-white/90 backdrop-blur">
            {entry.license}
          </span>
        )}
      </div>
      {(entry.caption || entry.attribution) && (
        <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-white/90 px-3 py-1.5 text-[11px] text-slate-700 backdrop-blur">
          {entry.caption && (
            <span className="font-medium text-slate-800">{entry.caption}</span>
          )}
          {entry.attribution && (
            <span className="text-slate-500 truncate">
              {entry.sourceUrl ? (
                <a
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 underline-offset-2 hover:text-ucla-700"
                >
                  {entry.attribution}
                </a>
              ) : (
                entry.attribution
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
    {viewerOpen && (
      <div
        ref={viewerRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"
        role="dialog"
        aria-modal="true"
        aria-label={entry.caption ?? entry.alt}
        onClick={(e) => {
          if (e.target === e.currentTarget) setViewerOpen(false);
        }}
      >
        <div className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-elevated">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-200">
                X-ray viewer
              </div>
              <div className="truncate text-sm font-semibold">
                {entry.caption ?? entry.alt}
              </div>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setViewerOpen(false)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15"
              aria-label="Close x-ray viewer"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-3">
            <img
              src={entry.src}
              alt={entry.alt}
              decoding="async"
              className="max-h-[72vh] w-full object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-xs text-slate-300">
            <div>
              {entry.view}
              {entry.license ? ` · ${entry.license}` : ''}
              {entry.attribution ? ` · ${entry.attribution}` : ''}
            </div>
            {entry.sourceUrl && (
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold-200 hover:text-gold-100"
              >
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
