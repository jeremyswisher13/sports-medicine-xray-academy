import { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { CasePracticeCard } from '../components/CasePracticeCard';
import { moduleContents } from '../data/modules';

export function CasesPage() {
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

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

      <div className="mt-6 space-y-4">
        {filtered.map((c) => (
          <CasePracticeCard key={c.id} scenario={c} />
        ))}
        {filtered.length === 0 && (
          <div className="card p-6 text-center text-sm text-slate-500">
            No cases match those filters.
          </div>
        )}
      </div>
    </div>
  );
}
