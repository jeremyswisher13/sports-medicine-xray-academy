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

interface TeachingSchematicContent {
  eyebrow: string;
  title: string;
  summary: string;
  points: string[];
}

const schematicContent: Record<string, TeachingSchematicContent> = {
  'foundations-systematic-read': {
    eyebrow: 'Systematic X-Ray Read',
    title: 'One repeatable read, every film',
    summary: 'Confirm, then move from alignment to bone, cartilage, soft tissues, and impression.',
    points: ['Confirm', 'Alignment', 'Bone', 'Cartilage', 'Soft tissues', 'Impression'],
  },
  'shoulder-ac-cc-distance': {
    eyebrow: 'Shoulder alignment',
    title: 'AC joint and CC distance',
    summary: 'Compare side-to-side alignment and look for vertical displacement of the clavicle.',
    points: ['AC joint width', 'CC distance', 'Clavicle elevation', 'Bilateral comparison'],
  },
  'knee-segond': {
    eyebrow: 'Do not miss',
    title: 'Segond avulsion clue',
    summary: 'Small lateral tibial plateau avulsion should raise concern for associated ACL injury.',
    points: ['Lateral rim fragment', 'ACL association', 'Rotational mechanism', 'MRI / ortho next'],
  },
  'ankle-mortise-clear-spaces': {
    eyebrow: 'Ankle mortise',
    title: 'Clear spaces should stay symmetric',
    summary: 'Trace the mortise for medial widening, talar shift, and syndesmotic instability.',
    points: ['Medial clear space', 'Superior clear space', 'Talar shift', 'Syndesmosis'],
  },
  'do-not-miss-klein-line': {
    eyebrow: 'Pediatric hip',
    title: 'Klein line screen for SCFE',
    summary: 'On AP pelvis, the line along the superior femoral neck should intersect the epiphysis.',
    points: ['AP pelvis', 'Compare sides', 'Epiphyseal slip', 'Urgent non-weightbearing'],
  },
  'do-not-miss-gilula-arcs': {
    eyebrow: 'Carpal alignment',
    title: 'Gilula arcs must remain smooth',
    summary: 'Interrupted arcs or abnormal lunate position can signal perilunate injury.',
    points: ['Three smooth arcs', 'Lunate alignment', 'Scapholunate gap', 'Lateral confirmation'],
  },
};

function TeachingSchematic({
  entry,
  className = '',
}: {
  entry: XRayImageEntry;
  className?: string;
}) {
  const content = schematicContent[entry.id] ?? {
    eyebrow: 'Teaching schematic',
    title: entry.caption ?? 'Radiograph interpretation cue',
    summary: entry.alt,
    points: [entry.view, entry.moduleId ?? 'Module reference', entry.source ?? 'Original teaching asset'],
  };

  return (
    <figure
      className={[
        'relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-white shadow-soft',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gold-500" />
      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-100">
            <Icon name="sparkles" size={11} />
            {content.eyebrow}
          </span>
          {entry.license && (
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-200">
              Original teaching asset
            </span>
          )}
        </div>

        <div className="mt-auto grid gap-4 sm:grid-cols-[0.95fr_1.05fr] sm:items-end">
          <div>
            <h3 className="text-xl font-semibold leading-tight text-white sm:text-2xl">
              {content.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {content.summary}
            </p>
          </div>
          <div className="grid gap-2">
            {content.points.map((point, index) => (
              <div
                key={point}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ucla-950">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-100">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {(entry.caption || entry.attribution) && (
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px] text-slate-400">
            {entry.caption && <span>{entry.caption}</span>}
            {entry.attribution && <span>{entry.attribution}</span>}
          </figcaption>
        )}
      </div>
    </figure>
  );
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

  if (entry.isDiagram) {
    return <TeachingSchematic entry={entry} className={className} />;
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
