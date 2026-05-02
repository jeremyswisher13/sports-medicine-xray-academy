import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';
import type { ModuleSummary } from '../types';

interface Props {
  module?: ModuleSummary;
  compact?: boolean;
}

export function CheatSheetPromo({ module, compact = false }: Props) {
  const primaryHref = module ? `/modules/${module.id}/cheatsheet` : '/cheatsheets';
  const title = module ? `${module.shortTitle} cheat sheet` : 'Clinic-ready cheat sheets';
  const body = module
    ? 'Open the one-page reference for views, do-not-miss findings, pitfalls, and escalation.'
    : 'Fast one-page references for clinic, sideline coverage, and last-minute review.';

  return (
    <section
      className={[
        'overflow-hidden rounded-xl border border-ucla-100 bg-ucla-50/80 text-slate-700 shadow-soft',
        compact ? 'p-4' : 'p-5 sm:p-6',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800 ring-1 ring-ucla-100">
            <Icon name="book-open" size={18} />
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ucla-700">
              Fast reference
            </div>
            <h2 className="mt-0.5 text-xl leading-tight text-ucla-900 sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600">
              {body}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Link to={primaryHref} className="btn-primary w-full sm:w-auto">
            <Icon name="printer" size={14} />
            Open sheet
          </Link>
          {module && (
            <Link
              to="/cheatsheets"
              className="btn-secondary w-full sm:w-auto"
            >
              All sheets
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
