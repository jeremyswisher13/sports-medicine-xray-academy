import type { ReactNode } from 'react';
import { Icon } from './ui/Icon';

interface CalloutProps {
  title: string;
  children?: ReactNode;
}

export function DoNotMissCallout({ title, children }: CalloutProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <Icon name="alert" size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
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
    <div className="rounded-2xl border border-gold-200 bg-gold-50/70 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-800">
          <Icon name="sparkles" size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-gold-800">
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
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
          <Icon name="flag" size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            Pitfall
          </div>
          <h4 className="mt-0.5 text-ucla-900">{title}</h4>
          <div className="mt-1 text-sm text-slate-700 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
