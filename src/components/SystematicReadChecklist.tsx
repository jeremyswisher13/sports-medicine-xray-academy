import { useEffect, useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import { useAuth } from '../context/AuthContext';
import { ids, logAuditEvent, saveQuizAttempt } from '../services/firestore';
import type { SystematicChecklistItem } from '../types';

type SystematicStep = SystematicChecklistItem['step'];
type StudyMode = 'challenge' | 'checklist';

interface StepChallengeOption {
  id: string;
  text: string;
}

interface StepChallenge {
  question: string;
  options: StepChallengeOption[];
  correctOptionId: string;
  explanation: string;
}

interface StepGuidance {
  learnerPrompt: string;
  normalAnchor: string;
  challenge: StepChallenge;
  coaching: string[];
  pitfall: string;
}

interface Props {
  items: SystematicChecklistItem[];
  storageKey?: string;
  onChangeChecked?: (checkedKeys: string[]) => void;
  defaultExpandedAll?: boolean;
}

const stepGuidance: Record<SystematicStep, StepGuidance> = {
  Confirm: {
    learnerPrompt:
      'Before looking for pathology, make sure the study can answer the clinical question.',
    normalAnchor:
      'A usable study has the correct patient, correct side, appropriate date, adequate views, and enough quality to assess cortex and alignment.',
    challenge: {
      question: 'Before interpretation, which finding should stop you first?',
      options: [
        { id: 'degenerative-change', text: 'Mild degenerative change that may be chronic' },
        { id: 'study-problem', text: 'Wrong side, wrong view, or inadequate image quality' },
        { id: 'small-osteophyte', text: 'A small osteophyte at the joint margin' },
        { id: 'accessory-ossicle', text: 'A smooth incidental accessory ossicle' },
      ],
      correctOptionId: 'study-problem',
      explanation:
        'Confirming the study first prevents wrong-side, wrong-view, and incomplete-series misses before the diagnostic read begins.',
    },
    coaching: [
      'Name the view out loud before interpreting it.',
      'Ask whether the requested view matches the suspected injury.',
      'Decide whether image quality is good enough to trust subtle findings.',
    ],
    pitfall: 'Many missed injuries start as a wrong-side, wrong-view, or incomplete-series problem.',
  },
  Alignment: {
    learnerPrompt:
      'Start wide. Decide whether the bones and joints still line up before hunting for tiny fractures.',
    normalAnchor:
      'Joint surfaces should be congruent, long axes should make sense, and expected alignment lines should be smooth.',
    challenge: {
      question: 'A tiny avulsion fragment near a joint should make you look hardest for what?',
      options: [
        { id: 'normal-variant', text: 'A benign normal variant with no instability concern' },
        { id: 'instability', text: 'Occult subluxation, dislocation, or ligament injury pattern' },
        { id: 'cartilage-only', text: 'Isolated cartilage loss as the primary explanation' },
        { id: 'growth-plate', text: 'A normal growth plate in every adult patient' },
      ],
      correctOptionId: 'instability',
      explanation:
        'Small avulsions often point to a larger alignment or instability problem. Read the joint relationship before chasing the fragment alone.',
    },
    coaching: [
      'Check every joint on the film, not only the painful one.',
      'Look for subtle widening, overlap, step-off, or translation.',
      'In children, compare the physis and epiphysis for symmetry.',
    ],
    pitfall: 'A tiny avulsion fragment can be the clue to a larger instability pattern.',
  },
  Bone: {
    learnerPrompt:
      'Trace the cortex around every bone on every view. Do not jump to the obvious finding too early.',
    normalAnchor:
      'Cortex should be continuous, trabeculae should be smooth, and bone density should fit the patient context.',
    challenge: {
      question: 'You see a possible cortical break on only one view. What is the best next habit?',
      options: [
        { id: 'ignore-one-view', text: 'Ignore it because it appears on only one view' },
        { id: 'trace-cortex', text: 'Trace the cortex on every view and seek corroborating signs' },
        { id: 'artifact', text: 'Assume artifact unless the fracture is displaced' },
        { id: 'skip-impression', text: 'Skip ahead to the impression and avoid uncertainty' },
      ],
      correctOptionId: 'trace-cortex',
      explanation:
        'Nondisplaced fractures can be subtle. Trace the full cortex, compare views, and look for swelling, sclerosis, or periosteal reaction.',
    },
    coaching: [
      'Trace one bone at a time all the way around.',
      'Confirm suspected breaks on a second view when possible.',
      'Separate smooth corticated variants from sharp acute fragments.',
    ],
    pitfall: 'Stress injuries and nondisplaced fractures may show only sclerosis, periosteal reaction, or a very subtle cortical wrinkle.',
  },
  Cartilage: {
    learnerPrompt:
      'Now read the joint spaces and subchondral bone as a pattern, not as isolated findings.',
    normalAnchor:
      'Joint spaces should be preserved for age and loading, with no unexpected narrowing, sclerosis, cysts, or osteophytes.',
    challenge: {
      question: 'Which view choice best tests load-dependent joint-space narrowing or instability?',
      options: [
        { id: 'non-weightbearing', text: 'Non-weightbearing views only' },
        { id: 'weightbearing', text: 'Weightbearing views when safe and appropriate' },
        { id: 'ultrasound', text: 'Soft tissue ultrasound as the first x-ray substitute' },
        { id: 'ap-only', text: 'One AP view if the first image is easy to obtain' },
      ],
      correctOptionId: 'weightbearing',
      explanation:
        'Joint-space narrowing and instability can be underestimated without loading. Weightbearing views often make the clinically relevant pattern visible.',
    },
    coaching: [
      'Compare medial versus lateral compartments when relevant.',
      'Use weightbearing views when joint space or instability is the question.',
      'Decide whether degenerative findings explain the symptoms or are incidental.',
    ],
    pitfall: 'A normal non-weightbearing joint space can hide clinically important narrowing or instability.',
  },
  'Soft Tissues': {
    learnerPrompt:
      'Treat soft tissues as evidence. Swelling and fat-pad signs often tell you where to look again.',
    normalAnchor:
      'Soft tissue contours and fat planes should be smooth and symmetric, without focal swelling, gas, foreign body, or abnormal calcification.',
    challenge: {
      question: 'Bone looks normal, but swelling or effusion is focal and convincing. What should you do?',
      options: [
        { id: 'dismiss', text: 'Dismiss it because no fracture line is visible' },
        { id: 'recheck', text: 'Raise suspicion for occult injury and re-check bone and alignment' },
        { id: 'arthritis', text: 'Diagnose arthritis without matching the clinical story' },
        { id: 'ignore-report', text: 'Ignore the finding if the radiology report is negative' },
      ],
      correctOptionId: 'recheck',
      explanation:
        'Soft tissue findings are diagnostic clues. Focal swelling, effusion, or fat-pad change should send you back through the read for occult injury.',
    },
    coaching: [
      'Match swelling location to the suspected ligament, tendon, or fracture site.',
      'Use effusion as an occult-fracture clue.',
      'Look for calcification at tendon insertions and around joints.',
    ],
    pitfall: 'If the bone looks normal but swelling is focal and convincing, keep your suspicion high.',
  },
  Impression: {
    learnerPrompt:
      'Close the loop: give the most likely read, the important negatives, and the next step if the x-ray is not enough.',
    normalAnchor:
      'A strong impression answers the clinical question and says what still needs escalation or follow-up.',
    challenge: {
      question: 'Which impression structure is most useful in sports medicine?',
      options: [
        { id: 'diagnosis-only', text: 'Diagnosis only, with no management context' },
        { id: 'rare-list', text: 'A long list of rare diagnoses to sound complete' },
        {
          id: 'actionable',
          text: 'Most likely read, key negatives, clinical correlation, and next step',
        },
        { id: 'mri-everything', text: 'Recommend MRI for every painful radiograph' },
      ],
      correctOptionId: 'actionable',
      explanation:
        'A useful impression is actionable. It names the likely read, protects the important negatives, and gives the next step when suspicion remains high.',
    },
    coaching: [
      'Lead with the diagnosis or the key negative.',
      'Name the one finding that would change management.',
      'State the next imaging step when clinical suspicion remains high.',
    ],
    pitfall: 'A vague impression is hard to act on. Be explicit about uncertainty and what should happen next.',
  },
};

function promptKey(step: SystematicStep, prompt: string) {
  return `${step}:${prompt}`;
}

const modeLabels: Record<StudyMode, string> = {
  challenge: 'Challenge',
  checklist: 'Checklist',
};

function readCheckedState(storageKey?: string): Set<string> {
  if (!storageKey) return new Set();
  try {
    const raw = localStorage.getItem(`sxra:checklist:${storageKey}`);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    // ignore
  }
  return new Set();
}

function readChallengeAnswers(storageKey?: string): Record<string, string> {
  if (!storageKey) return {};
  try {
    const raw = localStorage.getItem(`sxra:read-challenges:${storageKey}`);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {
    // ignore
  }
  return {};
}

export function SystematicReadChecklist({
  items,
  storageKey,
  onChangeChecked,
  defaultExpandedAll = false,
}: Props) {
  const { user, learnerPreview } = useAuth();
  const [checked, setChecked] = useState<Set<string>>(() => readCheckedState(storageKey));
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>(() =>
    readChallengeAnswers(storageKey),
  );
  const [mode, setMode] = useState<StudyMode>(() => (defaultExpandedAll ? 'checklist' : 'challenge'));
  const [activeStep, setActiveStep] = useState<SystematicStep | null>(() => items[0]?.step ?? null);

  useEffect(() => {
    setChecked(readCheckedState(storageKey));
    setChallengeAnswers(readChallengeAnswers(storageKey));
    setMode(defaultExpandedAll ? 'checklist' : 'challenge');
    setActiveStep(items[0]?.step ?? null);
  }, [defaultExpandedAll, items, storageKey]);

  const totalPrompts = useMemo(
    () => items.reduce((acc, i) => acc + i.prompts.length, 0),
    [items],
  );
  const completedCount = useMemo(
    () =>
      items.reduce(
        (acc, item) =>
          acc + item.prompts.filter((prompt) => checked.has(promptKey(item.step, prompt))).length,
        0,
      ),
    [checked, items],
  );
  const completionPercent = totalPrompts > 0 ? Math.round((completedCount / totalPrompts) * 100) : 0;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.step === activeStep),
  );
  const activeItem = items[activeIndex] ?? items[0];

  function persistChecked(next: Set<string>) {
    const arr = Array.from(next);
    if (storageKey) {
      try {
        localStorage.setItem(`sxra:checklist:${storageKey}`, JSON.stringify(arr));
      } catch {
        // ignore
      }
    }
    onChangeChecked?.(arr);
  }

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      persistChecked(next);
      return next;
    });
  }

  function answerChallenge(step: SystematicStep, optionId: string) {
    const stepChallenge = stepGuidance[step].challenge;
    const correct = optionId === stepChallenge.correctOptionId;
    setChallengeAnswers((prev) => {
      const next = { ...prev, [step]: optionId };
      if (storageKey) {
        try {
          localStorage.setItem(`sxra:read-challenges:${storageKey}`, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
    if (user && storageKey && !learnerPreview) {
      const now = Date.now();
      void saveQuizAttempt({
        id: ids.newId(),
        userId: user.uid,
        scope: 'systematic-read',
        moduleId: storageKey,
        startedAt: now,
        submittedAt: now,
        answers: [
          {
            questionId: `${storageKey}:${step}:systematic-read`,
            selectedOptionId: optionId,
            correct,
          },
        ],
        scorePercent: correct ? 100 : 0,
      });
      void logAuditEvent({
        userId: user.uid,
        type: 'systematic_read_step_answered',
        moduleId: storageKey,
        refId: step,
        details: { step, correct },
      });
    }
  }

  function goToStep(index: number) {
    const next = items[index];
    if (next) setActiveStep(next.step);
  }

  function stepComplete(item: SystematicChecklistItem) {
    return item.prompts.every((prompt) => checked.has(promptKey(item.step, prompt)));
  }

  function stepCheckedCount(item: SystematicChecklistItem) {
    return item.prompts.filter((prompt) => checked.has(promptKey(item.step, prompt))).length;
  }

  if (!activeItem) return null;

  const guidance = stepGuidance[activeItem.step];
  const activeCheckedCount = stepCheckedCount(activeItem);
  const activeChallenge = guidance.challenge;
  const activeAnswer = challengeAnswers[activeItem.step];
  const activeAnswerIsCorrect = activeAnswer === activeChallenge.correctOptionId;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ucla-100 bg-gradient-to-br from-ucla-50 via-white to-sky-50 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="section-title">Systematic Read Challenges</div>
            <p className="mt-1 text-xs text-slate-600">
              Confirm → Alignment → Bone → Cartilage → Soft Tissues → Impression
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['challenge', 'checklist'] as StudyMode[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={[
                  'rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors',
                  mode === option
                    ? 'border-ucla-700 bg-ucla-700 text-white shadow-soft'
                    : 'border-ucla-100 bg-white text-ucla-800 hover:border-ucla-200 hover:bg-ucla-50',
                ].join(' ')}
              >
                {modeLabels[option]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{completionPercent}% inspected</span>
            <span className="tabular-nums">
              {completedCount} / {totalPrompts}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-ucla-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ucla-600 to-gold-500 transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {mode === 'challenge' ? (
        <div className="grid gap-0 xl:grid-cols-[220px_1fr]">
          <nav className="border-b border-ucla-100 bg-slate-50/70 p-3 xl:border-b-0 xl:border-r">
            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {items.map((item, index) => {
                const isActive = item.step === activeItem.step;
                const complete = stepComplete(item);
                const inspected = stepCheckedCount(item);
                const answered = challengeAnswers[item.step] !== undefined;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setActiveStep(item.step)}
                    className={[
                      'flex items-center gap-2 rounded-2xl border p-2.5 text-left transition-colors',
                      isActive
                        ? 'border-ucla-200 bg-white text-ucla-900 shadow-soft'
                        : 'border-transparent bg-transparent text-slate-600 hover:border-ucla-100 hover:bg-white',
                    ].join(' ')}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span
                      className={[
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        complete
                          ? 'bg-emerald-100 text-emerald-700'
                          : isActive
                            ? 'bg-ucla-700 text-white'
                            : 'bg-white text-ucla-700 ring-1 ring-ucla-100',
                      ].join(' ')}
                    >
                      {complete ? <Icon name="check" size={15} /> : index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{item.step}</span>
                      <span className="block text-[11px] text-slate-500">
                        {answered ? 'Challenge answered' : `${inspected}/${item.prompts.length} inspected`}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <section className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="pill-primary">Step {activeIndex + 1}</span>
                  <span className="pill border-ucla-100 bg-ucla-50 text-ucla-800">
                    {activeCheckedCount}/{activeItem.prompts.length} inspected
                  </span>
                </div>
                <h3 className="mt-3 text-ucla-900">{activeItem.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {guidance.learnerPrompt}
                </p>

                <div className="mt-4 rounded-2xl border border-ucla-100 bg-white p-4 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-ucla-900">
                      <Icon name="sparkles" size={16} className="text-ucla-700" />
                      Micro challenge
                    </div>
                    {activeAnswer && (
                      <span
                        className={[
                          'pill',
                          activeAnswerIsCorrect
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-800',
                        ].join(' ')}
                      >
                        <Icon
                          name={activeAnswerIsCorrect ? 'check-circle' : 'alert'}
                          size={14}
                        />
                        {activeAnswerIsCorrect ? 'Good read' : 'Re-check'}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-base font-semibold leading-snug text-slate-950">
                    {activeChallenge.question}
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {activeChallenge.options.map((option) => {
                      const isSelected = activeAnswer === option.id;
                      const isCorrect = option.id === activeChallenge.correctOptionId;
                      const showCorrect = activeAnswer !== undefined && isCorrect;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => answerChallenge(activeItem.step, option.id)}
                          className={[
                            'flex min-h-[4rem] items-start gap-2.5 rounded-2xl border p-3 text-left text-sm font-semibold leading-snug transition-colors',
                            showCorrect
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                              : isSelected
                                ? 'border-amber-200 bg-amber-50 text-amber-950'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-ucla-200 hover:bg-ucla-50',
                          ].join(' ')}
                          aria-pressed={isSelected}
                        >
                          <span
                            className={[
                              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                              showCorrect
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : isSelected
                                  ? 'border-amber-600 bg-amber-600 text-white'
                                  : 'border-slate-300 bg-white text-transparent',
                            ].join(' ')}
                          >
                            <Icon
                              name={showCorrect ? 'check' : isSelected ? 'alert' : 'check'}
                              size={12}
                            />
                          </span>
                          <span>{option.text}</span>
                        </button>
                      );
                    })}
                  </div>
                  {activeAnswer ? (
                    <div
                      className={[
                        'mt-4 rounded-2xl border p-3',
                        activeAnswerIsCorrect
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-amber-200 bg-amber-50',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'flex items-center gap-2 text-sm font-semibold',
                          activeAnswerIsCorrect ? 'text-emerald-900' : 'text-amber-950',
                        ].join(' ')}
                      >
                        <Icon
                          name={activeAnswerIsCorrect ? 'check-circle' : 'alert'}
                          size={16}
                        />
                        {activeAnswerIsCorrect ? 'Correct' : 'Not quite'}
                      </div>
                      <p
                        className={[
                          'mt-1 text-sm leading-relaxed',
                          activeAnswerIsCorrect ? 'text-emerald-900' : 'text-amber-950',
                        ].join(' ')}
                      >
                        {activeChallenge.explanation}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs font-medium text-slate-500">
                      Pick an answer to unlock the teaching pearl for this step.
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => goToStep(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon name="chevron-left" size={15} />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(activeIndex + 1)}
                    disabled={activeIndex === items.length - 1}
                    className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next step
                    <Icon name="chevron-right" size={15} />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-ucla-100 bg-ucla-50/70 p-4 xl:w-72">
                <div className="flex items-center gap-2 text-sm font-semibold text-ucla-900">
                  <Icon name="eye" size={16} className="text-ucla-700" />
                  Normal anchor
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {guidance.normalAnchor}
                </p>
              </div>
            </div>

            {activeAnswer && (
              <div className="mt-5 grid gap-3 md:grid-cols-[1fr_0.9fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Icon name="book-open" size={16} className="text-ucla-700" />
                    How to read this step
                  </div>
                  <ul className="mt-3 space-y-2">
                    {guidance.coaching.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                        <Icon name="check" size={14} className="mt-0.5 text-ucla-700" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-950">
                    <Icon name="alert" size={16} className="text-amber-700" />
                    Common miss
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-amber-950">
                    {guidance.pitfall}
                  </p>
                </div>
              </div>
            )}

            <PromptChecklist
              item={activeItem}
              checked={checked}
              onToggle={toggle}
              label="Inspection targets"
              className="mt-5"
            />
          </section>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <section key={item.step} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base text-ucla-900">{item.step}</h3>
                  <p className="text-xs text-slate-500">
                    {stepCheckedCount(item)} / {item.prompts.length} inspected
                  </p>
                </div>
                {stepComplete(item) && (
                  <span className="pill border-emerald-100 bg-emerald-50 text-emerald-700">
                    <Icon name="check-circle" size={14} />
                    Complete
                  </span>
                )}
              </div>
              <PromptChecklist
                item={item}
                checked={checked}
                onToggle={toggle}
                className="mt-3"
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

interface PromptChecklistProps {
  item: SystematicChecklistItem;
  checked: Set<string>;
  onToggle: (key: string) => void;
  label?: string;
  className?: string;
}

function PromptChecklist({
  item,
  checked,
  onToggle,
  label,
  className = '',
}: PromptChecklistProps) {
  return (
    <div className={className}>
      {label && <div className="label mb-2">{label}</div>}
      <div className="grid gap-2 sm:grid-cols-2">
        {item.prompts.map((prompt) => {
          const key = promptKey(item.step, prompt);
          const isChecked = checked.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              className={[
                'group flex min-h-[3.4rem] items-start gap-2.5 rounded-2xl border p-3 text-left transition-colors',
                isChecked
                  ? 'border-ucla-200 bg-ucla-50 text-ucla-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-ucla-200 hover:bg-ucla-50/70',
              ].join(' ')}
              aria-pressed={isChecked}
            >
              <span
                className={[
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                  isChecked
                    ? 'border-ucla-700 bg-ucla-700 text-white'
                    : 'border-slate-300 bg-white text-transparent group-hover:border-ucla-300',
                ].join(' ')}
              >
                <Icon name="check" size={13} />
              </span>
              <span className="text-sm font-medium leading-snug">{prompt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
