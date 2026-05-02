import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { moduleSummaries } from '../data/moduleSummaries';

export function CheatSheetsPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <header className="overflow-hidden rounded-xl border border-ucla-800 bg-ucla-950 p-6 text-white shadow-elevated sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-200">
              Printable references
            </div>
            <h1 className="mt-1 text-balance text-white">Cheat sheets</h1>
            <p className="mt-2 max-w-prose leading-relaxed text-slate-200">
              One-page summaries for clinic: Systematic X-Ray Read, views, do-not-miss findings,
              pitfalls, and escalation triggers.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100">
            <div className="font-semibold text-white">Print-ready</div>
            <div className="text-xs text-slate-300">Open any sheet, then Print / Save as PDF.</div>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {moduleSummaries.map((m) => (
          <Link
            key={m.id}
            to={`/modules/${m.id}/cheatsheet`}
            className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-soft transition-shadow hover:shadow-card no-underline"
          >
            <div className="h-1 bg-ucla-800" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="pill">{m.region}</span>
                <span className="pill-primary">
                  <Icon name="printer" size={11} />
                  1-page PDF
                </span>
              </div>
              <h3 className="mt-3 text-lg text-balance text-ucla-900 group-hover:text-ucla-700">
                {m.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed line-clamp-3">
                {m.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ucla-800 px-3 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-ucla-900">
                Open cheat sheet
                <Icon name="arrow-right" size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
