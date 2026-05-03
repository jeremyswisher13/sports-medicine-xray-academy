import { modulePhases } from '../data/learningFlow';
import type { ModuleContent } from '../types';
import { Icon, type IconName } from './ui/Icon';

type PhaseId = (typeof modulePhases)[number]['id'];

interface Props {
  module: ModuleContent;
  activePhaseId: string;
  onPhaseChange: (id: string) => void;
  completedPhaseIds?: string[];
  postCheckPending?: boolean;
  compact?: boolean;
  showPhaseJump?: boolean;
  className?: string;
}

const phaseTasks: Record<PhaseId, { task: string; why: string; icon: IconName }> = {
  learn: {
    task: 'Build the normal-first read pattern before looking for pathology.',
    why: 'The goal is not to memorize findings first; it is to read every film the same way.',
    icon: 'book-open',
  },
  views: {
    task: 'Choose the views that answer the clinical question.',
    why: 'A missed view is often the first step in a missed diagnosis.',
    icon: 'eye',
  },
  images: {
    task: 'Call normal anatomy before comparing pathology.',
    why: 'Confidence comes from knowing what normal looks like on the views you actually order.',
    icon: 'image',
  },
  practice: {
    task: 'Commit to a diagnosis, next step, and confidence before feedback.',
    why: 'Cases should feel like clinic: decide first, then calibrate.',
    icon: 'clipboard',
  },
  quiz: {
    task: 'Test without coaching and review every explanation.',
    why: 'This is the check that tells you whether the read pattern is sticking.',
    icon: 'lightning',
  },
  takeaways: {
    task: 'Close the loop with the post-check and confidence rating.',
    why: 'This turns the module into measurable knowledge and readiness data.',
    icon: 'flag',
  },
};

export function ModuleNextTaskPanel({
  module,
  activePhaseId,
  onPhaseChange,
  completedPhaseIds = [],
  postCheckPending = false,
  compact = false,
  showPhaseJump = true,
  className = '',
}: Props) {
  const activeIndex = Math.max(
    0,
    modulePhases.findIndex((phase) => phase.id === activePhaseId),
  );
  const phase = modulePhases[activeIndex] ?? modulePhases[0];
  const next = modulePhases[activeIndex + 1];
  const previous = modulePhases[activeIndex - 1];
  const task = phaseTasks[phase.id];
  const completedPhaseIdSet = new Set(completedPhaseIds);
  const progressPercent = Math.round(((activeIndex + 1) / modulePhases.length) * 100);

  if (compact) {
    return (
      <section
        className={[
          'rounded-xl border border-ucla-100 bg-white/95 px-4 py-3 shadow-soft',
          className,
        ].join(' ')}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ucla-500 text-white shadow-soft">
              <Icon name={task.icon} size={16} />
            </span>
            <div className="min-w-0">
              <div className="section-title">Next step</div>
              <h2 className="mt-0.5 text-base text-ucla-950 sm:text-lg">
                {phase.label}: {task.task}
              </h2>
            </div>
          </div>

          {phase.id !== 'takeaways' ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => next && onPhaseChange(next.id)}
              disabled={!next}
            >
              {next ? `Next: ${next.label}` : 'Next'}
              <Icon name="arrow-right" size={14} />
            </button>
          ) : (
            <span
              className={[
                'pill',
                postCheckPending
                  ? 'border-gold-200 bg-gold-50 text-gold-900'
                  : 'border-emerald-100 bg-emerald-50 text-emerald-700',
              ].join(' ')}
            >
              <Icon name={postCheckPending ? 'flag' : 'check-circle'} size={14} />
              {postCheckPending ? 'Post-check pending' : 'Outcome saved'}
            </span>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={[
        'rounded-2xl border border-ucla-100 bg-white/95 p-4 shadow-soft sm:p-5',
        className,
      ].join(' ')}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ucla-500 text-white shadow-soft">
            <Icon name={task.icon} size={18} />
          </span>
          <div className="min-w-0">
            <div className="section-title">One task right now</div>
            <h2 className="mt-1 text-xl text-ucla-950 sm:text-2xl">
              {phase.label}: {module.shortTitle}
            </h2>
            <p className="mt-1 max-w-3xl text-sm font-semibold leading-relaxed text-slate-800">
              {task.task}
            </p>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
              {task.why}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => previous && onPhaseChange(previous.id)}
            disabled={!previous}
          >
            <Icon name="chevron-left" size={14} />
            {previous ? previous.label : 'Previous'}
          </button>
          {phase.id !== 'takeaways' && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => next && onPhaseChange(next.id)}
              disabled={!next}
            >
              {next ? `Next: ${next.label}` : 'Next'}
              <Icon name="arrow-right" size={14} />
            </button>
          )}
          {phase.id === 'takeaways' && (
            <span
              className={[
                'pill',
                postCheckPending
                  ? 'border-gold-200 bg-gold-50 text-gold-900'
                  : 'border-emerald-100 bg-emerald-50 text-emerald-700',
              ].join(' ')}
            >
              <Icon name={postCheckPending ? 'flag' : 'check-circle'} size={14} />
              {postCheckPending ? 'Post-check pending' : 'Outcome saved'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Phase {activeIndex + 1} of {modulePhases.length}
          </span>
          <span className="tabular-nums">{progressPercent}% through module path</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ucla-50 ring-1 ring-ucla-100">
          <div
            className="h-full rounded-full bg-ucla-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {showPhaseJump && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {modulePhases.map((candidate, index) => {
            const isActive = candidate.id === phase.id;
            const isComplete = completedPhaseIdSet.has(candidate.id);
            return (
              <button
                key={candidate.id}
                type="button"
                onClick={() => onPhaseChange(candidate.id)}
                aria-current={isActive ? 'step' : undefined}
                className={[
                  'flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors',
                  isActive
                    ? 'border-ucla-500 bg-ucla-500 text-white shadow-soft'
                    : isComplete
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-ucla-200 hover:bg-ucla-50 hover:text-ucla-900',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
                    isActive
                      ? 'bg-white/20 text-white'
                      : isComplete
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {isComplete ? <Icon name="check" size={12} /> : index + 1}
                </span>
                {candidate.label}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
