import { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { VideoResourceCard } from '../components/VideoResourceCard';
import { moduleSummaries } from '../data/moduleSummaries';
import { videoResources } from '../data/videoResources';
import { useProgress } from '../hooks/useProgress';
import type { LearnerLevel } from '../types';

const levelOptions: ('all' | LearnerLevel)[] = [
  'all',
  'Resident',
  'Fellow',
  'Advanced Fellow',
];

export function VideosPage() {
  const { snapshot, refresh } = useProgress();
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<(typeof levelOptions)[number]>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'incomplete'>(
    'all',
  );
  const [query, setQuery] = useState('');

  const completionMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const v of snapshot.videos) m[v.videoId] = Boolean(v.markedComplete);
    return m;
  }, [snapshot.videos]);

  const filtered = useMemo(() => {
    return videoResources.filter((v) => {
      const matchesModule = moduleFilter === 'all' || v.moduleId === moduleFilter;
      const matchesLevel = levelFilter === 'all' || v.learnerLevel === levelFilter;
      const isComplete = completionMap[v.id];
      const matchesCompletion =
        completionFilter === 'all' ||
        (completionFilter === 'completed' && isComplete) ||
        (completionFilter === 'incomplete' && !isComplete);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [v.title, v.summary, v.clinicalWhy].join(' ').toLowerCase().includes(q);
      return matchesModule && matchesLevel && matchesCompletion && matchesQuery;
    });
  }, [moduleFilter, levelFilter, completionFilter, query, completionMap]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const v of filtered) {
      const arr = map.get(v.moduleId) ?? [];
      arr.push(v);
      map.set(v.moduleId, arr);
    }
    return map;
  }, [filtered]);

  const totalCompleted = videoResources.filter((v) => completionMap[v.id]).length;
  const completionPct = (totalCompleted / videoResources.length) * 100;

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-title">Supplemental external resources</div>
          <h1 className="mt-1 text-balance">AMSSM video library</h1>
          <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
            Curated AMSSM YouTube videos that complement the Swisher / UCLA curriculum. Embedded
            videos are external resources — not original UCLA content.
          </p>
        </div>
        <div className="card flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
            <Icon name="youtube" size={16} />
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Library completion
            </div>
            <div className="text-sm font-semibold text-ucla-900">
              {totalCompleted} / {videoResources.length} videos ({Math.round(completionPct)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={14} />
          </span>
          <input
            className="input pl-9"
            placeholder="Search videos…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search videos"
          />
        </div>
        <select
          className="input"
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          aria-label="Filter by module"
        >
          <option value="all">All modules</option>
          {moduleSummaries.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as (typeof levelOptions)[number])}
          aria-label="Filter by learner level"
        >
          {levelOptions.map((l) => (
            <option key={l} value={l}>
              {l === 'all' ? 'All learner levels' : l}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={completionFilter}
          onChange={(e) =>
            setCompletionFilter(e.target.value as 'all' | 'completed' | 'incomplete')
          }
          aria-label="Filter by completion"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      <div className="mt-6 space-y-8">
        {moduleSummaries
          .filter((m) => grouped.has(m.id))
          .map((m) => {
            const list = grouped.get(m.id) ?? [];
            return (
              <section key={m.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl">{m.title}</h2>
                  <span className="text-xs text-slate-500">
                    {list.length} video{list.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  {list.map((v) => {
                    const initial = snapshot.videos.find((vp) => vp.videoId === v.id) ?? null;
                    return (
                      <VideoResourceCard
                        key={v.id}
                        video={v}
                        initialProgress={initial}
                        onProgressChange={() => void refresh()}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        {grouped.size === 0 && (
          <div className="card p-6 text-center text-sm text-slate-500">
            No videos match those filters.
          </div>
        )}
      </div>
    </div>
  );
}
