import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import { getModule } from '../data/modules';

// One-page printable cheat sheet. Designed for browser → "Save as PDF" or print.
// All print-only / screen-only flourishes are gated by the `print:` and
// `screen:` Tailwind variants so the same JSX serves both audiences.
export function CheatSheetPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = getModule(moduleId ?? '');
  const navigate = useNavigate();

  // Tighten the document for print: remove page margins/scroll so the
  // print preview shows the cheat sheet exactly.
  useEffect(() => {
    const original = document.body.style.background;
    document.body.style.background = '#FFFFFF';
    return () => {
      document.body.style.background = original;
    };
  }, []);

  if (!module) {
    return (
      <div className="container-page py-12">
        <div className="card p-6 text-center">
          <h2>Module not found</h2>
          <p className="mt-2 text-slate-600">
            <Link to="/modules" className="underline">
              Back to modules
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Screen-only top bar */}
      <div className="screen-only border-b border-slate-200 bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-slate-500 hover:text-slate-800"
            >
              ← Back
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">
              {module.title} · Cheat Sheet
            </span>
          </div>
          <div className="flex gap-2">
            <Link to="/cheatsheets" className="btn-ghost">
              All cheat sheets
            </Link>
            <button type="button" className="btn-primary" onClick={() => window.print()}>
              <Icon name="clipboard" size={14} />
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* The printable page itself. Width clamped to 8.5in for screen preview. */}
      <article className="cheatsheet mx-auto bg-white text-[10pt] leading-snug text-slate-900 print:p-0 print:shadow-none print:border-none print:max-w-none print:w-full">
        {/* Header */}
        <header className="cheatsheet-header flex items-end justify-between gap-4 border-b-2 border-ucla-800 pb-3">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <div className="text-[8pt] font-semibold uppercase tracking-[0.18em] text-ucla-700">
                Sports Medicine X-Ray Academy
              </div>
              <h1 className="font-serif text-[20pt] leading-tight text-ucla-900">
                {module.title}
              </h1>
              <div className="text-[8pt] text-slate-500">
                Jeremy Swisher, MD · UCLA Sports Medicine · {module.region}
              </div>
            </div>
          </div>
          <div className="text-right text-[8pt] text-slate-500">
            <div className="font-semibold text-slate-700">Cheat sheet</div>
            <div>swisher-xray-academy.web.app</div>
            <div>{new Date().toLocaleDateString()}</div>
          </div>
        </header>

        {/* Two-column body */}
        <div className="mt-4 grid grid-cols-12 gap-x-5 gap-y-4">
          {/* LEFT (8 cols on print) */}
          <div className="col-span-12 print:col-span-7 lg:col-span-7 space-y-4">
            {/* Systematic Read framework */}
            <section>
              <H2>Systematic X-Ray Read</H2>
              <ol className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[9.5pt]">
                {module.systematicChecklist.map((s, i) => (
                  <li key={s.step} className="leading-snug">
                    <span className="font-bold text-ucla-800">{i + 1}. {s.step}.</span>{' '}
                    <span className="text-slate-700">
                      {s.prompts.slice(0, 3).join(' · ')}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Views to order */}
            {module.views.length > 0 && (
              <section>
                <H2>Views to Order</H2>
                <ul className="mt-1 space-y-1 text-[9.5pt]">
                  {module.views.map((v) => (
                    <li key={v.name} className="leading-snug">
                      <span className="font-semibold text-slate-900">{v.name}.</span>{' '}
                      <span className="text-slate-700">{v.why}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Pathology compare-and-contrast (top 3) */}
            {module.pathology.length > 0 && (
              <section>
                <H2>Pathology Patterns</H2>
                <div className="mt-1 grid grid-cols-1 gap-2">
                  {module.pathology.slice(0, 3).map((p) => (
                    <div
                      key={p.finding}
                      className="rounded border border-slate-200 bg-slate-50/60 px-2.5 py-1.5 text-[9pt]"
                    >
                      <div className="font-semibold text-ucla-800">{p.finding}</div>
                      <div className="text-slate-700">
                        <span className="text-emerald-700 font-semibold">Normal:</span> {p.normal}{' '}
                        ·{' '}
                        <span className="text-rose-700 font-semibold">Pathologic:</span>{' '}
                        {p.pathologic}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Clue:</span> {p.keyClue} ·{' '}
                        <span className="font-semibold">Next:</span> {p.nextStep}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pearls */}
            {module.pearls.length > 0 && (
              <section>
                <H2>Clinical Pearls</H2>
                <ul className="mt-1 space-y-1 text-[9.5pt]">
                  {module.pearls.slice(0, 4).map((p) => (
                    <li key={p.title} className="leading-snug">
                      <span className="font-semibold text-gold-800">{p.title}.</span>{' '}
                      <span className="text-slate-700">{p.body}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* RIGHT (5 cols on print) */}
          <aside className="col-span-12 print:col-span-5 lg:col-span-5 space-y-4">
            {/* Do Not Miss */}
            {module.doNotMiss.length > 0 && (
              <section className="rounded border border-rose-200 bg-rose-50/40 p-3">
                <H2 tone="rose">Do Not Miss</H2>
                <ul className="mt-1 space-y-1 text-[9pt]">
                  {module.doNotMiss.slice(0, 5).map((d) => (
                    <li key={d.title} className="leading-snug">
                      <span className="font-semibold text-rose-900">{d.title}.</span>{' '}
                      <span className="text-slate-700">{d.imagingNext}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Pitfalls */}
            {module.pitfalls.length > 0 && (
              <section className="rounded border border-amber-200 bg-amber-50/40 p-3">
                <H2 tone="amber">Pitfalls</H2>
                <ul className="mt-1 space-y-1 text-[9pt]">
                  {module.pitfalls.slice(0, 4).map((p) => (
                    <li key={p.title} className="leading-snug">
                      <span className="font-semibold text-amber-900">{p.title}.</span>{' '}
                      <span className="text-slate-700">{p.body}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Escalation */}
            {module.whenToEscalate.length > 0 && (
              <section className="rounded border border-ucla-200 bg-ucla-50/40 p-3">
                <H2 tone="ucla">When to Escalate</H2>
                <ul className="mt-1 space-y-1 text-[9pt]">
                  {module.whenToEscalate.map((line) => (
                    <li key={line} className="leading-snug text-slate-700">
                      • {line}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Takeaways */}
            {module.keyTakeaways.length > 0 && (
              <section>
                <H2>Key Takeaways</H2>
                <ul className="mt-1 space-y-1 text-[9pt]">
                  {module.keyTakeaways.slice(0, 5).map((line) => (
                    <li key={line} className="leading-snug text-slate-700">
                      • {line}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>

        {/* Footer */}
        <footer className="cheatsheet-footer mt-4 border-t border-slate-200 pt-2 flex flex-wrap items-center justify-between gap-2 text-[8pt] text-slate-500">
          <div>
            For clinician education only · does not replace formal radiology interpretation, clinical
            judgment, or institutional protocols.
          </div>
          <div className="text-right">
            © {new Date().getFullYear()} Jeremy Swisher, MD · swisher-xray-academy.web.app
          </div>
        </footer>
      </article>
    </div>
  );
}

function H2({ children, tone = 'ucla' }: { children: React.ReactNode; tone?: 'ucla' | 'rose' | 'amber' }) {
  const cls =
    tone === 'rose'
      ? 'text-rose-800'
      : tone === 'amber'
        ? 'text-amber-800'
        : 'text-ucla-800';
  return (
    <h2
      className={[
        'font-sans text-[9pt] font-semibold uppercase tracking-[0.16em]',
        cls,
      ].join(' ')}
    >
      {children}
    </h2>
  );
}
