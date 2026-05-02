import { modulePhases } from '../data/learningFlow';
import type { ModuleContent } from '../types';
import { Icon, type IconName } from './ui/Icon';

type Phase = (typeof modulePhases)[number];
type PhaseId = Phase['id'];

interface Props {
  module: ModuleContent;
  activePhaseId: string;
  onPhaseChange: (id: string) => void;
  completedPhaseIds?: string[];
  postCheckPending?: boolean;
  className?: string;
}

const phaseIcons: Record<PhaseId, IconName> = {
  learn: 'book-open',
  views: 'eye',
  images: 'image',
  practice: 'clipboard',
  quiz: 'lightning',
  takeaways: 'flag',
};

export function ModulePhaseNavigator({
  module,
  activePhaseId,
  onPhaseChange,
  completedPhaseIds = [],
  postCheckPending = false,
  className = '',
}: Props) {
  const activePhase = normalizePhaseId(activePhaseId);
  const activeIndex = modulePhases.findIndex((phase) => phase.id === activePhase);
  const current = modulePhases[activeIndex] ?? modulePhases[0];
  const next = modulePhases[activeIndex + 1];
  const previous = modulePhases[activeIndex - 1];
  const completedPhaseIdSet = new Set(completedPhaseIds);
  const progressPercent = Math.round(((activeIndex + 1) / modulePhases.length) * 100);

  return (
    <section
      className={[
        'rounded-2xl border border-ucla-100 bg-white/90 p-4 shadow-soft sm:p-5',
        className,
      ].join(' ')}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <div className="section-title">Current focus</div>
          <div className="mt-2 flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ucla-50 text-ucla-800 ring-1 ring-ucla-100">
              <Icon name={phaseIcons[current.id]} size={19} />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl text-ucla-950 sm:text-2xl">
                {current.label}: {module.shortTitle}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-xs"
            onClick={() => previous && onPhaseChange(previous.id)}
            disabled={!previous}
          >
            <Icon name="chevron-left" size={13} />
            {previous ? previous.label : 'Previous'}
          </button>
          {next ? (
            <button
              type="button"
              className="btn-primary px-3 py-2 text-xs"
              onClick={() => onPhaseChange(next.id)}
            >
              Next: {next.label}
              <Icon name="chevron-right" size={13} />
            </button>
          ) : (
            <button
              type="button"
              className="btn-gold px-3 py-2 text-xs"
              onClick={() => onPhaseChange('takeaways')}
            >
              {postCheckPending ? 'Finish post-check' : 'Review takeaways'}
              <Icon name="flag" size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Phase {activeIndex + 1} of {modulePhases.length}
          </span>
          {postCheckPending && <span className="text-gold-800">Post-check pending</span>}
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ucla-50 ring-1 ring-ucla-100">
          <div
            className="h-full rounded-full bg-ucla-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {modulePhases.map((phase, index) => {
          const active = phase.id === current.id;
          const complete = completedPhaseIdSet.has(phase.id);
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onPhaseChange(phase.id)}
              aria-current={active ? 'step' : undefined}
              className={[
                'flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors',
                active
                  ? 'border-ucla-500 bg-ucla-500 text-white shadow-soft'
                  : complete
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-ucla-200 hover:bg-ucla-50 hover:text-ucla-900',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
                  active
                    ? 'bg-white/20 text-white'
                    : complete
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500',
                ].join(' ')}
              >
                {complete ? <Icon name="check" size={12} /> : index + 1}
              </span>
              {phase.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function normalizePhaseId(activePhaseId: string): PhaseId {
  const phase = modulePhases.find((candidate) => candidate.id === activePhaseId);
  return phase?.id ?? 'learn';
}
