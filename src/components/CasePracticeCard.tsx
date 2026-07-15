import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { ConfidenceScale } from './ConfidenceScale';
import { XRayImage } from './XRayImage';
import { getImage } from '../data/images';
import { useAuth } from '../context/AuthContext';
import { ids, logAuditEvent, saveCaseAttempt } from '../services/firestore';
import type {
  CaseManagementChoiceId,
  CaseQuestionType,
  CaseScenario,
  XRayImageEntry,
} from '../types';

interface Props {
  scenario: CaseScenario;
  onComplete?: (result: { correct: boolean; managementCorrect: boolean }) => void;
}

type CaseConfidenceValue = 1 | 2 | 3 | 4 | 5;

const managementOptions = [
  {
    id: 'symptomatic-follow-up',
    label: 'Symptomatic care with routine follow-up',
  },
  {
    id: 'immobilize-protect',
    label: 'Immobilize/protect weightbearing and arrange follow-up',
  },
  {
    id: 'advanced-imaging',
    label: 'Escalate to advanced imaging because x-ray is not enough',
  },
  {
    id: 'urgent-referral',
    label: 'Same-day urgent referral, reduction, or emergency pathway',
  },
] as const;

const questionLabels: Record<CaseQuestionType, string> = {
  diagnosis: 'Most likely diagnosis',
  management: 'Best next step',
  'associated-injury': 'Most likely associated injury',
  interpretation: 'Best interpretation',
};

