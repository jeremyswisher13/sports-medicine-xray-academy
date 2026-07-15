import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';
import type { ModuleSummary } from '../types';

interface Props {
  module: ModuleSummary;
  progressPercent?: number;
  completed?: boolean;
  confidence?: number | null;
  saved?: boolean;
  onToggleSaved?: (module: ModuleSummary) => void;
}

export function ModuleCard({
  module,
  progressPercent = 0,
  completed,
  confidence,
  saved = false,
  onToggleSaved,
}: Props) {
  const complete = progressPercent >= 100;
  const started = progressPercent > 0;
  const status = complete ? 'Complete' : started ? 'In progress' : 'Not started';
  const fill = complete ? 100 : started ? 50 : 0;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition-colors hover:border-ucla-200"
    >
      <Link to={`/modules/${module.id}`} className="flex flex-1 flex-col p-5 no-underline">
        <div className="flex items-start justify-between gap-3 text-xs text-slate-500">
          <span>{module.region}</span>
          {completed ? (
            <span className="font-semibold text-emerald-700">Complete</span>
          ) : saved ? (
            <span className="font-semibold text-ucla-700">Saved</span>
          ) : (
            <span>{module.estimatedMinutes} min</span>
          )}
        </div>
        <h3 className="mt-2 text-lg text-balance text-ucla-900 transition-colors group-hover:text-ucla-700">
          {module.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {module.description}
        </p>
        {module.emphasis.length > 0 && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-600">Focus:</span>{' '}
            {module.emphasis.slice(0, 2).join(' · ')}
          </p>
        )}
        <div className="mt-4 flex-1" />
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{status}</span>
            {typeof confidence === 'number' && confidence > 0 && (
              <span className="inline-flex items-center gap-1">
                <Icon name="star" size={12} />
                {confidence}/5
              </span>
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={['h-full rounded-full', complete ? 'bg-emerald-600' : 'bg-ucla-700'].join(' ')}
              style={{ width: `${fill}%` }}
            />
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-3">
        <Link to={`/modules/${module.id}`} className="btn-primary min-w-0 flex-1 px-3 py-2 text-xs sm:flex-none">
          Open module
          <Icon name="arrow-right" size={13} />
        </Link>
        <Link
          to={`/modules/${module.id}/cheatsheet`}
          className="btn-ghost min-h-11 min-w-11 px-2 py-2 text-xs"
          title={`${module.shortTitle} cheat sheet`}
        >
          <Icon name="printer" size={13} />
          <span className="sr-only">Cheat sheet</span>
        </Link>
        {onToggleSaved && (
          <button
            type="button"
            className={[
              'btn-ghost min-h-11 min-w-11 px-2 py-2 text-xs',
              saved ? 'bg-ucla-50 text-ucla-900' : '',
            ].join(' ')}
            onClick={() => onToggleSaved(module)}
            aria-pressed={saved}
            title={saved ? 'Remove saved module' : 'Save module'}
          >
            <Icon name="star" size={13} />
            <span className="sr-only">{saved ? 'Saved' : 'Save'}</span>
          </button>
        )}
      </div>
    </article>
  );
}
