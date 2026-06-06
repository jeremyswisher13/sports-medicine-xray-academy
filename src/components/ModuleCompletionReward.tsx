import { Link } from 'react-router-dom';
import type { ModuleContent, ModuleProgress } from '../types';
import { Icon } from './ui/Icon';
import {
  completionVerdict,
  delta,
  deltaTone,
  formatSigned,
  nextRecommendedModule,
  reviewTargets,
  type RewardTone,
} from '../utils/moduleReward';

interface Props {
  module: ModuleContent;
  progress: ModuleProgress;
  allModuleProgress: ModuleProgress[];
  className?: string;
}

export function ModuleCompletionReward({
  module,
  progress,
  allModuleProgress,
  className = '',
}: Props) {
  if (!progress.postCheckAt) return null;

  const scoreDelta = delta(progress.preCheckScore, progress.postCheckScore);
  const confidenceDelta = delta(progress.preCheckConfidence, progress.postCheckConfidence);
  const postScore = progress.postCheckScore ?? 0;
  const postConfidence = progress.postCheckConfidence ?? 0;
  const verdict = completionVerdict(postScore, postConfidence);
  const targets = reviewTargets(module, progress, scoreDelta, confidenceDelta);
  const nextModule = nextRecommendedModule(module.id, allModuleProgress);

  return (
    <section className={['card-premium', className].filter(Boolean).join(' ')}>
      <div className="card-premium-bar" />
      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] sm:p-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
            <Icon name="check-circle" size={14} />
            Module outcome saved
          </div>
          <h2 className="mt-3 text-2xl text-ucla-950 sm:text-3xl">
            {verdict.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {verdict.body}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <RewardMetric
              label="Post score"
              value={`${Math.round(postScore)}%`}
              subvalue={scoreDelta !== null ? `Δ ${formatSigned(scoreDelta)}%` : 'Baseline needed'}
              tone={deltaTone(scoreDelta)}
            />
            <RewardMetric
              label="Confidence"
              value={`${progress.postCheckConfidence ?? '—'}/5`}
              subvalue={
                confidenceDelta !== null
                  ? `Δ ${formatSigned(confidenceDelta)}`
                  : 'Baseline needed'
              }
              tone={deltaTone(confidenceDelta)}
            />
            <RewardMetric
              label="Readiness"
              value={verdict.badge}
              subvalue={verdict.subvalue}
              tone={verdict.tone}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-white bg-white/85 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Best next reps
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {targets.map((target) => (
                <article
                  key={target.title}
                  className="rounded-xl border border-ucla-100 bg-ucla-50/60 p-3"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-ucla-900">
                    <Icon name={target.icon} size={15} className="text-ucla-700" />
                    {target.title}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {target.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-ucla-100 bg-white/90 p-4 shadow-soft">
          <div className="text-sm font-semibold text-ucla-900">Keep the momentum</div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Use the result while it is fresh: either move forward, or do a short image-call block
            if the score and confidence are not aligned yet.
          </p>
          <div className="mt-4 grid gap-2">
            {nextModule ? (
              <Link
                to={`/modules/${nextModule.id}`}
                className="btn-primary justify-between no-underline"
              >
                Next module: {nextModule.shortTitle}
                <Icon name="arrow-right" size={14} />
              </Link>
            ) : (
              <Link to="/quiz/post" className="btn-primary justify-between no-underline">
                Finish course post-check
                <Icon name="arrow-right" size={14} />
              </Link>
            )}
            <Link to="/atlas" className="btn-secondary justify-between no-underline">
              Do 5 atlas image calls
              <Icon name="image" size={14} />
            </Link>
            <Link
              to={`/modules/${module.id}/cheatsheet`}
              className="btn-secondary justify-between no-underline"
            >
              Save the cheat sheet
              <Icon name="printer" size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

function RewardMetric({
  label,
  value,
  subvalue,
  tone,
}: {
  label: string;
  value: string;
  subvalue: string;
  tone: RewardTone;
}) {
  const toneClass =
    tone === 'positive'
      ? 'border-emerald-100 bg-emerald-50 text-emerald-900'
      : tone === 'caution'
        ? 'border-amber-200 bg-amber-50 text-amber-950'
        : 'border-ucla-100 bg-white text-ucla-950';

  return (
    <div className={['rounded-2xl border p-4 shadow-soft', toneClass].join(' ')}>
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-75">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs font-semibold opacity-80">{subvalue}</div>
    </div>
  );
}
