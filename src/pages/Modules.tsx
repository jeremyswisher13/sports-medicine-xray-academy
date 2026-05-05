import { useMemo, useState } from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { Icon } from '../components/ui/Icon';
import { modulePhaseCount } from '../data/learningFlow';
import { moduleSummaries } from '../data/moduleSummaries';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { useProgress } from '../hooks/useProgress';
import type { ModuleRegion } from '../types';

const allRegions: ('All' | ModuleRegion)[] = [
  'All',
  'Foundations',
  'Upper Extremity',
  'Lower Extremity',
  'Axial',
  'Pediatric',
  'High-Yield Cases',
];

export function ModulesPage() {
  const { learnerPreview } = useAuth();
  const { snapshot } = useProgress();
  const { isModuleSaved, toggleModuleBookmark } = useBookmarks();
  const learnerModules = learnerPreview ? [] : snapshot.modules;
  const [region, setRegion] = useState<(typeof allRegions)[number]>('All');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const matches = moduleSummaries.filter((m) => {
      const matchesRegion = region === 'All' || m.region === region;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [m.title, m.shortTitle, m.description, m.region, ...m.emphasis]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesRegion && matchesQuery;
    });
    return matches;
  }, [region, query]);

  const readyModules = list;

  function progressFor(moduleId: string): number {
    const p = learnerModules.find((m) => m.moduleId === moduleId);
    if (!p) return 0;
    if (p.completed) return 100;
    if (p.completedTabs?.length) {
      return Math.min(100, (p.completedTabs.length / modulePhaseCount) * 100);
    }
    return p.visited ? 10 : 0;
  }

  function confidenceFor(moduleId: string): number | null {
    const p = learnerModules.find((m) => m.moduleId === moduleId);
    return p?.postCheckConfidence ?? p?.preCheckConfidence ?? null;
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-title">Curriculum</div>
          <h1 className="mt-1 text-balance">Modules</h1>
          <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
            Sports medicine x-ray interpretation organized by body region and clinical theme.
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={14} />
          </span>
          <input
            className="input pl-9"
            placeholder="Search modules…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search modules"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {allRegions.map((r) => {
          const active = region === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={[
                'rounded-full border px-3 py-1.5 text-xs font-semibold',
                active
                  ? 'border-ucla-200 bg-ucla-50 text-ucla-900 ring-1 ring-ucla-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
              ].join(' ')}
            >
              {r}
            </button>
          );
        })}
      </div>

      {readyModules.length > 0 && (
        <section className="mt-6">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <h2 className="text-xl text-ucla-900">Course modules</h2>
              <p className="mt-1 text-sm text-slate-500">
                Complete active-learning lessons that count toward course completion.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              Start here
            </span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {readyModules.map((m) => (
              <ModuleCard
                key={m.id}
                module={m}
                progressPercent={progressFor(m.id)}
                completed={learnerModules.find((x) => x.moduleId === m.id)?.completed}
                confidence={confidenceFor(m.id)}
                saved={isModuleSaved(m.id)}
                onToggleSaved={(module) => void toggleModuleBookmark(module)}
              />
            ))}
          </div>
        </section>
      )}

      {list.length === 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card col-span-full p-6 text-center text-sm text-slate-500">
            No modules match that search.
          </div>
        </div>
      )}
    </div>
  );
}
