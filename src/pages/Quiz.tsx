import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { QuizQuestion } from '../components/QuizQuestion';
import { ConfidenceScale } from '../components/ConfidenceScale';
import { confidenceDomains, postCourseQuiz, preCourseQuiz } from '../data/quizzes';
import { useAuth } from '../context/AuthContext';
import { ids, logAuditEvent, saveConfidenceRating, saveQuizAttempt } from '../services/firestore';

interface Props {
  scope: 'pre' | 'post';
}

export function QuizPage({ scope }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const questions = scope === 'pre' ? preCourseQuiz : postCourseQuiz;

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidences, setConfidences] = useState<Record<string, 1 | 2 | 3 | 4 | 5>>({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<'quiz' | 'confidence' | 'done'>('quiz');
  const [startedAt] = useState(Date.now());

  useEffect(() => {
    setAnswers({});
    setConfidences({});
    setSubmitted(false);
    setStep('quiz');
  }, [scope]);

  const total = questions.length;
  const correctCount = questions.filter((q) => answers[q.id] === q.correctOptionId).length;
  const scorePercent = total === 0 ? 0 : (correctCount / total) * 100;
  const allAnswered = Object.keys(answers).length === total;

  async function submitQuiz() {
    setSubmitted(true);
    if (!user) return;
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
    if (!user) {
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
      <header className="mt-3">
        <div className="section-title">{scope === 'pre' ? 'Baseline' : 'Outcome'}</div>
        <h1 className="mt-1 text-balance">
          {scope === 'pre' ? 'Pre-course assessment' : 'Post-course assessment'}
        </h1>
        <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
          {step === 'quiz'
            ? 'A short knowledge check. Pick the best answer; explanations appear after submission.'
            : step === 'confidence'
              ? 'Rate your confidence across core domains.'
              : 'Thanks — your responses are saved.'}
        </p>
      </header>

      {step === 'quiz' && (
        <section className="mt-6 space-y-4">
          {questions.map((q, idx) => (
            <QuizQuestion
              key={q.id}
              question={q}
              index={idx}
              total={total}
              selectedOptionId={answers[q.id]}
              showFeedback={submitted}
              locked={submitted}
              onSelect={(id) => setAnswers((p) => ({ ...p, [q.id]: id }))}
            />
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {submitted ? (
              <div className="text-sm text-slate-700">
                Score:{' '}
                <span className="font-bold tabular-nums text-ucla-900">
                  {Math.round(scorePercent)}%
                </span>{' '}
                ({correctCount} / {total})
              </div>
            ) : (
              <span className="text-xs text-slate-500">
                {Object.keys(answers).length} of {total} answered
              </span>
            )}
            {submitted ? (
              <button className="btn-primary" onClick={() => setStep('confidence')}>
                Continue to confidence rating
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
        </section>
      )}

      {step === 'confidence' && (
        <section className="mt-6 space-y-3">
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
          <div className="flex justify-end gap-2">
            <button className="btn-secondary" onClick={() => setStep('done')}>
              Skip
            </button>
            <button
              className="btn-primary"
              onClick={submitConfidence}
              disabled={Object.keys(confidences).length === 0}
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
            Quiz score saved:{' '}
            <span className="font-bold text-ucla-900">{Math.round(scorePercent)}%</span>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/dashboard" className="btn-secondary">
              Back to dashboard
            </Link>
            {scope === 'pre' ? (
              <Link to="/modules/xray-foundations" className="btn-primary">
                Start X-Ray Foundations
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
