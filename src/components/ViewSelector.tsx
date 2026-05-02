import { Icon } from './ui/Icon';
import type { ImagingView } from '../types';

interface Props {
  views: ImagingView[];
}

export function ViewSelector({ views }: Props) {
  if (!views.length) {
    return (
      <div className="card p-5 text-sm text-slate-500">
        Recommended views are being curated for this module.
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {views.map((v) => (
        <article
          key={v.name}
          className="card card-hover p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
              <Icon name="eye" size={16} />
            </span>
            <div className="min-w-0">
              <h4 className="text-base text-ucla-900">{v.name}</h4>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{v.why}</p>
              <p className="mt-2 text-xs">
                <span className="label">Order when</span>
                <span className="ml-2 text-slate-700">{v.whenToOrder}</span>
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
