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
        'overflow-hidden rounded-xl border border-ucla-800 bg-ucla-950 text-white shadow-elevated',
        compact ? 'p-4' : 'p-5 sm:p-6',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-ucla-950">
            <Icon name="book-open" size={18} />
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-200">
              Fast reference
            </div>
            <h2 className="mt-0.5 text-xl leading-tight text-white sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-200">
              {body}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Link to={primaryHref} className="btn-gold w-full sm:w-auto">
            <Icon name="printer" size={14} />
            Open sheet
          </Link>
          {module && (
            <Link
              to="/cheatsheets"
              className="btn w-full border border-white/15 bg-white/10 text-white hover:bg-white/15 sm:w-auto"
            >
              All sheets
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
