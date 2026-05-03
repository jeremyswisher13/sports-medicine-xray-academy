import { useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import { QuizQuestion } from './QuizQuestion';
import { ConfidenceScale } from './ConfidenceScale';
import { useAuth } from '../context/AuthContext';
import {
  ids,
  logAuditEvent,
  saveConfidenceRating,
  saveModuleProgress,
  saveQuizAttempt,
} from '../services/firestore';
import type { ModuleProgress, QuizQuestionData } from '../types';

interface Props {
  moduleId: string;
  moduleTitle: string;
  phase: 'pre' | 'post';
  questions: QuizQuestionData[];
  existingProgress?: ModuleProgress;
  // Pre-check shows under a "Start with a quick check" affordance.
  // Post-check is opened from the "Mark module complete" CTA.
  variant?: 'banner' | 'inline';
  required?: boolean;
  completeModuleOnFinish?: boolean;
  completedTabsOnFinish?: string[];
  onComplete?: (result: { score: number; confidence: number }) => void;
  onSkip?: () => void;
}

export function ModuleCheck({
  moduleId,
  moduleTitle,
  phase,
  questions,
  existingProgress,
  variant = 'banner',
  required = false,
  completeModuleOnFinish = false,
  completedTabsOnFinish,
  onComplete,
  onSkip,
}: Props) {
  const { user, learnerPreview } = useAuth();
  const [open, setOpen] = useState(variant === 'inline' || required);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5 | undefined>();
  const [step, setStep] = useState<'quiz' | 'confidence' | 'done'>('quiz');
  const [quizIndex, setQuizIndex] = useState(0);
  const persistedProgress = learnerPreview ? undefined : existingProgress;

  const total = questions.length;
  const currentQuestion = questions[quizIndex] ?? questions[0];
  const correct = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correctOptionId).length,
    [questions, answers],
  );
  const scorePercent = total === 0 ? 0 : (correct / total) * 100;
  const allAnswered = Object.keys(answers).length === total;
  const currentAnswered = currentQuestion ? Boolean(answers[currentQuestion.id]) : false;

  const alreadyDone =
    phase === 'pre'
      ? Boolean(persistedProgress?.preCheckAt)
      : Boolean(persistedProgress?.postCheckAt);

  function resetCheckFlow() {
    setAnswers({});
    setSubmitted(false);
    setConfidence(undefined);
    setStep('quiz');
    setQuizIndex(0);
    setOpen(true);
  }

  if (variant === 'banner' && !open) {
    return (
      <div
        className={[
          'flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4',
          alreadyDone
            ? 'border-emerald-200 bg-emerald-50/60'
            : 'border-gold-200 bg-gold-50/60',
        ].join(' ')}
      >
        <div className="flex items-start gap-3">
          <span
            className={[
              'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
              alreadyDone
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gold-100 text-gold-800',
            ].join(' ')}
          >
            <Icon name={alreadyDone ? 'check-circle' : 'lightning'} size={16} />
          </span>
          <div className="min-w-0">
            <div
              className={[
                'text-xs font-semibold uppercase tracking-wide',
                alreadyDone ? 'text-emerald-700' : 'text-gold-800',
              ].join(' ')}
            >
              {phase === 'pre' ? 'Pre-module check' : 'Post-module check'}
              {alreadyDone ? ' • complete' : ''}
            </div>
            <div className="text-sm text-slate-800 leading-snug">
              {alreadyDone
                ? phase === 'pre'
                  ? `Baseline captured. Score: ${Math.round(persistedProgress?.preCheckScore ?? 0)}% · Confidence: ${persistedProgress?.preCheckConfidence ?? '—'}/5`
                  : `Outcome captured. Score: ${Math.round(persistedProgress?.postCheckScore ?? 0)}% · Confidence: ${persistedProgress?.postCheckConfidence ?? '—'}/5`
                : `${total} quick questions plus a confidence rating — under a minute.`}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {alreadyDone ? (
            <button className="btn-secondary" onClick={resetCheckFlow}>
              Retake
            </button>
          ) : (
            <>
              {!required && (
                <button className="btn-ghost" onClick={onSkip}>
                  Skip
                </button>
              )}
              <button className="btn-primary" onClick={resetCheckFlow}>
                Start
                <Icon name="arrow-right" size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  async function submitQuiz() {
    setSubmitted(true);
    if (!user || learnerPreview) return;
    await saveQuizAttempt({
      id: ids.newId(),
      userId: user.uid,
      scope: phase === 'pre' ? 'module-pre' : 'module-post',
      moduleId,
      startedAt: Date.now(),
      submittedAt: Date.now(),
      answers: questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] ?? '',
        correct: answers[q.id] === q.correctOptionId,
      })),
      scorePercent,
    });
    await logAuditEvent({
      userId: user.uid,
      type: 'quiz_submitted',
      moduleId,
      details: {
        scope: phase === 'pre' ? 'module-pre' : 'module-post',
        score: scorePercent,
      },
    });
  }

  async function submitConfidence() {
    if (!confidence) return;
    const shouldCompleteModule = phase === 'post' && completeModuleOnFinish;
    if (user && !learnerPreview) {
      await saveConfidenceRating({
        id: ids.newId(),
        userId: user.uid,
        scope: phase === 'pre' ? 'module-pre' : 'module-post',
        moduleId,
        value: confidence,
        createdAt: Date.now(),
      });
      const now = Date.now();
      const completedAt = shouldCompleteModule ? now : persistedProgress?.completedAt;
      const preCheckAt = phase === 'pre' ? now : persistedProgress?.preCheckAt;
      const postCheckAt = phase === 'post' ? now : persistedProgress?.postCheckAt;
      const preCheckScore =
        phase === 'pre' ? scorePercent : persistedProgress?.preCheckScore;
      const postCheckScore =
        phase === 'post' ? scorePercent : persistedProgress?.postCheckScore;
      const preCheckConfidence =
        phase === 'pre' ? confidence : persistedProgress?.preCheckConfidence;
      const postCheckConfidence =
        phase === 'post' ? confidence : persistedProgress?.postCheckConfidence;
      const progressUpdate: ModuleProgress = {
        userId: user.uid,
        moduleId,
        visited: persistedProgress?.visited ?? true,
        completedTabs: shouldCompleteModule
          ? completedTabsOnFinish ?? persistedProgress?.completedTabs ?? []
          : persistedProgress?.completedTabs ?? [],
        completed: shouldCompleteModule ? true : persistedProgress?.completed ?? false,
        lastViewedAt: now,
        ...(completedAt !== undefined ? { completedAt } : {}),
        ...(preCheckAt !== undefined ? { preCheckAt } : {}),
        ...(postCheckAt !== undefined ? { postCheckAt } : {}),
        ...(preCheckScore !== undefined ? { preCheckScore } : {}),
        ...(postCheckScore !== undefined ? { postCheckScore } : {}),
        ...(preCheckConfidence !== undefined ? { preCheckConfidence } : {}),
        ...(postCheckConfidence !== undefined ? { postCheckConfidence } : {}),
      };
      await saveModuleProgress(progressUpdate);
      await logAuditEvent({
        userId: user.uid,
        type: 'confidence_submitted',
        moduleId,
        details: {
          scope: phase === 'pre' ? 'module-pre' : 'module-post',
          value: confidence,
          completed: shouldCompleteModule,
        },
      });
    }
    setStep('done');
    onComplete?.({ score: scorePercent, confidence });
  }

  return (
    <article className="card overflow-hidden">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
            {phase === 'pre' ? 'Pre-module quick check' : 'Post-module quick check'}
          </div>
          <h3 className="text-base text-ucla-900">{moduleTitle}</h3>
        </div>
        {variant === 'banner' && !required && (
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              setOpen(false);
              onSkip?.();
            }}
          >
            Close
          </button>
        )}
      </header>

      <div className="p-5 sm:p-6">
        {step === 'quiz' && (
          <div className="space-y-3">
            {!submitted && currentQuestion && (
              <>
                <div className="rounded-2xl border border-ucla-100 bg-ucla-50/60 p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>
                      Question {quizIndex + 1} of {total}
                    </span>
                    <span>{Object.keys(answers).length}/{total} answered</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-ucla-100">
                    <div
                      className="h-full rounded-full bg-ucla-600 transition-all"
                      style={{ width: `${((quizIndex + 1) / Math.max(total, 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <QuizQuestion
                  question={currentQuestion}
                  index={quizIndex}
                  total={total}
                  selectedOptionId={answers[currentQuestion.id]}
                  cheatSheetModuleId={moduleId}
                  onSelect={(id) =>
                    setAnswers((p) => ({ ...p, [currentQuestion.id]: id }))
                  }
                />
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setQuizIndex((idx) => Math.max(0, idx - 1))}
                    disabled={quizIndex === 0}
                  >
                    <Icon name="chevron-left" size={14} />
                    Previous
                  </button>
                  {quizIndex < total - 1 ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setQuizIndex((idx) => Math.min(total - 1, idx + 1))}
                      disabled={!currentAnswered}
                    >
                      Next question
                      <Icon name="arrow-right" size={14} />
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      disabled={!allAnswered}
                      onClick={submitQuiz}
                    >
                      Submit answers
                    </button>
                  )}
                </div>
              </>
            )}

            {submitted && (
              <>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-slate-700">
                  Score:{' '}
                  <span className="font-bold tabular-nums text-ucla-900">
                    {Math.round(scorePercent)}%
                  </span>{' '}
                  ({correct}/{total}). Review the explanations, then rate confidence.
                </div>
                {questions.map((q, idx) => (
                  <QuizQuestion
                    key={q.id}
                    question={q}
                    index={idx}
                    total={total}
                    selectedOptionId={answers[q.id]}
                    showFeedback
                    locked
                    cheatSheetModuleId={moduleId}
                    onSelect={(id) =>
                      setAnswers((p) => ({ ...p, [q.id]: id }))
                    }
                  />
                ))}
                <div className="flex justify-end">
                  <button className="btn-primary" onClick={() => setStep('confidence')}>
                    Continue to confidence
                    <Icon name="arrow-right" size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'confidence' && (
          <div className="space-y-3">
            <ConfidenceScale
              compact
              label={
                phase === 'pre'
                  ? `Before this module — confidence with ${moduleTitle.toLowerCase()} radiograph interpretation`
                  : `After this module — confidence with ${moduleTitle.toLowerCase()} radiograph interpretation`
              }
              value={confidence}
              onChange={setConfidence}
            />
            <div className="flex justify-end">
              <button
                className="btn-primary"
                disabled={!confidence}
                onClick={submitConfidence}
              >
                Save and continue
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Icon name="check" size={20} />
            </div>
            <h4 className="mt-3 text-ucla-900">
              {learnerPreview ? 'Preview complete.' : 'Saved.'}
            </h4>
            <p className="mt-1 text-sm text-slate-600">
              {learnerPreview
                ? 'Learner preview only — no admin analytics were saved.'
                : phase === 'pre'
                  ? 'Now work through the module — your post-check will compare against this baseline.'
                  : completeModuleOnFinish
                    ? 'Nice work. This module is now complete and your improvement is visible in the progress dashboard.'
                    : 'Nice work. Your improvement is now visible in the progress dashboard.'}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
