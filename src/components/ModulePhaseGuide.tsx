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
        'rounded-xl border border-ucla-100 bg-white p-4 shadow-soft',
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
            Previous
          </button>
          <button
            type="button"
            className="btn-primary px-3 py-2 text-xs"
            onClick={() => nextPhase && onChange(nextPhase.id)}
            disabled={!nextPhase}
          >
            Next
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
      <div className="mt-3 grid grid-cols-6 gap-1">
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
                'h-1.5 rounded-full transition-colors',
                isActive ? 'bg-ucla-500' : isPast ? 'bg-ucla-300' : 'bg-slate-200',
              ].join(' ')}
            />
          );
        })}
      </div>
    </section>
  );
}
