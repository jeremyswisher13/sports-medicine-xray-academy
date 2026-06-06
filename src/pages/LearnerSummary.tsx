import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { moduleSummaries } from '../data/moduleSummaries';
import { loadFlashcardState } from '../utils/flashcardSchedule';
import type { ConfidenceRating, QuizAttempt } from '../types';

// Printable per-learner progress summary. Read-only over the existing progress
// snapshot — no Firestore writes. Reuses the cheat-sheet print stylesheet
// (`.cheatsheet`, `.screen-only`) so "Print / Save as PDF" yields a clean page.
export function LearnerSummaryPage() {
  const { user, learnerPreview } = useAuth();
  const { snapshot, loading } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    const original = document.body.style.background;
    document.body.style.background = '#FFFFFF';
    return () => {
      document.body.style.background = original;
    };
  }, []);

  const coreModules = moduleSummaries.filter((m) => m.status === 'full');
  const completedCore = coreModules.filter((m) =>
    snapshot.modules.some((p) => p.moduleId === m.id && p.completed),
  ).length;

  const preQuiz = quizScore(snapshot.quizzes, 'pre');
  const postQuiz = quizScore(snapshot.quizzes, 'post');
  const preConfidence = confidenceAvg(snapshot.confidence, 'pre');
  const postConfidence = confidenceAvg(snapshot.confidence, 'post');

  const casesAttempted = snapshot.cases.length;
  const casesCorrect = snapshot.cases.filter((c) => c.correct).length;
  const videosCompleted = snapshot.videos.filter((v) => v.markedComplete).length;
  const flashcardsReviewed = loadFlashcardState().reviewedIds.length;

  const generatedOn = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white">
      <div className="screen-only border-b border-gold-500/50 bg-ucla-950 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-slate-200 hover:text-white"
            >
              ← Back
            </button>
            <span className="text-white/30">/</span>
            <span className="font-medium text-white">Progress summary</span>
          </div>
          <div className="flex gap-2">
            <Link to="/progress" className="btn border-white/15 text-white hover:bg-white/10">
              Full dashboard
            </Link>
            <button type="button" className="btn-gold" onClick={() => window.print()}>
              <Icon name="printer" size={14} />
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      <article className="cheatsheet mx-auto bg-white text-[10pt] leading-snug text-slate-900 print:p-0 print:shadow-none print:border-none print:max-w-none print:w-full">
        <header className="flex items-end justify-between gap-4 border-b-2 border-ucla-800 pb-3">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <div className="text-[8pt] font-semibold uppercase tracking-[0.18em] text-ucla-700">
                Sports Medicine X-Ray Academy · Learner Progress Summary
              </div>
              <h1 className="font-serif text-[20pt] leading-tight text-ucla-900">
                {user?.displayName ?? 'Learner'}
              </h1>
              <div className="text-[8pt] text-slate-500">
                {user?.email ?? '—'} · UCLA Sports Medicine
              </div>
            </div>
          </div>
          <div className="text-right text-[8pt] text-slate-500">
            <div className="font-semibold text-slate-700">Generated</div>
            <div>{generatedOn}</div>
            <div>swisher-xray-academy.web.app</div>
          </div>
        </header>

        {learnerPreview && (
          <p className="mt-3 rounded border border-gold-200 bg-gold-50/70 px-3 py-2 text-[8.5pt] text-slate-700">
            Learner preview mode is on — this summary reflects a fresh learner with no saved
            analytics.
          </p>
        )}
        {loading && (
          <p className="mt-3 text-[9pt] text-slate-500">Loading your progress…</p>
        )}

        {/* Headline metrics */}
        <section className="mt-4 grid gap-2 print:grid-cols-4 sm:grid-cols-4">
          <SummaryStat
            label="Core modules"
            value={`${completedCore}/${coreModules.length}`}
            sub="completed"
          />
          <SummaryStat
            label="Course quiz"
            value={deltaLabel(preQuiz, postQuiz, '%')}
            sub="pre → post"
          />
          <SummaryStat
            label="Confidence"
            value={deltaLabel(preConfidence, postConfidence, '/5', 1)}
            sub="pre → post (avg)"
          />
          <SummaryStat
            label="Cases"
            value={`${casesCorrect}/${casesAttempted}`}
            sub="correct / attempted"
          />
        </section>

        {/* Per-module table */}
        <section className="mt-5">
          <h2 className="font-sans text-[10pt] font-semibold uppercase tracking-[0.16em] text-ucla-800">
            Module outcomes
          </h2>
          <table className="mt-2 w-full border-collapse text-[8.8pt]">
            <thead>
              <tr className="border-b border-slate-300 text-left text-slate-500">
                <th className="py-1 pr-2 font-semibold">Module</th>
                <th className="py-1 px-2 font-semibold">Status</th>
                <th className="py-1 px-2 font-semibold">Pre → Post score</th>
                <th className="py-1 px-2 font-semibold">Pre → Post confidence</th>
              </tr>
            </thead>
            <tbody>
              {moduleSummaries.map((m) => {
                const p = snapshot.modules.find((x) => x.moduleId === m.id);
                const status = p?.completed
                  ? 'Complete'
                  : p?.visited
                    ? 'In progress'
                    : 'Not started';
                return (
                  <tr key={m.id} className="border-b border-slate-100">
                    <td className="py-1 pr-2 font-medium text-slate-800">{m.title}</td>
                    <td className="py-1 px-2 text-slate-600">{status}</td>
                    <td className="py-1 px-2 tabular-nums text-slate-700">
                      {deltaLabel(p?.preCheckScore, p?.postCheckScore, '%')}
                    </td>
                    <td className="py-1 px-2 tabular-nums text-slate-700">
                      {deltaLabel(p?.preCheckConfidence, p?.postCheckConfidence, '/5')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Activity */}
        <section className="mt-5">
          <h2 className="font-sans text-[10pt] font-semibold uppercase tracking-[0.16em] text-ucla-800">
            Activity
          </h2>
          <div className="mt-2 grid gap-2 print:grid-cols-4 sm:grid-cols-4">
            <SummaryStat label="Cases attempted" value={`${casesAttempted}`} />
            <SummaryStat label="Cases correct" value={`${casesCorrect}`} />
            <SummaryStat label="Videos completed" value={`${videosCompleted}`} />
            <SummaryStat label="Flashcards reviewed" value={`${flashcardsReviewed}`} />
          </div>
        </section>

        <footer className="mt-5 border-t border-slate-200 pt-2 text-[8pt] text-slate-500">
          For clinician education. This summary reflects self-paced activity within the Sports
          Medicine X-Ray Academy and is not a certification of clinical competency.
        </footer>
      </article>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded border border-ucla-200 bg-ucla-50/50 px-3 py-2">
      <div className="text-[7.5pt] font-semibold uppercase tracking-wide text-ucla-700">
        {label}
      </div>
      <div className="mt-0.5 text-[13pt] font-bold tabular-nums text-ucla-950">{value}</div>
      {sub && <div className="text-[7.5pt] text-slate-500">{sub}</div>}
    </div>
  );
}

function quizScore(quizzes: QuizAttempt[], scope: 'pre' | 'post'): number | undefined {
  return quizzes.find((q) => q.scope === scope)?.scorePercent;
}

function confidenceAvg(
  confidence: ConfidenceRating[],
  scope: 'pre' | 'post',
): number | undefined {
  const values = confidence.filter((c) => c.scope === scope).map((c) => c.value);
  if (values.length === 0) return undefined;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function deltaLabel(
  before: number | undefined,
  after: number | undefined,
  unit: '%' | '/5',
  decimals = 0,
): string {
  const fmt = (n: number) =>
    unit === '/5' ? `${n.toFixed(decimals)}/5` : `${Math.round(n)}%`;
  if (before === undefined && after === undefined) return '—';
  if (before === undefined) return after === undefined ? '—' : fmt(after);
  if (after === undefined) return fmt(before);
  return `${fmt(before)} → ${fmt(after)}`;
}