export function CasePracticeCard({ scenario, onComplete }: Props) {
  const { user, learnerPreview } = useAuth();
  const [selected, setSelected] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState('');
  const [observations, setObservations] = useState<string[]>([]);
  const [managementChoiceId, setManagementChoiceId] = useState<CaseManagementChoiceId | undefined>();
  const [confidence, setConfidence] = useState<CaseConfidenceValue | undefined>();
  const correct = selected === scenario.correctOptionId;
  const showManagementCommitment = scenario.questionType !== 'management';
  const managementCorrect = showManagementCommitment
    ? Boolean(
        managementChoiceId &&
          scenario.recommendedManagementChoiceIds.includes(managementChoiceId),
      )
    : correct;
  const immediatePanels = (scenario.imagePanels ?? []).filter(
    (panel) => !panel.revealAfterSubmit,
  );
  const teachingPanels = (scenario.imagePanels ?? []).filter(
    (panel) => panel.revealAfterSubmit,
  );

  function toggleObservation(text: string) {
    setObservations((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text],
    );
  }

  async function submit() {
    if (
      !selected ||
      confidence === undefined ||
      (showManagementCommitment && !managementChoiceId)
    ) {
      return;
    }
    setSubmitted(true);
    if (user && !learnerPreview) {
      await saveCaseAttempt({
        id: ids.newId(),
        userId: user.uid,
        caseId: scenario.id,
        moduleId: scenario.moduleId,
        selectedOptionId: selected,
        correct,
        questionType: scenario.questionType,
        checklistChecked: observations,
        freeTextNotes: notes,
        ...(managementChoiceId ? { managementChoiceId } : {}),
        managementCorrect,
        confidence,
        submittedAt: Date.now(),
      });
      await logAuditEvent({
        userId: user.uid,
        type: 'case_attempted',
        moduleId: scenario.moduleId,
        refId: scenario.id,
        details: {
          questionType: scenario.questionType,
          correct,
          managementCorrect,
          confidence,
        },
      });
    }
    onComplete?.({ correct, managementCorrect });
  }

  const observationOptions = [
    'Cortical step-off or buckle',
    'Joint malalignment / dislocation',
    'Effusion or fat pad sign',
    'Avulsion fragment',
    'Joint space narrowing or widening',
    'No definite x-ray abnormality',
  ];

  return (
    <article className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pill-primary">Case practice</span>
        <span className="pill">{scenario.patientAge}</span>
        <span className="pill">{scenario.sportOrActivity}</span>
      </div>
      <h3 className="mt-2 text-lg sm:text-xl text-ucla-900">{scenario.title}</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="label">Mechanism</dt>
          <dd className="mt-0.5 text-sm text-slate-700">{scenario.mechanism}</dd>
        </div>
        <div>
          <dt className="label">Symptoms</dt>
          <dd className="mt-0.5 text-sm text-slate-700">{scenario.symptoms}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="label">Views obtained</dt>
          <dd className="mt-0.5 text-sm text-slate-700">
            {scenario.viewsObtained.join(' • ')}
          </dd>
        </div>
      </dl>

      <CaseImages panels={immediatePanels} />

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
          What do you notice first?
        </div>
        <p className="mt-1 text-sm text-slate-700 leading-relaxed">
          {scenario.initialPrompt}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {observationOptions.map((o) => {
            const checked = observations.includes(o);
            return (
              <label
                key={o}
                className={[
                  'flex items-start gap-2 rounded-lg border bg-white px-3 py-2 text-sm',
                  submitted ? 'cursor-default' : 'cursor-pointer',
                  checked ? 'border-ucla-300 bg-ucla-50/40' : 'border-slate-200',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  disabled={submitted}
                  onChange={() => toggleObservation(o)}
                />
                <span
                  className={[
                    'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                    checked
                      ? 'border-ucla-700 bg-ucla-700 text-white'
                      : 'border-slate-300 bg-white',
                  ].join(' ')}
                >
                  {checked && <Icon name="check" size={11} />}
                </span>
                <span className="text-slate-700">{o}</span>
              </label>
            );
          })}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={submitted}
          className="input mt-3 min-h-[5rem] resize-y"
          placeholder="One-sentence sports medicine impression…"
          aria-label="Your sports medicine impression"
        />
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
          {questionLabels[scenario.questionType]}
        </div>
        <div className="mt-2 grid gap-2">
          {scenario.diagnosisOptions.map((opt) => {
            const isSelected = selected === opt.id;
            const isCorrect = opt.id === scenario.correctOptionId;
            let cls =
              'flex w-full items-start gap-3 rounded-lg border bg-white px-4 py-3 text-left text-sm transition-colors';
            if (submitted) {
              if (isCorrect) cls += ' border-emerald-300 bg-emerald-50/60';
              else if (isSelected) cls += ' border-rose-300 bg-rose-50/60';
              else cls += ' border-slate-200';
            } else {
              cls += isSelected
                ? ' border-ucla-500 bg-ucla-50/60'
                : ' border-slate-200 hover:border-slate-300';
            }
            return (
              <button
                key={opt.id}
                type="button"
                className={cls}
                disabled={submitted}
                onClick={() => !submitted && setSelected(opt.id)}
              >
                <span
                  className={[
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                    submitted && isCorrect
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : submitted && isSelected
                        ? 'border-rose-500 bg-rose-500 text-white'
                        : isSelected
                          ? 'border-ucla-700 bg-ucla-700 text-white'
                          : 'border-slate-300 bg-white text-slate-500',
                  ].join(' ')}
                >
                  {submitted && isCorrect ? (
                    <Icon name="check" size={12} />
                  ) : (
                    opt.id.toUpperCase()
                  )}
                </span>
                <span className="text-slate-800 leading-snug">{opt.label}</span>
              </button>
            );
          })}
        </div>
        {showManagementCommitment && (
          <div className="mt-4 rounded-lg border border-ucla-100 bg-ucla-50/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Management commitment
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              Commit to the safest next action before seeing the teaching feedback.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {managementOptions.map((option) => {
                const isSelected = managementChoiceId === option.id;
                const isRecommended = scenario.recommendedManagementChoiceIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={submitted}
                    onClick={() => setManagementChoiceId(option.id)}
                    className={[
                      'flex min-h-[3.75rem] items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm font-semibold leading-snug transition-colors disabled:cursor-not-allowed',
                      submitted && isRecommended
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : submitted && isSelected
                          ? 'border-rose-300 bg-rose-50 text-rose-900'
                          : isSelected
                            ? 'border-ucla-400 bg-white text-ucla-950'
                            : 'border-ucla-100 bg-white text-slate-700 hover:border-ucla-200',
                    ].join(' ')}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={[
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                        submitted && isRecommended
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : isSelected
                            ? 'border-ucla-700 bg-ucla-700 text-white'
                            : 'border-slate-300 bg-white text-transparent',
                      ].join(' ')}
                    >
                      <Icon name={submitted && isRecommended ? 'check' : 'circle'} size={11} />
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <ConfidenceScale
            compact
            label="How confident are you in your read and next step?"
            value={confidence}
            disabled={submitted}
            onChange={setConfidence}
          />
        </div>
        {!submitted && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {showManagementCommitment
                ? 'Answer, management, and confidence are required before reveal.'
                : 'Answer and confidence are required before reveal.'}
            </span>
            <button
              className="btn-primary"
              disabled={
                !selected ||
                confidence === undefined ||
                (showManagementCommitment && !managementChoiceId)
              }
              onClick={submit}
            >
              Submit answer
            </button>
          </div>
        )}
      </div>

      {submitted && (
        <div className="mt-5 space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Explanation
            </div>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">
              {scenario.explanation}
            </p>
          </div>
          {teachingPanels.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
                Teaching radiograph
              </div>
              <CaseImages panels={teachingPanels} className="mt-2" />
            </div>
          )}
          <div className="rounded-lg border border-gold-200 bg-gold-50/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gold-800">
              Teaching pearl
            </div>
            <p className="mt-1 text-sm text-slate-800 leading-relaxed">
              {scenario.teachingPearl}
            </p>
          </div>
          <div className="rounded-lg border border-ucla-100 bg-ucla-50/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Next step
            </div>
            <p className="mt-1 text-sm text-slate-800 leading-relaxed">
              {scenario.nextStep}
            </p>
            <Link
              to={`/modules/${scenario.moduleId}/cheatsheet`}
              className="-mx-2 mt-3 inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-semibold text-ucla-700 no-underline hover:text-ucla-900"
            >
              <Icon name="printer" size={13} />
              Open related cheat sheet
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}

function CaseImages({
  panels,
  className = 'mt-4',
}: {
  panels: NonNullable<CaseScenario['imagePanels']>;
  className?: string;
}) {
  const entries: XRayImageEntry[] = panels
    .map((panel) => (panel.imageKey ? getImage(panel.imageKey) : undefined))
    .filter((entry): entry is XRayImageEntry => Boolean(entry));
  if (entries.length === 0) return null;
  return (
    <div
      className={[
        className,
        entries.length === 1 ? 'mx-auto max-w-xl' : 'grid gap-3 sm:grid-cols-2',
      ].join(' ')}
    >
      {entries.map((entry) => (
        <XRayImage key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
