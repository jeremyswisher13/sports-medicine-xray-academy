import { useState } from 'react';
import type { PathologyComparison } from '../types';
import { Icon } from './ui/Icon';

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
    <div className="space-y-3">
      {items.map((item) => (
        <PathologyRow key={item.finding} item={item} />
      ))}
    </div>
  );
}

// Each finding leads with just its name + the recognition key clue. The dense
// normal-vs-pathologic / pitfall / next-step detail sits one tap away so the
// list stays scannable instead of becoming a wall of facts.
function PathologyRow({ item }: { item: PathologyComparison }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-baseline gap-2">
        <h4 className="text-ucla-900">{item.finding}</h4>
        <span className="pill">Compare and contrast</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        <span className="font-semibold text-ucla-800">Key clue: </span>
        {item.keyClue}
      </p>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ucla-700 hover:text-ucla-900"
      >
        {open ? 'Hide detail' : 'Normal vs pathologic · pitfall · next step'}
        <Icon
          name="chevron-down"
          size={14}
          className={['transition-transform', open ? 'rotate-180' : ''].join(' ')}
        />
      </button>
      {open && (
        <div className="mt-3 animate-fade-in">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Normal
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.normal}</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                Pathologic
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.pathologic}</p>
            </div>
          </div>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="label">Pitfall</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{item.pitfall}</dd>
            </div>
            <div>
              <dt className="label">Next step</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{item.nextStep}</dd>
            </div>
          </dl>
        </div>
      )}
    </article>
  );
}
