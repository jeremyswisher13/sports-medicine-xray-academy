import type { PathologyComparison } from '../types';

interface Props {
  items: PathologyComparison[];
}

export function PathologyComparisonCard({ items }: Props) {
  if (!items.length) {
    return (
      <div className="card p-5 text-sm text-slate-500">
        Pathology patterns are reinforced through cases, atlas images, and quiz explanations for this module.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((p) => (
        <article key={p.finding} className="card p-5">
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="text-ucla-900">{p.finding}</h4>
            <span className="pill">Compare and contrast</span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Normal
              </div>
              <p className="mt-1 text-sm text-slate-700 leading-relaxed">{p.normal}</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                Pathologic
              </div>
              <p className="mt-1 text-sm text-slate-700 leading-relaxed">{p.pathologic}</p>
            </div>
          </div>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="label">Key clue</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{p.keyClue}</dd>
            </div>
            <div>
              <dt className="label">Pitfall</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{p.pitfall}</dd>
            </div>
            <div>
              <dt className="label">Next step</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{p.nextStep}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
