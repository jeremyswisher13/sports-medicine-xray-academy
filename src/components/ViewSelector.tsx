import { useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import type { ImagingView } from '../types';

interface Props {
  views: ImagingView[];
}

export function ViewSelector({ views }: Props) {
  const [selectedViewName, setSelectedViewName] = useState<string | null>(null);
  const teachingView = useMemo(() => pickTeachingView(views), [views]);
  const selectedView = views.find((view) => view.name === selectedViewName);
  const selectedIsTeachingView = selectedView?.name === teachingView?.name;

  if (!views.length) {
    return (
      <div className="card p-5 text-sm text-slate-500">
        Recommended views are covered through the systematic read for this module.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teachingView && (
        <section className="card overflow-hidden">
          <div className="border-b border-ucla-100 bg-ucla-50/70 px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill-primary">View choice drill</span>
              <span className="pill">{views.length} views</span>
            </div>
            <h3 className="mt-2 text-base text-ucla-900">
              Which view would you inspect first for a common miss?
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Commit to a view, then compare why each view matters.
            </p>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid gap-2 sm:grid-cols-2">
              {views.map((view) => {
                const isSelected = selectedViewName === view.name;
                const isTeachingView = teachingView.name === view.name;
                const revealTeachingView = selectedViewName !== null && isTeachingView;
                return (
                  <button
                    key={view.name}
                    type="button"
                    onClick={() => setSelectedViewName(view.name)}
                    className={[
                      'flex min-h-[3.75rem] items-start gap-2.5 rounded-2xl border p-3 text-left text-sm font-semibold leading-snug transition-colors',
                      revealTeachingView
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : isSelected
                          ? 'border-ucla-300 bg-ucla-50 text-ucla-950'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-ucla-200 hover:bg-ucla-50/70',
                    ].join(' ')}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={[
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                        revealTeachingView || isSelected
                          ? 'border-ucla-700 bg-ucla-700 text-white'
                          : 'border-slate-300 bg-white text-transparent',
                      ].join(' ')}
                    >
                      <Icon name={revealTeachingView ? 'check' : 'circle'} size={12} />
                    </span>
                    <span>{view.name}</span>
                  </button>
                );
              })}
            </div>

            {selectedView ? (
              <div
                className={[
                  'mt-4 rounded-2xl border p-3',
                  selectedIsTeachingView
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-ucla-100 bg-ucla-50/70',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-ucla-900">
                  <Icon
                    name={selectedIsTeachingView ? 'check-circle' : 'eye'}
                    size={16}
                    className={selectedIsTeachingView ? 'text-emerald-700' : 'text-ucla-700'}
                  />
                  {selectedIsTeachingView ? 'High-yield first look' : `Compare with ${teachingView.name}`}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  {selectedIsTeachingView
                    ? teachingView.why
                    : `${selectedView.name} is still useful. For this module, start by asking when ${teachingView.name.toLowerCase()} changes the read: ${teachingView.whenToOrder}`}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs font-medium text-slate-500">
                Choose one view to unlock the teaching comparison.
              </p>
            )}
          </div>
        </section>
      )}

      <details
        className="rounded-2xl border border-ucla-100 bg-white/95 p-4 shadow-soft"
        open={selectedViewName !== null}
      >
        <summary className="cursor-pointer text-sm font-semibold text-ucla-900">
          View reference
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {views.map((v) => (
            <article key={v.name} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
                  <Icon name="eye" size={16} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-base text-ucla-900">{v.name}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{v.why}</p>
                  <p className="mt-2 text-xs">
                    <span className="label">Order when</span>
                    <span className="ml-2 text-slate-700">{v.whenToOrder}</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </details>
    </div>
  );
}

function pickTeachingView(views: ImagingView[]): ImagingView | undefined {
  const explicitTeachingView = views.find((view) => view.teachingView);
  if (explicitTeachingView) return explicitTeachingView;
  const priorityPattern =
    /weight|stress|axillary|scapular|mortise|sunrise|merchant|scaphoid|oblique|lateral|odontoid|open-mouth/i;
  return (
    views.find((view) =>
      priorityPattern.test(`${view.name} ${view.why} ${view.whenToOrder}`),
    ) ?? views[0]
  );
}
