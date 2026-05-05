import { Link } from 'react-router-dom';
import type { ModuleContent } from '../types';
import { Icon } from './ui/Icon';

interface Props {
  module: ModuleContent;
  saved: boolean;
  onToggleSaved: () => void;
  className?: string;
}

export function ModuleResourceMenu({
  module,
  saved,
  onToggleSaved,
  className = '',
}: Props) {
  return (
    <details className={['group relative', className].filter(Boolean).join(' ')}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-ucla-100 bg-white/95 px-3 py-1.5 text-xs font-semibold text-ucla-900 shadow-soft transition-colors hover:bg-ucla-50 [&::-webkit-details-marker]:hidden">
        <Icon name="sparkles" size={13} />
        Resources
        <Icon
          name="chevron-right"
          size={13}
          className="transition-transform group-open:rotate-90"
        />
      </summary>

      <div className="mt-2 grid min-w-56 gap-2 rounded-2xl border border-ucla-100 bg-white p-2 shadow-soft sm:absolute sm:right-0 sm:z-20">
        <button
          type="button"
          className={[
            'inline-flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors',
            saved
              ? 'border-ucla-200 bg-ucla-50 text-ucla-900 hover:bg-ucla-100'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-ucla-50',
          ].join(' ')}
          onClick={onToggleSaved}
          aria-pressed={saved}
        >
          <Icon name="star" size={13} />
          {saved ? 'Saved for review' : 'Save for review'}
        </button>
        <Link
          to={`/modules/${module.id}/cheatsheet`}
          className="inline-flex w-full items-center gap-2 rounded-xl border border-ucla-100 bg-ucla-50/70 px-3 py-2 text-xs font-semibold text-ucla-900 no-underline transition-colors hover:bg-ucla-100"
        >
          <Icon name="printer" size={13} />
          Cheat sheet
        </Link>
        <Link
          to={`/flashcards?module=${module.id}`}
          className="inline-flex w-full items-center gap-2 rounded-xl border border-gold-200 bg-gold-50 px-3 py-2 text-xs font-semibold text-ucla-900 no-underline transition-colors hover:bg-gold-100"
        >
          <Icon name="sparkles" size={13} />
          Flashcards
        </Link>
      </div>
    </details>
  );
}
