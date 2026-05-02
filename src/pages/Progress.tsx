import { ProgressDashboard } from '../components/ProgressDashboard';
import { Icon } from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';

export function ProgressPage() {
  const { learnerPreview } = useAuth();
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
      {learnerPreview && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50/70 p-4 text-sm text-slate-700">
          <span className="mt-0.5 text-gold-900">
            <Icon name="eye" size={16} />
          </span>
          <div>
            <div className="font-semibold text-gold-900">Learner preview mode</div>
            <p className="mt-0.5">
              This dashboard is intentionally empty so you can see the course as a new learner.
            </p>
          </div>
        </div>
      )}
      <div className="mt-6">
        <ProgressDashboard snapshot={snapshot} />
      </div>
    </div>
  );
}
