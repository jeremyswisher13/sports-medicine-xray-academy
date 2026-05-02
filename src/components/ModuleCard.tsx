import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';
import type { ModuleSummary } from '../types';

interface Props {
  module: ModuleSummary;
  progressPercent?: number;
  completed?: boolean;
  confidence?: number | null;
}

const regionTone: Record<ModuleSummary['region'], string> = {
  Foundations: 'bg-ucla-50 text-ucla-800 border-ucla-100',
  'Upper Extremity': 'bg-sky-50 text-sky-800 border-sky-100',
  'Lower Extremity': 'bg-emerald-50 text-emerald-800 border-emerald-100',
  Axial: 'bg-violet-50 text-violet-800 border-violet-100',
  Pediatric: 'bg-rose-50 text-rose-800 border-rose-100',
  'High-Yield Cases': 'bg-gold-50 text-gold-800 border-gold-100',
};

export function ModuleCard({ module, progressPercent = 0, completed, confidence }: Props) {
  const isPlaceholder = module.status === 'placeholder';
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-soft transition-shadow hover:shadow-card"
    >
      <div className="h-1 bg-ucla-400" />
      <Link to={`/modules/${module.id}`} className="flex flex-1 flex-col p-5 no-underline">
      <div className="flex items-start justify-between gap-3">
        <span className={['pill border', regionTone[module.region]].join(' ')}>
          {module.region}
        </span>
        {isPlaceholder ? (
          <span className="pill">In build</span>
        ) : completed ? (
          <span className="pill-primary">
            <Icon name="check" size={12} /> Completed
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg text-balance text-ucla-900 group-hover:text-ucla-700 transition-colors">
        {module.title}
      </h3>
      <p className="mt-1 text-sm text-slate-600 leading-relaxed line-clamp-3">
        {module.description}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {module.emphasis.slice(0, 3).map((e) => (
          <li key={e} className="pill">
            {e}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex-1" />
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{module.estimatedMinutes} min</span>
          <span className="tabular-nums">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-ucla-700"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
        {typeof confidence === 'number' && confidence > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Icon name="star" size={12} />
            Confidence: <span className="font-semibold text-slate-700">{confidence}/5</span>
          </div>
        )}
      </div>
      </Link>
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
        <Link to={`/modules/${module.id}`} className="btn-primary px-3 py-2 text-xs">
          Open module
          <Icon name="arrow-right" size={13} />
        </Link>
        <Link to={`/modules/${module.id}/cheatsheet`} className="btn-secondary px-3 py-2 text-xs">
          <Icon name="printer" size={13} />
          Cheat sheet
        </Link>
      </div>
    </article>
  );
}
