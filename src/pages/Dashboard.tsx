import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { ModuleCard } from '../components/ModuleCard';
import { moduleSummaries } from '../data/modules';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';

const quickAccess = [
  { id: 'foundations', label: 'X-Ray Basics', to: '/modules/xray-foundations', icon: 'graduation' as const },
  { id: 'systematic', label: 'Systematic Approach', to: '/modules/xray-foundations#systematic', icon: 'clipboard' as const },
  { id: 'fractures', label: 'Common Fractures', to: '/modules', icon: 'bone' as const },
  { id: 'cases', label: 'Sports Medicine Cases', to: '/cases', icon: 'shield' as const },
  { id: 'peds', label: 'Pediatric Pearls', to: '/modules/pediatric-adolescent', icon: 'pediatric' as const },
  { id: 'videos', label: 'AMSSM Videos', to: '/videos', icon: 'youtube' as const },
  { id: 'flashcards', label: 'Flashcards', to: '/flashcards', icon: 'sparkles' as const },
  { id: 'cheatsheets', label: 'Cheat Sheets', to: '/cheatsheets', icon: 'clipboard' as const },
  { id: 'atlas', label: 'Image Atlas', to: '/atlas', icon: 'image' as const },
  { id: 'quiz', label: 'Quiz Mode', to: '/quiz/pre', icon: 'lightning' as const },
  { id: 'confidence', label: 'Confidence Ratings', to: '/progress', icon: 'star' as const },
];

export function DashboardPage() {
  const { user, learnerPreview } = useAuth();
  const { snapshot } = useProgress();
  const [query, setQuery] = useState('');
  const learnerModules = learnerPreview ? [] : snapshot.modules;
  const learnerConfidence = learnerPreview ? [] : snapshot.confidence;
  const learnerCases = learnerPreview ? [] : snapshot.cases;
  const learnerVideos = learnerPreview ? [] : snapshot.videos;
  const learnerQuizzes = learnerPreview ? [] : snapshot.quizzes;

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return moduleSummaries;
    return moduleSummaries.filter((m) =>
      [m.title, m.shortTitle, m.description, ...m.emphasis, m.region]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  const completedCount = learnerModules.filter((m) => m.completed).length;
  const totalCount = moduleSummaries.length;
  const overallPct = (completedCount / Math.max(totalCount, 1)) * 100;

  function progressFor(moduleId: string): number {
    const p = learnerModules.find((m) => m.moduleId === moduleId);
    if (!p) return 0;
    if (p.completed) return 100;
    if (p.completedTabs?.length) {
      return Math.min(100, (p.completedTabs.length / 11) * 100);
    }
    return p.visited ? 10 : 0;
  }

  function confidenceFor(moduleId: string): number | null {
    const c = learnerConfidence.filter((c) => c.scope === 'module' && c.moduleId === moduleId);
    if (!c.length) return null;
    return c.at(-1)!.value;
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80 gradient-hero">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ucla-700">
              UCLA Sports Medicine • Jeremy Swisher, MD
            </div>
            <h1 className="mt-2 text-balance">Sports Medicine X-Ray Academy</h1>
            <p className="mt-3 max-w-prose text-slate-600 leading-relaxed">
              A high-yield radiograph interpretation platform for UCLA family medicine residents
              and sports medicine fellows.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/modules/xray-foundations" className="btn-primary">
                Start X-Ray Foundations
                <Icon name="arrow-right" size={14} />
              </Link>
              <Link to="/quiz/pre" className="btn-secondary">
                Pre-course assessment
              </Link>
            </div>
          </div>
          <div className="card p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your progress
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums text-ucla-900">
                {completedCount}
              </span>
              <span className="text-sm text-slate-500">of {totalCount} modules</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-ucla-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
              <div>
                <div className="font-semibold text-ucla-900 tabular-nums">
                  {learnerCases.length}
                </div>
                Cases attempted
              </div>
              <div>
                <div className="font-semibold text-ucla-900 tabular-nums">
                  {learnerVideos.filter((v) => v.markedComplete).length}
                </div>
                Videos completed
              </div>
              <div>
                <div className="font-semibold text-ucla-900 tabular-nums">
                  {learnerQuizzes.length}
                </div>
                Quiz attempts
              </div>
            </div>
            {user && (
              <p className="mt-3 text-[11px] text-slate-500">
                Signed in as {user.email || user.displayName} (
                {learnerPreview ? 'learner preview' : user.role}).
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2>Quick access</h2>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {quickAccess.map((q) => (
            <Link
              key={q.id}
              to={q.to}
              className="group flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-3 no-underline shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800 transition-colors group-hover:bg-ucla-100">
                <Icon name={q.icon} size={16} />
              </span>
              <span className="text-sm font-semibold text-slate-800">{q.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2>Modules</h2>
            <p className="mt-1 text-sm text-slate-500">
              Each module follows the Systematic X-Ray Read framework.
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
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((m) => (
            <ModuleCard
              key={m.id}
              module={m}
              progressPercent={progressFor(m.id)}
              completed={learnerModules.find((x) => x.moduleId === m.id)?.completed}
              confidence={confidenceFor(m.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
