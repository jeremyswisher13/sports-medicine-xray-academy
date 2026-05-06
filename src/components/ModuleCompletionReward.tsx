import { Link } from 'react-router-dom';
import { moduleSummaries } from '../data/moduleSummaries';
import type { ModuleContent, ModuleProgress } from '../types';
import { Icon, type IconName } from './ui/Icon';

interface Props {
  module: ModuleContent;
  progress: ModuleProgress;
  allModuleProgress: ModuleProgress[];
  className?: string;
}

interface ReviewTarget {
  title: string;
  body: string;
  icon: IconName;
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
    <section
      className={[
        'overflow-hidden rounded-2xl border border-ucla-100 bg-gradient-to-br from-white via-ucla-50/80 to-white shadow-card',
        className,
      ].join(' ')}
    >
      <div className="h-1 bg-gradient-to-r from-ucla-500 via-gold-500 to-ucla-400" />
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
              value={`${postConfidence || '—'}/5`}
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
  tone: 'positive' | 'neutral' | 'caution';
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

function delta(before?: number, after?: number): number | null {
  if (before === undefined || after === undefined) return null;
  return after - before;
}

function formatSigned(value: number): string {
  return `${value > 0 ? '+' : ''}${Math.round(value)}`;
}

function deltaTone(value: number | null): 'positive' | 'neutral' | 'caution' {
  if (value === null) return 'neutral';
  if (value < 0) return 'caution';
  return 'positive';
}

function completionVerdict(score: number, confidence: number): {
  title: string;
  body: string;
  badge: string;
  subvalue: string;
  tone: 'positive' | 'neutral' | 'caution';
} {
  if (score >= 85 && confidence >= 4) {
    return {
      title: 'Strong finish. This read pattern is sticking.',
      body:
        'Your score and confidence are aligned. Keep reinforcing the skill with normal-first image calls and cases.',
      badge: 'Ready',
      subvalue: 'Score and confidence aligned',
      tone: 'positive',
    };
  }
  if (score >= 70 || confidence >= 4) {
    return {
      title: 'Good progress. One focused pass will tighten this.',
      body:
        'You have useful traction. The next best move is targeted review rather than restarting the whole module.',
      badge: 'Close',
      subvalue: 'Target weak areas',
      tone: 'neutral',
    };
  }
  return {
    title: 'Useful calibration. Rebuild the read once more.',
    body:
      'This is exactly why the post-check exists: it shows where the pattern needs another active pass before clinic use.',
    badge: 'Review',
    subvalue: 'Repeat guided reps',
    tone: 'caution',
  };
}

function reviewTargets(
  module: ModuleContent,
  progress: ModuleProgress,
  scoreDelta: number | null,
  confidenceDelta: number | null,
): ReviewTarget[] {
  const targets: ReviewTarget[] = [];
  const postScore = progress.postCheckScore ?? 0;
  const postConfidence = progress.postCheckConfidence ?? 0;

  if (postScore < 80) {
    targets.push({
      title: 'Redo the read',
      body: 'Repeat the guided systematic read before looking back at the explanations.',
      icon: 'clipboard',
    });
  }
  if (postConfidence < 4 || (confidenceDelta !== null && confidenceDelta <= 0)) {
    targets.push({
      title: 'Normal-first reps',
      body: `Use the atlas to call ${module.shortTitle.toLowerCase()} images before captions reveal.`,
      icon: 'image',
    });
  }
  if (scoreDelta !== null && scoreDelta <= 0) {
    targets.push({
      title: 'Missed concepts',
      body: 'Review quiz explanations and the one-page cheat sheet, then retake later.',
      icon: 'sparkles',
    });
  }
  if (targets.length === 0) {
    targets.push(
      {
        title: 'Maintain fluency',
        body: 'Do a short atlas block later this week so normal anatomy stays automatic.',
        icon: 'image',
      },
      {
        title: 'Clinic sheet',
        body: 'Use the cheat sheet once in clinic to reinforce escalation thresholds.',
        icon: 'printer',
      },
      {
        title: 'Teach it back',
        body: 'Explain one do-not-miss finding out loud without looking at notes.',
        icon: 'book-open',
      },
    );
  }

  return targets.slice(0, 3);
}

function nextRecommendedModule(currentModuleId: string, progress: ModuleProgress[]) {
  const completedIds = new Set(
    progress.filter((item) => item.completed).map((item) => item.moduleId),
  );
  const currentIndex = Math.max(
    0,
    moduleSummaries.findIndex((summary) => summary.id === currentModuleId),
  );
  const ordered = [
    ...moduleSummaries.slice(currentIndex + 1),
    ...moduleSummaries.slice(0, currentIndex),
  ];
  return ordered.find((summary) => !completedIds.has(summary.id));
}
