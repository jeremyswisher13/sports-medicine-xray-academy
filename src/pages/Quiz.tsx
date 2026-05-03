import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { QuizQuestion } from '../components/QuizQuestion';
import { ConfidenceScale } from '../components/ConfidenceScale';
import { confidenceDomains, postCourseQuiz, preCourseQuiz } from '../data/quizzes';
import { useAuth } from '../context/AuthContext';
import { ids, logAuditEvent, saveConfidenceRating, saveQuizAttempt } from '../services/firestore';
import { markPreviewCourseAssessment } from '../utils/progress';

interface Props {
  scope: 'pre' | 'post';
}

export function QuizPage({ scope }: Props) {
  const { user, learnerPreview } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const questions = scope === 'pre' ? preCourseQuiz : postCourseQuiz;
  const requestedPath = getRequestedPath(location.state);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidences, setConfidences] = useState<Record<string, 1 | 2 | 3 | 4 | 5>>({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<'quiz' | 'confidence' | 'done'>('quiz');
  const [quizIndex, setQuizIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(Date.now());

  useEffect(() => {
    setAnswers({});
    setConfidences({});
    setSubmitted(false);
    setStep('quiz');
    setQuizIndex(0);
    setStartedAt(Date.now());
  }, [scope]);

  const total = questions.length;
  const currentQuestion = questions[quizIndex] ?? questions[0];
  const correctCount = questions.filter((q) => answers[q.id] === q.correctOptionId).length;
  const scorePercent = total === 0 ? 0 : (correctCount / total) * 100;
  const allAnswered = Object.keys(answers).length === total;
  const currentAnswered = currentQuestion ? Boolean(answers[currentQuestion.id]) : false;
  const confidenceCount = Object.keys(confidences).length;
  const allConfidenceRated = confidenceDomains.every((domain) => confidences[domain.id]);

  async function submitQuiz() {
    setSubmitted(true);
    if (!user || learnerPreview) return;
    await saveQuizAttempt({
      id: ids.newId(),
      userId: user.uid,
      scope,
      startedAt,
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
      details: { scope, score: scorePercent },
    });
  }

  async function submitConfidence() {
    if (!allConfidenceRated) return;
    if (!user || learnerPreview) {
      if (learnerPreview) {
        markPreviewCourseAssessment(scope);
      }
      setStep('done');
      return;
    }
    await Promise.all(
      Object.entries(confidences).map(([domain, value]) =>
        saveConfidenceRating({
          id: ids.newId(),
          userId: user.uid,
          scope,
          domain,
          value,
          createdAt: Date.now(),
        }),
      ),
    );
    await logAuditEvent({
      userId: user.uid,
      type: 'confidence_submitted',
      details: { scope, count: Object.keys(confidences).length },
    });
    setStep('done');
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 no-underline">
          ← Dashboard
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700">
          {scope === 'pre' ? 'Pre-course assessment' : 'Post-course assessment'}
        </span>
      </div>
      <header className="mt-3 overflow-hidden rounded-2xl border border-ucla-100 bg-ucla-50/70 p-5 shadow-soft sm:p-6">
        <div className="section-title">{scope === 'pre' ? 'Baseline' : 'Outcome'}</div>
        <h1 className="mt-1 text-balance">
          {scope === 'pre' ? 'Pre-course assessment' : 'Post-course assessment'}
        </h1>
        <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
          {step === 'quiz'
            ? 'A short knowledge check. Pick the best answer; explanations appear after submission.'
            : step === 'confidence'
              ? 'Rate your confidence across core domains.'
              : learnerPreview
                ? 'Learner preview complete — no analytics were saved.'
                : 'Thanks — your responses are saved.'}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            {
              label: '1. Knowledge',
              body: `${questions.length} short questions with explanations after submit.`,
              active: step === 'quiz',
            },
            {
              label: '2. Confidence',
              body: `${confidenceDomains.length} clinical-readiness domains, all required.`,
              active: step === 'confidence',
            },
            {
              label: scope === 'pre' ? '3. Unlock' : '3. Review',
              body:
                scope === 'pre'
                  ? 'Modules open after knowledge and confidence are both captured.'
                  : 'Progress and readiness update after the outcome check.',
              active: step === 'done',
            },
          ].map((item) => (
            <div
              key={item.label}
              className={[
                'rounded-xl border px-3 py-2 text-sm',
                item.active
                  ? 'border-ucla-200 bg-white text-ucla-900 shadow-soft'
                  : 'border-ucla-100 bg-white/60 text-slate-600',
              ].join(' ')}
            >
              <div className="font-semibold">{item.label}</div>
              <div className="mt-0.5 text-xs leading-relaxed">{item.body}</div>
            </div>
          ))}
        </div>
      </header>

      {step === 'quiz' && (
        <section className="mt-6 space-y-4">
          {!submitted && currentQuestion && (
            <>
              <div className="rounded-2xl border border-ucla-100 bg-white/95 p-4 shadow-soft">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>
                    Question {quizIndex + 1} of {total}
                  </span>
                  <span>{Object.keys(answers).length} answered</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ucla-50 ring-1 ring-ucla-100">
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
                cheatSheetModuleId={currentQuestion.moduleId}
                onSelect={(id) =>
                  setAnswers((p) => ({ ...p, [currentQuestion.id]: id }))
                }
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setQuizIndex((idx) => Math.max(0, idx - 1))}
                  disabled={quizIndex === 0}
                >
                  <Icon name="chevron-left" size={14} />
                  Previous
                </button>
                <div className="flex flex-wrap gap-2">
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
                      Submit quiz
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {submitted && (
            <>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-slate-700 shadow-soft">
                Score:{' '}
                <span className="font-bold tabular-nums text-ucla-900">
                  {Math.round(scorePercent)}%
                </span>{' '}
                ({correctCount} / {total}). Review the explanations, then rate confidence.
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
                  cheatSheetModuleId={q.moduleId}
                  onSelect={(id) => setAnswers((p) => ({ ...p, [q.id]: id }))}
                />
              ))}
              <div className="flex justify-end">
                <button className="btn-primary" onClick={() => setStep('confidence')}>
                  Continue to confidence rating
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {step === 'confidence' && (
        <section className="mt-6 space-y-3">
          <div className="rounded-2xl border border-ucla-100 bg-ucla-50/70 p-4 text-sm leading-relaxed text-slate-700">
            <div className="font-semibold text-ucla-900">
              Confidence is part of the assessment.
            </div>
            <p className="mt-1">
              Rate all {confidenceDomains.length} domains so your knowledge score can be
              interpreted alongside clinical readiness.
            </p>
          </div>
          {confidenceDomains.map((d) => (
            <ConfidenceScale
              key={d.id}
              label={d.label}
              value={confidences[d.id]}
              onChange={(v) =>
                setConfidences((prev) => ({ ...prev, [d.id]: v }))
              }
            />
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {confidenceCount}/{confidenceDomains.length} domains rated
            </span>
            <button
              className="btn-primary"
              onClick={submitConfidence}
              disabled={!allConfidenceRated}
            >
              Submit ratings
            </button>
          </div>
        </section>
      )}

      {step === 'done' && (
        <section className="mt-6 card p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" size={20} />
          </div>
          <h2 className="mt-3">You're done.</h2>
          <p className="mt-1 text-sm text-slate-600">
            {learnerPreview ? 'Preview quiz score: ' : 'Quiz score saved: '}
            <span className="font-bold text-ucla-900">{Math.round(scorePercent)}%</span>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/dashboard" className="btn-secondary">
              Back to dashboard
            </Link>
            {scope === 'pre' ? (
              <Link to={requestedPath ?? '/modules/xray-foundations'} className="btn-primary">
                {requestedPath ? 'Continue to requested module' : 'Start X-Ray Foundations'}
                <Icon name="arrow-right" size={14} />
              </Link>
            ) : (
              <button className="btn-primary" onClick={() => navigate('/progress')}>
                See your progress
                <Icon name="arrow-right" size={14} />
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function getRequestedPath(state: unknown): string | null {
  if (!state || typeof state !== 'object') return null;
  const from = (state as { from?: unknown }).from;
  if (typeof from !== 'string') return null;
  if (!from.startsWith('/modules')) return null;
  return from;
}
