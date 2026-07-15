import type { ReactNode } from 'react';
import { Icon } from './ui/Icon';

interface CalloutProps {
  title: string;
  children?: ReactNode;
}

export function DoNotMissCallout({ title, children }: CalloutProps) {
  return (
    <div className="rounded-lg border border-slate-200 border-l-4 border-l-rose-400 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-700">
          <Icon name="alert" size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-700">
            Do not miss
          </div>
          <h4 className="mt-0.5 text-rose-900">{title}</h4>
          <div className="mt-1 text-sm text-rose-900/80 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ClinicalPearlCallout({ title, children }: CalloutProps) {
  return (
    <div className="rounded-lg border border-slate-200 border-l-4 border-l-gold-400 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-50 text-gold-800">
          <Icon name="sparkles" size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-800">
            Clinical pearl
          </div>
          <h4 className="mt-0.5 text-ucla-900">{title}</h4>
          <div className="mt-1 text-sm text-slate-700 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function PitfallCallout({ title, children }: CalloutProps) {
  return (
    <div className="rounded-lg border border-slate-200 border-l-4 border-l-amber-400 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-800">
          <Icon name="flag" size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
            Pitfall
          </div>
          <h4 className="mt-0.5 text-ucla-900">{title}</h4>
          <div className="mt-1 text-sm text-slate-700 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
