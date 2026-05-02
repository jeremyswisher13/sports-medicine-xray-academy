import { Icon } from './ui/Icon';
import { modulePhases } from '../data/learningFlow';

interface Props {
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function ModulePhaseGuide({ active, onChange, className = '' }: Props) {
  const activeIndex = Math.max(
    0,
    modulePhases.findIndex((phase) => phase.id === active),
  );
  const activePhase = modulePhases[activeIndex] ?? modulePhases[0];
  const previousPhase = modulePhases[activeIndex - 1];
  const nextPhase = modulePhases[activeIndex + 1];
  const progressPercent = ((activeIndex + 1) / modulePhases.length) * 100;

  return (
    <section
      className={[
        'rounded-2xl border border-ucla-100 bg-gradient-to-br from-white via-ucla-50/85 to-sky-50/80 p-4 shadow-soft',
        className,
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
            Phase {activeIndex + 1} of {modulePhases.length}
          </div>
          <h2 className="mt-1 text-lg text-ucla-900">{activePhase.label}</h2>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600">
            {activePhase.description}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-xs"
            onClick={() => previousPhase && onChange(previousPhase.id)}
            disabled={!previousPhase}
          >
            <Icon name="chevron-left" size={13} />
            {previousPhase ? previousPhase.label : 'Previous'}
          </button>
          <button
            type="button"
            className="btn-primary px-3 py-2 text-xs"
            onClick={() => nextPhase && onChange(nextPhase.id)}
            disabled={!nextPhase}
          >
            {nextPhase ? nextPhase.label : 'Complete'}
            <Icon name="chevron-right" size={13} />
          </button>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-ucla-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        {modulePhases.map((phase, index) => {
          const isActive = phase.id === active;
          const isPast = index < activeIndex;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onChange(phase.id)}
              aria-label={`Go to ${phase.label}`}
              className={[
                'flex min-h-16 items-start gap-2 rounded-xl border p-3 text-left transition-colors',
                isActive
                  ? 'border-ucla-300 bg-white text-ucla-900 shadow-soft ring-1 ring-ucla-100'
                  : isPast
                    ? 'border-ucla-100 bg-ucla-50/70 text-ucla-800 hover:bg-ucla-50'
                    : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  isActive
                    ? 'bg-ucla-600 text-white'
                    : isPast
                      ? 'bg-ucla-100 text-ucla-800'
                      : 'bg-slate-100 text-slate-500',
                ].join(' ')}
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{phase.label}</span>
                <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide opacity-70">
                  {isActive ? 'Current' : isPast ? 'Earlier' : 'Upcoming'}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
