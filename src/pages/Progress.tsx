import { ProgressDashboard } from '../components/ProgressDashboard';
import { useProgress } from '../hooks/useProgress';

export function ProgressPage() {
  const { snapshot, loading } = useProgress();
  return (
    <div className="container-page py-8 sm:py-12">
      <div>
        <div className="section-title">Your learning</div>
        <h1 className="mt-1 text-balance">Progress dashboard</h1>
        <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
          A snapshot of your modules, quizzes, confidence ratings, cases, and AMSSM video
          progress.
        </p>
      </div>
      {loading && (
        <div className="mt-6 text-sm text-slate-500">Loading your progress…</div>
      )}
      <div className="mt-6">
        <ProgressDashboard snapshot={snapshot} />
      </div>
    </div>
  );
}
