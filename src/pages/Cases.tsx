import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { CasePracticeCard } from '../components/CasePracticeCard';
import { moduleContents } from '../data/modules';

export function CasesPage() {
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  const allCases = useMemo(
    () =>
      moduleContents.flatMap((m) =>
        m.cases.map((c) => ({ moduleTitle: m.title, ...c })),
      ),
    [],
  );

  const filtered = useMemo(() => {
    return allCases.filter((c) => {
      const matchesModule =
        moduleFilter === 'all' || c.moduleId === moduleFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [c.title, c.symptoms, c.mechanism, c.sportOrActivity, c.moduleTitle]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesModule && matchesQuery;
    });
  }, [allCases, moduleFilter, query]);

  useEffect(() => {
    if (filtered.length === 0) {
      setActiveCaseId(null);
      return;
    }
    if (!activeCaseId || !filtered.some((caseItem) => caseItem.id === activeCaseId)) {
      setActiveCaseId(filtered[0].id);
    }
  }, [activeCaseId, filtered]);

  const activeCase = filtered.find((caseItem) => caseItem.id === activeCaseId) ?? filtered[0];
  const activeCaseIndex = activeCase
    ? filtered.findIndex((caseItem) => caseItem.id === activeCase.id)
    : -1;

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-title">Case library</div>
          <h1 className="mt-1 text-balance">Sports medicine case practice</h1>
          <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
            Apply the Systematic X-Ray Read to representative cases. Each case uses
            open-license teaching radiographs where available.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
            <input
              className="input pl-9"
              placeholder="Search cases…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search cases"
            />
          </div>
          <select
            className="input w-full sm:w-auto"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            aria-label="Filter by module"
          >
            <option value="all">All modules</option>
            {moduleContents.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        {activeCase ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
            <aside className="card h-fit p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="section-title">Case queue</div>
                  <h2 className="mt-1 text-base text-ucla-900">
                    {activeCaseIndex + 1} of {filtered.length}
                  </h2>
                </div>
                <span className="pill border-ucla-100 bg-ucla-50 text-ucla-800">
                  One at a time
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Pick one case, commit to a read, then move to the next. This keeps the page
                from becoming a stack of answer forms.
              </p>
              <div className="mt-4 grid gap-2">
                {filtered.map((caseItem, index) => {
                  const selected = caseItem.id === activeCase.id;
                  return (
                    <button
                      key={caseItem.id}
                      type="button"
                      onClick={() => setActiveCaseId(caseItem.id)}
                      className={[
                        'rounded-2xl border p-3 text-left transition-colors',
                        selected
                          ? 'border-ucla-300 bg-ucla-50 text-ucla-950 shadow-soft'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-ucla-200 hover:bg-ucla-50/60',
                      ].join(' ')}
                      aria-pressed={selected}
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ucla-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] ring-1 ring-ucla-100">
                          {index + 1}
                        </span>
                        {caseItem.moduleTitle}
                      </div>
                      <div className="mt-1 text-sm font-semibold leading-snug">
                        {caseItem.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {caseItem.patientAge} · {caseItem.sportOrActivity}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
            <div className="min-w-0">
              <CasePracticeCard key={activeCase.id} scenario={activeCase} />
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={activeCaseIndex <= 0}
                  onClick={() => setActiveCaseId(filtered[activeCaseIndex - 1]?.id ?? activeCase.id)}
                >
                  <Icon name="chevron-left" size={14} />
                  Previous case
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={activeCaseIndex >= filtered.length - 1}
                  onClick={() => setActiveCaseId(filtered[activeCaseIndex + 1]?.id ?? activeCase.id)}
                >
                  Next case
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center text-sm text-slate-500">
            No cases match those filters.
          </div>
        )}
      </div>
    </div>
  );
}
