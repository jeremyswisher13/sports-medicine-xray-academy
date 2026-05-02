import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { moduleSummaries } from '../data/modules';

export function CheatSheetsPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <div>
        <div className="section-title">Printable references</div>
        <h1 className="mt-1 text-balance">Cheat sheets</h1>
        <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
          One-page summaries — Systematic X-Ray Read, do-not-miss, pearls, pitfalls, and escalation
          triggers. Open a sheet and use your browser's "Print / Save as PDF" to keep it on hand.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {moduleSummaries.map((m) => (
          <Link
            key={m.id}
            to={`/modules/${m.id}/cheatsheet`}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft transition-shadow hover:shadow-card no-underline"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="pill">{m.region}</span>
              <span className="pill-primary">
                <Icon name="clipboard" size={11} />
                1-page PDF
              </span>
            </div>
            <h3 className="mt-3 text-lg text-balance text-ucla-900 group-hover:text-ucla-700">
              {m.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed line-clamp-3">
              {m.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-ucla-700">
              Open cheat sheet
              <Icon name="arrow-right" size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
