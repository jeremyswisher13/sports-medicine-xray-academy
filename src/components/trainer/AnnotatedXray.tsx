import { getImage } from '../../data/images';
import type { AnatomyMarker } from '../../data/anatomyTrainer';

interface Props {
  imageKey: string;
  markers?: AnatomyMarker[];
  showLabels?: boolean;
  pulse?: boolean;
  /** Hide the attribution caption (e.g. inside the test, to avoid hints). */
  hideCaption?: boolean;
}

// A single radiograph with markers overlaid at percentage coordinates. Used by
// the Guided Tour (labels shown) and the Knowledge Check (one pulsing marker).
export function AnnotatedXray({
  imageKey,
  markers = [],
  showLabels = false,
  pulse = false,
  hideCaption = false,
}: Props) {
  const entry = getImage(imageKey);
  if (!entry) {
    return (
      <div className="grid aspect-[3/4] w-full place-items-center rounded-xl bg-slate-900 text-sm text-slate-400">
        Image unavailable
      </div>
    );
  }
  return (
    <figure className="m-0">
      <div className="relative overflow-hidden rounded-xl bg-black">
        <img
          src={entry.src}
          alt={entry.alt ?? entry.caption ?? ''}
          draggable={false}
          className="block w-full select-none"
        />
        {markers.map((m, i) => (
          <div
            key={i}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <span
              className={[
                'block h-5 w-5 rounded-full border-2 border-gold-400 bg-gold-400/25 shadow-[0_0_0_2px_rgba(0,0,0,0.55)]',
                pulse ? 'animate-pulse' : '',
              ].join(' ')}
            />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400" />
            {showLabels && m.label && (
              <span className="absolute left-1/2 top-[150%] -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
                {m.label}
              </span>
            )}
          </div>
        ))}
      </div>
      {!hideCaption && (entry.caption || entry.attribution) && (
        <figcaption className="mt-1.5 text-[11px] leading-snug text-slate-500">
          {entry.caption}
          {entry.attribution ? ` · ${entry.attribution}` : ''}
          {entry.license ? ` · ${entry.license}` : ''}
        </figcaption>
      )}
    </figure>
  );
}
