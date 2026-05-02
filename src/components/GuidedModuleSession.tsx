import { modulePhases } from '../data/learningFlow';
import type { ModuleContent } from '../types';
import { Icon, type IconName } from './ui/Icon';

type Phase = (typeof modulePhases)[number];
type PhaseId = Phase['id'];
type PhaseStatus = 'current' | 'complete' | 'ready' | 'next' | 'upcoming';

export interface GuidedModuleSessionProps {
  module: ModuleContent;
  activePhaseId: string;
  onPhaseChange: (id: string) => void;
  completedPhaseIds?: string[];
  readyPhaseIds?: string[];
  className?: string;
  postCheckPending?: boolean;
}

interface Recommendation {
  title: string;
  body: string;
  targetPhaseId: PhaseId;
  ctaLabel: string;
  checklist: string[];
}

const phaseIcons: Record<PhaseId, IconName> = {
  learn: 'book-open',
  views: 'eye',
  images: 'image',
  practice: 'clipboard',
  quiz: 'lightning',
  takeaways: 'flag',
};

const statusLabels: Record<PhaseStatus, string> = {
  current: 'Current',
  complete: 'Complete',
  ready: 'Ready',
  next: 'Next',
  upcoming: 'Upcoming',
};

const statusIcons: Record<PhaseStatus, IconName> = {
  current: 'play',
  complete: 'check-circle',
  ready: 'sparkles',
  next: 'arrow-right',
  upcoming: 'circle',
};

