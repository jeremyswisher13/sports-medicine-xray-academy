import { useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import { modulePhases } from '../data/learningFlow';
import type { CaseScenario, ImagingView, ModuleContent, PathologyComparison } from '../types';

type PhaseId = (typeof modulePhases)[number]['id'];

interface ChallengeOption {
  id: string;
  text: string;
}

interface PhaseChallenge {
  eyebrow: string;
  title: string;
  question: string;
  options: ChallengeOption[];
  correctOptionId: string;
  explanation: string;
  coaching: string[];
  confidencePrompt: string;
  exitCriteria: string[];
}

interface CoachState {
  answers: Record<string, string>;
  confidence: Record<string, number>;
  mastered: Record<string, boolean>;
}

interface Props {
  module: ModuleContent;
  activePhaseId: string;
  onPhaseChange: (id: string) => void;
  className?: string;
}

const defaultState: CoachState = {
  answers: {},
  confidence: {},
  mastered: {},
};

export function ModuleActiveLearningCoach({
  module,
  activePhaseId,
  onPhaseChange,
  className = '',
}: Props) {
  const phaseId = normalizePhaseId(activePhaseId);
  const phaseIndex = modulePhases.findIndex((phase) => phase.id === phaseId);
  const nextPhase = modulePhases[phaseIndex + 1];
  const challenge = useMemo(() => buildChallenge(module, phaseId), [module, phaseId]);
  const [state, setState] = useState<CoachState>(() => readCoachState(module.id));
  const selectedOptionId = state.answers[phaseId];
  const selectedConfidence = state.confidence[phaseId];
  const mastered = Boolean(state.mastered[phaseId]);
  const answered = selectedOptionId !== undefined;
  const correct = selectedOptionId === challenge.correctOptionId;

  function persist(next: CoachState) {
    try {
      localStorage.setItem(`sxra:module-coach:${module.id}`, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function updateState(updater: (prev: CoachState) => CoachState) {
    setState((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }

  function answer(optionId: string) {
    updateState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [phaseId]: optionId },
      mastered: { ...prev.mastered, [phaseId]: false },
    }));
  }

  function setConfidence(value: number) {
    updateState((prev) => ({
      ...prev,
      confidence: { ...prev.confidence, [phaseId]: value },
      mastered: { ...prev.mastered, [phaseId]: false },
    }));
  }

  function markMastered() {
    updateState((prev) => ({
      ...prev,
      mastered: { ...prev.mastered, [phaseId]: true },
    }));
  }

  return (
    <section
      className={[
        'rounded-2xl border border-ucla-100 bg-white p-4 shadow-card sm:p-5',
        className,
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
            Active learning coach
          </div>
          <h2 className="mt-1 text-lg text-ucla-900">{challenge.title}</h2>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600">
            Answer first, then use the coaching to calibrate what you know.
          </p>
        </div>
        <span
          className={[
            'pill',
            mastered
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : answered
                ? 'border-ucla-100 bg-ucla-50 text-ucla-800'
                : 'border-slate-200 bg-slate-50 text-slate-600',
          ].join(' ')}
        >
          <Icon name={mastered ? 'check-circle' : answered ? 'sparkles' : 'circle'} size={14} />
          {mastered ? 'Phase mastered' : answered ? 'Committed' : 'Commit first'}
        </span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ucla-900">
            <Icon name="lightning" size={16} className="text-ucla-700" />
            {challenge.eyebrow}
          </div>
          <p className="mt-3 text-base font-semibold leading-snug text-slate-950">
            {challenge.question}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {challenge.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOption = option.id === challenge.correctOptionId;
              const revealCorrect = answered && isCorrectOption;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => answer(option.id)}
                  className={[
                    'flex min-h-[4rem] items-start gap-2.5 rounded-2xl border p-3 text-left text-sm font-semibold leading-snug transition-colors',
                    revealCorrect
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : isSelected
                        ? 'border-amber-200 bg-amber-50 text-amber-950'
                        : 'border-white bg-white text-slate-700 shadow-soft hover:border-ucla-200 hover:bg-ucla-50',
                  ].join(' ')}
                  aria-pressed={isSelected}
                >
                  <span
                    className={[
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                      revealCorrect
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : isSelected
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : 'border-slate-300 bg-white text-transparent',
                    ].join(' ')}
                  >
                    <Icon name={revealCorrect ? 'check' : isSelected ? 'alert' : 'check'} size={12} />
                  </span>
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={[
                'mt-4 rounded-2xl border p-3',
                correct ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
              ].join(' ')}
            >
              <div
                className={[
                  'flex items-center gap-2 text-sm font-semibold',
                  correct ? 'text-emerald-900' : 'text-amber-950',
                ].join(' ')}
              >
                <Icon name={correct ? 'check-circle' : 'alert'} size={16} />
                {correct ? 'Good clinical read' : 'Re-calibrate before moving on'}
              </div>
              <p
                className={[
                  'mt-1 text-sm leading-relaxed',
                  correct ? 'text-emerald-900' : 'text-amber-950',
                ].join(' ')}
              >
                {challenge.explanation}
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-ucla-100 bg-gradient-to-br from-ucla-50 via-white to-sky-50 p-4">
          <div className="text-sm font-semibold text-ucla-900">Phase exit check</div>
          <ul className="mt-3 space-y-2">
            {challenge.exitCriteria.map((criterion) => (
              <li key={criterion} className="flex items-start gap-2 text-sm text-slate-700">
                <Icon name="check" size={14} className="mt-0.5 text-ucla-700" />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>

          {answered && (
            <div className="mt-4 rounded-2xl border border-white bg-white/85 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
                Coaching
              </div>
              <ul className="mt-2 space-y-1.5">
                {challenge.coaching.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-slate-700">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <div className="label">{challenge.confidencePrompt}</div>
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setConfidence(value)}
                  className={[
                    'h-9 rounded-xl border text-sm font-bold transition-colors',
                    selectedConfidence === value
                      ? 'border-ucla-700 bg-ucla-700 text-white'
                      : 'border-ucla-100 bg-white text-ucla-800 hover:bg-ucla-50',
                  ].join(' ')}
                  aria-pressed={selectedConfidence === value}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={markMastered}
              disabled={!answered || selectedConfidence === undefined}
            >
              <Icon name="check-circle" size={14} />
              Mark phase ready
            </button>
            {nextPhase && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onPhaseChange(nextPhase.id)}
              >
                Next: {nextPhase.label}
                <Icon name="chevron-right" size={14} />
              </button>
            )}
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

function readCoachState(moduleId: string): CoachState {
  try {
    const raw = localStorage.getItem(`sxra:module-coach:${moduleId}`);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<CoachState>;
    return {
      answers: parsed.answers ?? {},
      confidence: parsed.confidence ?? {},
      mastered: parsed.mastered ?? {},
    };
  } catch {
    return defaultState;
  }
}

function buildChallenge(module: ModuleContent, phaseId: PhaseId): PhaseChallenge {
  if (phaseId === 'views') return buildViewChallenge(module);
  if (phaseId === 'images') return buildImageChallenge(module);
  if (phaseId === 'practice') return buildPracticeChallenge(module);
  if (phaseId === 'quiz') return buildQuizReadinessChallenge(module);
  if (phaseId === 'takeaways') return buildTakeawaysChallenge(module);
  return buildLearnChallenge(module);
}

function buildLearnChallenge(module: ModuleContent): PhaseChallenge {
  return {
    eyebrow: 'Orientation commitment',
    title: `Make ${module.shortTitle} active from the start`,
    question: `Before leaving ${module.shortTitle}, what should you be able to do?`,
    options: [
      option('framework', 'Use a normal-first Systematic X-Ray Read and decide what needs escalation.'),
      option('memorize', 'Memorize pathology names without practicing the read sequence.'),
      option('skip-normal', 'Skip normal anatomy and focus only on obvious fractures.'),
      option('mri-default', 'Recommend advanced imaging before making an x-ray impression.'),
    ],
    correctOptionId: 'framework',
    explanation:
      'The goal is a repeatable read pattern: know normal, identify the key abnormal clue, and decide the safest next step.',
    coaching: takeOrFallback(module.overview, [
      'Start with normal anatomy before pathology.',
      'Use the same read sequence every time.',
    ]),
    confidencePrompt: 'How ready are you to start this module?',
    exitCriteria: [
      'I know why this module matters clinically.',
      'I can name the module emphasis areas.',
      'I know what findings should trigger escalation.',
    ],
  };
}

function buildViewChallenge(module: ModuleContent): PhaseChallenge {
  const target = module.views[0];
  if (!target) {
    return {
      eyebrow: 'View selection',
      title: 'Choose views from the clinical question',
      question: 'What is the best habit before interpreting a musculoskeletal x-ray?',
      options: [
        option('confirm-views', 'Confirm the views are adequate for the clinical question.'),
        option('single-view', 'Trust one view if the finding looks obvious.'),
        option('skip-view', 'Ignore view adequacy and start with the impression.'),
        option('mri', 'Assume MRI is required before reading the x-ray.'),
      ],
      correctOptionId: 'confirm-views',
      explanation:
        'View selection controls what you can safely see. Inadequate views can hide instability, subtle fracture, and joint-space disease.',
      coaching: module.systematicNotes.slice(0, 3),
      confidencePrompt: 'How confident are you choosing views?',
      exitCriteria: [
        'I can connect each view to a clinical reason.',
        'I know when extra or weightbearing views matter.',
        'I can say when the series is not enough.',
      ],
    };
  }

  const options = makeViewOptions(module.views, target);
  return {
    eyebrow: 'View selection challenge',
    title: 'Order the view with intent',
    question: `Which view best fits this reason: ${target.whenToOrder}`,
    options,
    correctOptionId: idFor(target.name),
    explanation: target.why,
    coaching: module.views.slice(0, 3).map((view) => `${view.name}: ${view.why}`),
    confidencePrompt: 'How confident are you choosing views?',
    exitCriteria: [
      'I can name the standard views.',
      'I can explain what each view adds.',
      'I can recognize when the ordered views are inadequate.',
    ],
  };
}

function buildImageChallenge(module: ModuleContent): PhaseChallenge {
  const pathology = module.pathology[0];
  if (pathology) return pathologyChallenge(module, pathology);

  const landmark = module.anatomy[0];
  return {
    eyebrow: 'Normal-first challenge',
    title: 'Anchor normal before abnormal',
    question: 'Which item belongs on the normal-first checklist for this module?',
    options: [
      option('landmark', landmark?.label ?? 'Expected alignment, cortex, joint space, and soft tissues'),
      option('diagnosis', 'The final diagnosis before the read sequence'),
      option('mri', 'The MRI protocol before x-ray review'),
      option('rare', 'Rare pathology names before common normal anatomy'),
    ],
    correctOptionId: 'landmark',
    explanation:
      landmark?.description ??
      'A confident x-ray read starts by recognizing expected normal anatomy, then comparing subtle abnormalities against that anchor.',
    coaching: takeOrFallback(
      module.anatomy.map((item) => `${item.label}: ${item.description}`),
      ['Read normal anatomy before pathology.', 'Use landmarks to avoid missing subtle malalignment.'],
    ),
    confidencePrompt: 'How confident are you recognizing normal?',
    exitCriteria: [
      'I can identify the normal landmarks.',
      'I can compare normal against common pathology.',
      'I can name the clue that changes management.',
    ],
  };
}

function pathologyChallenge(
  module: ModuleContent,
  pathology: PathologyComparison,
): PhaseChallenge {
  return {
    eyebrow: 'Normal vs pathology',
    title: 'Spot the decisive clue',
    question: `What is the key clue for ${pathology.finding}?`,
    options: [
      option('key-clue', pathology.keyClue),
      option('pitfall', pathology.pitfall),
      option('normal', pathology.normal),
      option('next-step', pathology.nextStep),
    ],
    correctOptionId: 'key-clue',
    explanation: `Compare against normal: ${pathology.normal} Pathologic pattern: ${pathology.pathologic}`,
    coaching: takeOrFallback(
      module.pathology.slice(0, 3).map((item) => `${item.finding}: ${item.keyClue}`),
      module.systematicNotes,
    ),
    confidencePrompt: 'How confident are you distinguishing normal from pathology?',
    exitCriteria: [
      'I can identify normal anatomy first.',
      'I can name the key abnormal clue.',
      'I can avoid the common pitfall.',
    ],
  };
}

function buildPracticeChallenge(module: ModuleContent): PhaseChallenge {
  const scenario = module.cases[0];
  if (scenario) return caseChallenge(scenario);

  const doNotMiss = module.doNotMiss[0];
  return {
    eyebrow: 'Practice commitment',
    title: 'Make a management-safe read',
    question: doNotMiss
      ? `Why is ${doNotMiss.title} a do-not-miss finding?`
      : 'What should you commit to before looking at case feedback?',
    options: [
      option('safe-read', doNotMiss?.why ?? 'A diagnosis, key negative, confidence rating, and next step.'),
      option('wait', 'Wait for the explanation before making an impression.'),
      option('guess', 'Guess quickly without using the systematic read.'),
      option('ignore', 'Ignore next steps if the x-ray is abnormal.'),
    ],
    correctOptionId: 'safe-read',
    explanation:
      doNotMiss?.imagingNext ??
      'Case practice works best when the learner commits first, then compares their read to feedback.',
    coaching: takeOrFallback(
      module.doNotMiss.slice(0, 3).map((item) => `${item.title}: ${item.imagingNext}`),
      module.whenToEscalate,
    ),
    confidencePrompt: 'How confident are you applying this in cases?',
    exitCriteria: [
      'I can commit to an impression before feedback.',
      'I can explain the next step.',
      'I can identify do-not-miss patterns.',
    ],
  };
}

function caseChallenge(scenario: CaseScenario): PhaseChallenge {
  return {
    eyebrow: 'Case warm-up',
    title: 'Commit before the reveal',
    question: `${scenario.patientAge} ${scenario.sportOrActivity}: ${scenario.mechanism} Which impression is most likely?`,
    options: scenario.diagnosisOptions.map((item) => option(item.id, item.label)),
    correctOptionId: scenario.correctOptionId,
    explanation: scenario.explanation,
    coaching: [scenario.teachingPearl, `Next step: ${scenario.nextStep}`],
    confidencePrompt: 'How confident are you making a case impression?',
    exitCriteria: [
      'I can state the likely diagnosis.',
      'I can name the imaging clue.',
      'I can choose the next step.',
    ],
  };
}

function buildQuizReadinessChallenge(module: ModuleContent): PhaseChallenge {
  return {
    eyebrow: 'Quiz readiness',
    title: 'Test without the training wheels',
    question: `What should be true before you submit the ${module.shortTitle} module quiz?`,
    options: [
      option('ready', 'I can answer from the read pattern first, then use feedback to calibrate.'),
      option('peek', 'I should reveal explanations before choosing an answer.'),
      option('memory', 'I only need to remember one classic finding.'),
      option('skip', 'I can skip confidence because only score matters.'),
    ],
    correctOptionId: 'ready',
    explanation:
      'The quiz should measure whether the read pattern is usable. Commit to each answer before using feedback.',
    coaching: takeOrFallback(module.keyTakeaways, module.systematicNotes),
    confidencePrompt: 'How ready are you for the module quiz?',
    exitCriteria: [
      'I can answer without immediate coaching.',
      'I can explain why wrong choices are wrong.',
      'I can identify what to review if I miss a question.',
    ],
  };
}

function buildTakeawaysChallenge(module: ModuleContent): PhaseChallenge {
  return {
    eyebrow: 'Post-check loop',
    title: 'Close the learning loop',
    question: `What is the best final step for ${module.shortTitle}?`,
    options: [
      option('post-check', 'Complete the post-check and confidence rating, then review weak areas.'),
      option('leave', 'Leave after reading the takeaways without measuring confidence.'),
      option('only-score', 'Focus only on the score and ignore confidence calibration.'),
      option('restart', 'Restart the whole course instead of targeted review.'),
    ],
    correctOptionId: 'post-check',
    explanation:
      'The module is strongest when knowledge and confidence are both measured before and after learning.',
    coaching: takeOrFallback(module.keyTakeaways, module.whenToEscalate),
    confidencePrompt: 'How confident are you that you can read this x-ray type?',
    exitCriteria: [
      'I can summarize the key takeaways.',
      'I can complete the post-check.',
      'I know what to review next.',
    ],
  };
}

function makeViewOptions(views: ImagingView[], target: ImagingView): ChallengeOption[] {
  const viewOptions = views.slice(0, 4).map((view) => option(idFor(view.name), view.name));
  if (viewOptions.length >= 2) return ensureIncludesCorrect(viewOptions, option(idFor(target.name), target.name));
  return [
    option(idFor(target.name), target.name),
    option('single-ap', 'Single AP view only'),
    option('mri-first', 'MRI before x-ray review'),
    option('unrelated', 'Unrelated contralateral comparison only'),
  ];
}

function ensureIncludesCorrect(
  options: ChallengeOption[],
  correctOption: ChallengeOption,
): ChallengeOption[] {
  if (options.some((item) => item.id === correctOption.id)) return options;
  return [correctOption, ...options].slice(0, 4);
}

function takeOrFallback(items: string[], fallback: string[]) {
  const combined = items.length > 0 ? items : fallback;
  return combined.slice(0, 3);
}

function option(id: string, text: string): ChallengeOption {
  return { id, text };
}

function idFor(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
