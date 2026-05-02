import { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { XRayImage } from '../components/XRayImage';
import { getAllRealImages } from '../data/images';
import { moduleSummaries } from '../data/moduleSummaries';

type AtlasKind = 'all' | 'normal' | 'pathology';

export function AtlasPage() {
  const allImages = useMemo(() => getAllRealImages(), []);
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [kindFilter, setKindFilter] = useState<AtlasKind>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return allImages.filter((img) => {
      const matchesModule =
        moduleFilter === 'all' || img.moduleId === moduleFilter;
      const matchesKind =
        kindFilter === 'all' ||
        (kindFilter === 'normal' && img.isNormal) ||
        (kindFilter === 'pathology' && !img.isNormal);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [img.caption, img.alt, img.attribution]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesModule && matchesKind && matchesQuery;
    });
  }, [allImages, moduleFilter, kindFilter, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const img of filtered) {
      const key = img.moduleId ?? 'other';
      const arr = map.get(key) ?? [];
      arr.push(img);
      map.set(key, arr);
    }
    return map;
  }, [filtered]);

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-title">Open-license teaching atlas</div>
          <h1 className="mt-1 text-balance">Image atlas</h1>
          <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
            Curated open-license radiographs from Wikimedia Commons. All images include source
            attribution and license metadata. Click any image to view its full Wikimedia source page.
          </p>
        </div>
        <div className="card flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
            <Icon name="image" size={16} />
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Atlas
            </div>
            <div className="text-sm font-semibold text-ucla-900">
              {allImages.length} images · {allImages.filter((i) => i.isNormal).length} normal ·{' '}
              {allImages.filter((i) => !i.isNormal).length} pathology
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(['all', 'normal', 'pathology'] as const).map((k) => {
          const active = kindFilter === k;
          const count =
            k === 'all'
              ? allImages.length
              : k === 'normal'
                ? allImages.filter((i) => i.isNormal).length
                : allImages.filter((i) => !i.isNormal).length;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={[
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize',
                active
                  ? k === 'normal'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-ucla-600 bg-ucla-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
              ].join(' ')}
            >
              {k === 'all' ? 'All' : k === 'normal' ? 'Normal anatomy' : 'Pathology'} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={14} />
          </span>
          <input
            className="input pl-9"
            placeholder="Search by finding, view, or contributor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input"
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
        >
          <option value="all">All modules</option>
          {moduleSummaries.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
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
                    {list.length} image{list.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((img) => (
                    <XRayImage key={img.id} entry={img} />
                  ))}
                </div>
              </section>
            );
          })}
        {grouped.size === 0 && (
          <div className="card p-6 text-center text-sm text-slate-500">
            No images match those filters.
          </div>
        )}
      </div>

      <div className="mt-10 card p-5 text-xs text-slate-500 leading-relaxed">
        <div className="font-semibold text-ucla-900 mb-1">Licensing and patient-image policy</div>
        Images in this atlas are sourced from Wikimedia Commons under CC0, public domain, CC BY-SA
        3.0, CC BY-SA 4.0, or compatible CC licenses. Each image is attributed to its contributor
        and links back to the original Wikimedia file page. Patient images should only be added
        after institutional educational-use approval, complete de-identification, metadata removal,
        and review for this distribution context.
      </div>
    </div>
  );
}
