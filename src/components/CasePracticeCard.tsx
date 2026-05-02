import { useState } from 'react';
import { Icon } from './ui/Icon';
import { XRayImage } from './XRayImage';
import { getImage } from '../data/images';
import { useAuth } from '../context/AuthContext';
import { ids, logAuditEvent, saveCaseAttempt } from '../services/firestore';
import type { CaseScenario, XRayImageEntry } from '../types';

interface Props {
  scenario: CaseScenario;
}

export function CasePracticeCard({ scenario }: Props) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState('');
  const [observations, setObservations] = useState<string[]>([]);
  const correct = selected === scenario.correctOptionId;

  function toggleObservation(text: string) {
    setObservations((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text],
    );
  }

  async function submit() {
    if (!selected) return;
    setSubmitted(true);
    if (!user) return;
    await saveCaseAttempt({
      id: ids.newId(),
      userId: user.uid,
      caseId: scenario.id,
      moduleId: scenario.moduleId,
      selectedOptionId: selected,
      correct: selected === scenario.correctOptionId,
      checklistChecked: observations,
      freeTextNotes: notes,
      submittedAt: Date.now(),
    });
    await logAuditEvent({
      userId: user.uid,
      type: 'case_attempted',
      moduleId: scenario.moduleId,
      refId: scenario.id,
      details: { correct },
    });
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

      {(() => {
        const entries: XRayImageEntry[] = (scenario.imagePanels ?? [])
          .map((p) => (p.imageKey ? getImage(p.imageKey) : undefined))
          .filter((e): e is XRayImageEntry => Boolean(e));
        if (entries.length === 0) return null;
        const cls =
          entries.length === 1
            ? 'mt-4 mx-auto max-w-xl'
            : 'mt-4 grid gap-3 sm:grid-cols-2';
        return (
          <div className={cls}>
            {entries.map((entry) => (
              <XRayImage key={entry.id} entry={entry} />
            ))}
          </div>
        );
      })()}

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                  'flex cursor-pointer items-start gap-2 rounded-lg border bg-white px-3 py-2 text-sm',
                  checked ? 'border-ucla-300 bg-ucla-50/40' : 'border-slate-200',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
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
          className="input mt-3 min-h-[5rem] resize-y"
          placeholder="One-sentence sports medicine impression…"
        />
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
          Most likely diagnosis
        </div>
        <div className="mt-2 grid gap-2">
          {scenario.diagnosisOptions.map((opt) => {
            const isSelected = selected === opt.id;
            const isCorrect = opt.id === scenario.correctOptionId;
            let cls =
              'flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-3 text-left text-sm transition-colors';
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
        {!submitted && (
          <div className="mt-4 flex justify-end">
            <button className="btn-primary" disabled={!selected} onClick={submit}>
              Submit answer
            </button>
          </div>
        )}
      </div>

      {submitted && (
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Explanation
            </div>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">
              {scenario.explanation}
            </p>
          </div>
          <div className="rounded-xl border border-gold-200 bg-gold-50/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gold-800">
              Teaching pearl
            </div>
            <p className="mt-1 text-sm text-slate-800 leading-relaxed">
              {scenario.teachingPearl}
            </p>
          </div>
          <div className="rounded-xl border border-ucla-100 bg-ucla-50/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Next step
            </div>
            <p className="mt-1 text-sm text-slate-800 leading-relaxed">
              {scenario.nextStep}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
