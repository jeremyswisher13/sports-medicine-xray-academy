import type { AnatomyLandmark } from '../types';

interface Props {
  landmarks: AnatomyLandmark[];
}

export function AnatomyLandmarkCard({ landmarks }: Props) {
  if (!landmarks.length) {
    return (
      <div className="card p-5 text-sm text-slate-500">
        Normal anatomy landmarks are being curated for this module.
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {landmarks.map((l) => (
        <article key={l.label} className="card p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
            Landmark
          </div>
          <h4 className="mt-1 text-base text-ucla-900">{l.label}</h4>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{l.description}</p>
          {l.pearl && (
            <p className="mt-2 rounded-lg bg-gold-50 px-2.5 py-1.5 text-xs font-medium text-gold-800">
              {l.pearl}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
