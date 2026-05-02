import { useState } from 'react';
import { Icon } from './ui/Icon';
import { PlaceholderImagePanel } from './PlaceholderImagePanel';
import type { XRayImageEntry } from '../types';

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
    <figure
      className={[
        'group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50',
        className,
      ].join(' ')}
    >
      <img
        src={entry.src}
        alt={entry.alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className="absolute inset-0 h-full w-full object-contain"
      />
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
  );
}
