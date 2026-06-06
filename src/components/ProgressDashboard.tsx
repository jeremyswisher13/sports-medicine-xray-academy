import { useMemo } from 'react';
import { Icon } from './ui/Icon';
import { moduleSummaries } from '../data/moduleSummaries';
import { videoResources } from '../data/videoResources';
import type { ProgressSnapshot } from '../hooks/useProgress';

interface Props {
  snapshot: ProgressSnapshot;
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function ProgressDashboard({ snapshot }: Props) {
  const summary = useMemo(() => {
    const courseModuleIds = new Set(moduleSummaries.map((module) => module.id));
    const completedModules = snapshot.modules.filter(
      (m) => courseModuleIds.has(m.moduleId) && m.completed,
    ).length;
    const totalModules = moduleSummaries.length;
    const preQuiz = snapshot.quizzes.find((q) => q.scope === 'pre');
    const postQuiz = snapshot.quizzes.find((q) => q.scope === 'post');
    const preConfidence = snapshot.confidence
      .filter((c) => c.scope === 'pre')
      .map((c) => c.value);
    const postConfidence = snapshot.confidence
      .filter((c) => c.scope === 'post')
      .map((c) => c.value);
    const videosCompleted = snapshot.videos.filter((v) => v.markedComplete).length;
    const videosTotal = videoResources.length;
    const videoCompletionPct = videosTotal === 0 ? 0 : (videosCompleted / videosTotal) * 100;
    const reflectionsCompleted = snapshot.videos.filter(
      (v) => v.reflectionText && v.reflectionText.trim().length > 0,
    ).length;
    const casesCompleted = snapshot.cases.length;
    const correctCases = snapshot.cases.filter((c) => c.correct).length;
    return {
      completedModules,
      totalModules,
      preQuizScore: preQuiz?.scorePercent,
      postQuizScore: postQuiz?.scorePercent,
      preConfidenceAvg: avg(preConfidence),
      postConfidenceAvg: avg(postConfidence),
      videosCompleted,
      videosTotal,
      videoCompletionPct,
      reflectionsCompleted,
      casesCompleted,
      correctCases,
    };
  }, [snapshot]);

  const Stat = ({
    label,
    value,
    sublabel,
    iconName,
  }: {
    label: string;
    value: string;
    sublabel?: string;
    iconName: 'check-circle' | 'lightning' | 'youtube' | 'star' | 'clipboard';
  }) => (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
          <Icon name={iconName} size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </div>
          <div className="text-xl font-bold tabular-nums text-ucla-900">{value}</div>
          {sublabel && <div className="text-xs text-slate-500">{sublabel}</div>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          iconName="check-circle"
          label="Modules completed"
          value={`${summary.completedModules} / ${summary.totalModules}`}
        />
        <Stat
          iconName="lightning"
          label="Pre vs Post quiz"
          value={
            summary.preQuizScore !== undefined && summary.postQuizScore !== undefined
              ? `${Math.round(summary.preQuizScore)}% → ${Math.round(summary.postQuizScore)}%`
              : summary.preQuizScore !== undefined
                ? `${Math.round(summary.preQuizScore)}% • Post pending`
                : 'Pre pending'
          }
        />
        <Stat
          iconName="star"
          label="Confidence (pre → post)"
          value={
            summary.preConfidenceAvg && summary.postConfidenceAvg
              ? `${summary.preConfidenceAvg.toFixed(1)} → ${summary.postConfidenceAvg.toFixed(1)}`
              : summary.preConfidenceAvg
                ? `${summary.preConfidenceAvg.toFixed(1)} • Post pending`
                : 'Pre pending'
          }
          sublabel="Average across domains (1–5)"
        />
        <Stat
          iconName="youtube"
          label="AMSSM videos"
          value={`${summary.videosCompleted} / ${summary.videosTotal}`}
          sublabel={`${Math.round(summary.videoCompletionPct)}% complete`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-base text-ucla-900">Module progress</h3>
          <p className="mt-1 text-sm text-slate-500">
            Each module starts with a baseline check, moves through guided practice, and closes with an outcome check.
          </p>
          <ul className="mt-3 space-y-2">
            {moduleSummaries.map((m) => {
              const p = snapshot.modules.find((mp) => mp.moduleId === m.id);
              const latestConfidence = p?.postCheckConfidence ?? p?.preCheckConfidence;
              const scoreDelta =
                p?.preCheckScore !== undefined && p?.postCheckScore !== undefined
                  ? p.postCheckScore - p.preCheckScore
                  : null;
              const confDelta =
                p?.preCheckConfidence !== undefined && p?.postCheckConfidence !== undefined
                  ? p.postCheckConfidence - p.preCheckConfidence
                  : null;
              return (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="min-w-0 flex-1 basis-full truncate text-sm font-medium text-slate-800 sm:basis-auto">
                    {m.title}
                  </span>
                  <span className="pill">{m.region}</span>
                  {p?.completed ? (
                    <span className="pill-primary">Complete</span>
                  ) : p?.visited ? (
                    <span className="pill">In progress</span>
                  ) : (
                    <span className="pill">Not started</span>
                  )}
                  {scoreDelta !== null && (
                    <span
                      className={[
                        'pill',
                        scoreDelta > 0
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          : scoreDelta < 0
                            ? 'bg-rose-50 text-rose-800 border-rose-100'
                            : '',
                      ].join(' ')}
                      title={`Score: ${Math.round(p?.preCheckScore ?? 0)}% → ${Math.round(p?.postCheckScore ?? 0)}%`}
                    >
                      Δ {scoreDelta > 0 ? '+' : ''}
                      {Math.round(scoreDelta)}%
                    </span>
                  )}
                  {confDelta !== null && (
                    <span
                      className={[
                        'pill',
                        confDelta > 0
                          ? 'bg-gold-50 text-gold-800 border-gold-100'
                          : confDelta < 0
                            ? 'bg-rose-50 text-rose-800 border-rose-100'
                            : '',
                      ].join(' ')}
                      title={`Confidence: ${p?.preCheckConfidence}/5 → ${p?.postCheckConfidence}/5`}
                    >
                      <Icon name="star" size={11} /> {confDelta > 0 ? '+' : ''}
                      {confDelta}
                    </span>
                  )}
                  {scoreDelta === null && latestConfidence !== undefined && (
                    <span className="pill-gold">
                      <Icon name="star" size={11} />
                      {latestConfidence}/5
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="text-base text-ucla-900">Cases & reflections</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="flex items-center justify-between">
              <span>Cases attempted</span>
              <span className="font-semibold tabular-nums">{summary.casesCompleted}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Cases correct</span>
              <span className="font-semibold tabular-nums">{summary.correctCases}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Reflections submitted</span>
              <span className="font-semibold tabular-nums">{summary.reflectionsCompleted}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