export function GuidedModuleSession({
  module,
  activePhaseId,
  onPhaseChange,
  completedPhaseIds = [],
  readyPhaseIds = [],
  className = '',
  postCheckPending = false,
}: GuidedModuleSessionProps) {
  const activePhase = normalizePhaseId(activePhaseId);
  const activeIndex = modulePhases.findIndex((phase) => phase.id === activePhase);
  const previousPhase = modulePhases[activeIndex - 1];
  const nextPhase = modulePhases[activeIndex + 1];
  const completedPhaseIdSet = new Set<string>(completedPhaseIds);
  const readyPhaseIdSet = new Set<string>(readyPhaseIds);
  const completedCount = modulePhases.filter((phase) => completedPhaseIdSet.has(phase.id)).length;
  const progressPercent = Math.round(((activeIndex + 1) / modulePhases.length) * 100);
  const recommendation = getRecommendation(module, activePhase, postCheckPending);

  return (
    <section
      className={[
        'overflow-hidden rounded-2xl border border-ucla-100 bg-gradient-to-br from-white via-ucla-50/80 to-sky-50/70 shadow-card',
        className,
      ].join(' ')}
    >
      <div className="border-b border-ucla-100/80 bg-white/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="section-title">Guided module session</div>
            <h2 className="mt-1 text-xl text-ucla-800 sm:text-2xl">
              {module.shortTitle} learner path
            </h2>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600">
              Work the module in a deliberate sequence, then jump to the right next action when
              your read is ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="pill-primary">
              <Icon name="clock" size={13} />
              {module.estimatedMinutes} min
            </span>
            <span className="pill border-ucla-100 bg-white/90 text-ucla-700">
              Phase {activeIndex + 1} of {modulePhases.length}
            </span>
            {postCheckPending && (
              <span className="pill-gold">
                <Icon name="flag" size={13} />
                Post-check pending
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-xs"
            onClick={() => previousPhase && onPhaseChange(previousPhase.id)}
            disabled={!previousPhase}
          >
            <Icon name="chevron-left" size={13} />
            {previousPhase ? previousPhase.label : 'Previous'}
          </button>
          <button
            type="button"
            className="btn-primary px-3 py-2 text-xs"
            onClick={() => onPhaseChange(recommendation.targetPhaseId)}
          >
            {recommendation.ctaLabel}
            <Icon name="chevron-right" size={13} />
          </button>
          {nextPhase && recommendation.targetPhaseId !== nextPhase.id && (
            <button
              type="button"
              className="btn-secondary px-3 py-2 text-xs"
              onClick={() => onPhaseChange(nextPhase.id)}
            >
              Next: {nextPhase.label}
              <Icon name="arrow-right" size={13} />
            </button>
          )}
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-ucla-100">
          <div
            className="h-full rounded-full bg-ucla-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] sm:p-5">
        <div>
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
            {modulePhases.map((phase, index) => {
              const status = getPhaseStatus({
                activePhase,
                completedPhaseIdSet,
                index,
                phase,
                readyPhaseIdSet,
                activeIndex,
              });
              const isCurrent = status === 'current';

              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => onPhaseChange(phase.id)}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Open ${phase.label} phase`}
                  className={[
                    'group flex min-h-[7rem] flex-col justify-between rounded-xl border p-3 text-left transition-colors',
                    isCurrent
                      ? 'border-ucla-300 bg-white text-ucla-800 shadow-card ring-1 ring-ucla-100'
                      : status === 'complete'
                        ? 'border-emerald-100 bg-emerald-50/80 text-emerald-900 hover:bg-emerald-50'
                        : status === 'ready'
                          ? 'border-ucla-200 bg-white/90 text-ucla-800 hover:bg-ucla-50'
                          : status === 'next'
                            ? 'border-gold-200 bg-white text-ucla-800 hover:bg-gold-50/80'
                            : 'border-slate-200 bg-white/75 text-slate-600 hover:bg-white',
                  ].join(' ')}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span
                      className={[
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                        isCurrent
                          ? 'border-ucla-300 bg-ucla-50 text-ucla-700'
                          : status === 'complete'
                            ? 'border-emerald-200 bg-white text-emerald-700'
                            : status === 'ready'
                              ? 'border-ucla-200 bg-ucla-50 text-ucla-700'
                              : status === 'next'
                                ? 'border-gold-200 bg-gold-50 text-gold-800'
                                : 'border-slate-200 bg-white text-slate-400',
                      ].join(' ')}
                    >
                      <Icon name={phaseIcons[phase.id]} size={17} />
                    </span>
                    <span
                      className={[
                        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                        isCurrent
                          ? 'border-ucla-100 bg-ucla-50 text-ucla-700'
                          : status === 'complete'
                            ? 'border-emerald-100 bg-white text-emerald-700'
                            : status === 'ready'
                              ? 'border-ucla-100 bg-white text-ucla-700'
                              : status === 'next'
                                ? 'border-gold-100 bg-gold-50 text-gold-800'
                                : 'border-slate-200 bg-white text-slate-500',
                      ].join(' ')}
                    >
                      <Icon name={statusIcons[status]} size={12} />
                      {statusLabels[status]}
                    </span>
                  </span>

                  <span className="mt-3 block">
                    <span className="block text-base font-semibold">{phase.label}</span>
                    <span className="mt-1 hidden text-sm leading-snug text-slate-600 sm:block">
                      {getPhaseMicrocopy(module, phase.id)}
                    </span>
                  </span>

                  <span
                    className={[
                      'mt-3 inline-flex items-center gap-1.5 text-xs font-semibold',
                      isCurrent ? 'text-ucla-700' : 'text-slate-500 group-hover:text-ucla-700',
                    ].join(' ')}
                  >
                    {status === 'complete' ? 'Review phase' : 'Open phase'}
                    <Icon name="arrow-right" size={12} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-xl border border-ucla-100 bg-white/90 p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ucla-100 bg-ucla-50 text-ucla-700">
              <Icon name="sparkles" size={18} />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
                Next best step
              </div>
              <h3 className="mt-1 text-lg text-ucla-800">{recommendation.title}</h3>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">{recommendation.body}</p>

          <div className="mt-4 space-y-2">
            {recommendation.checklist.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <Icon name="check" size={14} className="mt-0.5 shrink-0 text-ucla-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => onPhaseChange(recommendation.targetPhaseId)}
            >
              {recommendation.ctaLabel}
              <Icon name="chevron-right" size={14} />
            </button>
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => onPhaseChange(activePhase)}
            >
              Review current phase
              <Icon name={phaseIcons[activePhase]} size={14} />
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-ucla-100 bg-ucla-50/80 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Session signal
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="font-semibold text-ucla-800">{completedCount}</div>
                <div className="text-xs text-slate-500">Completed phases</div>
              </div>
              <div>
                <div className="font-semibold text-ucla-800">{readyPhaseIds.length}</div>
                <div className="text-xs text-slate-500">Ready phases</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function normalizePhaseId(activePhaseId: string): PhaseId {
  const phase = modulePhases.find((candidate) => candidate.id === activePhaseId);
  return phase?.id ?? 'learn';
}

function getPhaseStatus({
  activePhase,
  activeIndex,
  completedPhaseIdSet,
  index,
  phase,
  readyPhaseIdSet,
}: {
  activePhase: PhaseId;
  activeIndex: number;
  completedPhaseIdSet: Set<string>;
  index: number;
  phase: Phase;
  readyPhaseIdSet: Set<string>;
}): PhaseStatus {
  if (phase.id === activePhase) return 'current';
  if (completedPhaseIdSet.has(phase.id)) return 'complete';
  if (readyPhaseIdSet.has(phase.id)) return 'ready';
  if (index === activeIndex + 1) return 'next';
  return 'upcoming';
}

function getPhaseMicrocopy(module: ModuleContent, phaseId: PhaseId): string {
  if (phaseId === 'learn') return `${module.overview.length} overview goals and core framing.`;
  if (phaseId === 'views') return `${module.views.length} view choices tied to clinical intent.`;
  if (phaseId === 'images') return `${module.anatomy.length} landmarks plus normal-pathology contrasts.`;
  if (phaseId === 'practice') return `${module.cases.length} case reps for committing before feedback.`;
  if (phaseId === 'quiz') return `${module.quiz.length} questions to test transfer.`;
  return `${module.keyTakeaways.length} takeaways with escalation rules.`;
}

function getRecommendation(
  module: ModuleContent,
  activePhase: PhaseId,
  postCheckPending: boolean,
): Recommendation {
  if (activePhase === 'learn') {
    return {
      title: 'Move from framing to view selection',
      body: `Start ${module.shortTitle} by naming the normal-first read, then choose the views that answer the clinical question.`,
      targetPhaseId: 'views',
      ctaLabel: 'Go to Views',
      checklist: [
        'Read the module goals before interpreting images.',
        'Keep escalation triggers visible while you work.',
        'Use the next phase to connect symptoms to radiographic views.',
      ],
    };
  }

  if (activePhase === 'views') {
    return {
      title: 'Pair each view with what it proves',
      body: `${module.shortTitle} includes ${module.views.length} view prompts. Use them to decide what you need before looking for pathology.`,
      targetPhaseId: 'images',
      ctaLabel: 'Go to Images',
      checklist: [
        'Name the view that best answers the mechanism.',
        'Notice when weightbearing, comparison, or special views matter.',
        'Carry the view decision into anatomy review.',
      ],
    };
  }

  if (activePhase === 'images') {
    return {
      title: 'Turn image review into a committed read',
      body: `After landmarks and pitfalls, use ${module.cases.length} case ${pluralize(module.cases.length, 'rep')} to make the read active.`,
      targetPhaseId: 'practice',
      ctaLabel: 'Go to Practice',
      checklist: [
        'Compare normal anatomy against key pathology clues.',
        'Call out the pitfall before you look at feedback.',
        'Commit to an impression and next step in practice.',
      ],
    };
  }

  if (activePhase === 'practice') {
    return {
      title: 'Pressure-test the module without coaching',
      body: `Use the quiz to check whether ${module.shortTitle} is ready outside the case walkthrough.`,
      targetPhaseId: 'quiz',
      ctaLabel: 'Go to Quiz',
      checklist: [
        'Finish the case impression before moving on.',
        'Name what would change management or imaging.',
        'Use missed questions to choose a phase to revisit.',
      ],
    };
  }

  if (activePhase === 'quiz') {
    return {
      title: 'Close the loop while recall is fresh',
      body: `${module.quiz.length} quiz ${pluralize(module.quiz.length, 'question')} should point you toward the final takeaways and remaining post-check work.`,
      targetPhaseId: 'takeaways',
      ctaLabel: 'Go to Takeaways',
      checklist: [
        'Review the explanation for each missed concept.',
        'Turn uncertainty into one specific takeaway.',
        'Finish with escalation and next-step language.',
      ],
    };
  }

  return {
    title: postCheckPending ? 'Finish the post-check' : 'Lock in the clinical takeaways',
    body: postCheckPending
      ? `Complete the ${module.shortTitle} post-check while the read sequence is still fresh.`
      : `Use the closing points to make ${module.shortTitle} easier to recall during clinic.`,
    targetPhaseId: 'takeaways',
    ctaLabel: postCheckPending ? 'Open Post-check' : 'Review Takeaways',
    checklist: [
      'Restate the highest-yield normal-first habit.',
      'Save one escalation trigger you will use in clinic.',
      'Choose the next module only after the post-check is clear.',
    ],
  };
}

function pluralize(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`;
}
