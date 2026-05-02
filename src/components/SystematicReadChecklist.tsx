import { useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import type { SystematicChecklistItem } from '../types';

type SystematicStep = SystematicChecklistItem['step'];
type StudyMode = 'guided' | 'checklist';

interface StepGuidance {
  learnerPrompt: string;
  normalAnchor: string;
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

export function SystematicReadChecklist({
  items,
  storageKey,
  onChangeChecked,
  defaultExpandedAll = false,
}: Props) {
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (!storageKey) return new Set();
    try {
      const raw = localStorage.getItem(`sxra:checklist:${storageKey}`);
      if (raw) return new Set(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
    return new Set();
  });
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    if (!storageKey) return {};
    try {
      const raw = localStorage.getItem(`sxra:read-notes:${storageKey}`);
      if (raw) return JSON.parse(raw) as Record<string, string>;
    } catch {
      // ignore
    }
    return {};
  });
  const [revealedSteps, setRevealedSteps] = useState<Set<SystematicStep>>(() => new Set());
  const [mode, setMode] = useState<StudyMode>(() => (defaultExpandedAll ? 'checklist' : 'guided'));
  const [activeStep, setActiveStep] = useState<SystematicStep | null>(() => items[0]?.step ?? null);

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

  function updateNote(step: SystematicStep, value: string) {
    setNotes((prev) => {
      const next = { ...prev, [step]: value };
      if (storageKey) {
        try {
          localStorage.setItem(`sxra:read-notes:${storageKey}`, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
  }

  function revealStep(step: SystematicStep) {
    setRevealedSteps((prev) => new Set(prev).add(step));
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
  const activeIsRevealed = revealedSteps.has(activeItem.step);
  const activeCheckedCount = stepCheckedCount(activeItem);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ucla-100 bg-gradient-to-br from-ucla-50 via-white to-sky-50 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="section-title">Guided Systematic X-Ray Read</div>
            <p className="mt-1 text-xs text-slate-600">
              Confirm → Alignment → Bone → Cartilage → Soft Tissues → Impression
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['guided', 'checklist'] as StudyMode[]).map((option) => (
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
                {option}
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

      {mode === 'guided' ? (
        <div className="grid gap-0 xl:grid-cols-[220px_1fr]">
          <nav className="border-b border-ucla-100 bg-slate-50/70 p-3 xl:border-b-0 xl:border-r">
            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {items.map((item, index) => {
                const isActive = item.step === activeItem.step;
                const complete = stepComplete(item);
                const inspected = stepCheckedCount(item);
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
                        {inspected}/{item.prompts.length} inspected
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

                <label className="mt-4 block">
                  <span className="label">Write what you notice first</span>
                  <textarea
                    value={notes[activeItem.step] ?? ''}
                    onChange={(event) => updateNote(activeItem.step, event.target.value)}
                    className="input mt-2 min-h-24 resize-y leading-relaxed"
                    placeholder="Use one sentence. Example: The AP view is adequate, the joint is aligned, and there is no obvious cortical break."
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => revealStep(activeItem.step)}
                    className={activeIsRevealed ? 'btn-secondary' : 'btn-primary'}
                  >
                    <Icon name={activeIsRevealed ? 'check-circle' : 'sparkles'} size={15} />
                    {activeIsRevealed ? 'Coaching revealed' : 'Reveal coaching'}
                  </button>
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

            {activeIsRevealed && (
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
  className?: string;
}

function PromptChecklist({ item, checked, onToggle, className = '' }: PromptChecklistProps) {
  return (
    <div className={className}>
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
