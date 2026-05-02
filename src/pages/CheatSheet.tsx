import { useEffect, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import { getModule } from '../data/modules';
import { getClinicCheatSheetSpec } from '../data/cheatSheetSpecs';

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

  const spec = getClinicCheatSheetSpec(module);

  return (
    <div className="bg-white">
      {/* Screen-only top bar */}
      <div className="screen-only border-b border-gold-500/50 bg-ucla-950 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-slate-200 hover:text-white"
            >
              ← Back
            </button>
            <span className="text-white/30">/</span>
            <span className="font-medium text-white">
              {module.title} · Cheat Sheet
            </span>
          </div>
          <div className="flex gap-2">
            <Link to="/cheatsheets" className="btn border-white/15 text-white hover:bg-white/10">
              All cheat sheets
            </Link>
            <button type="button" className="btn-gold" onClick={() => window.print()}>
              <Icon name="printer" size={14} />
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* The printable page itself. Width clamped to 8.5in for screen preview. */}
      <article className="cheatsheet mx-auto bg-white text-[9.5pt] leading-snug text-slate-900 print:p-0 print:shadow-none print:border-none print:max-w-none print:w-full">
        {/* Header */}
        <header className="cheatsheet-header flex items-end justify-between gap-4 border-b-2 border-ucla-800 pb-3">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <div className="text-[8pt] font-semibold uppercase tracking-[0.18em] text-ucla-700">
                Sports Medicine X-Ray Academy · Clinic-Ready Reference
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

        <section className="mt-3 rounded border border-ucla-200 bg-ucla-50/60 p-2.5">
          <div className="grid gap-2 print:grid-cols-3 lg:grid-cols-3">
            <CompactSection title="Minimum Series">
              <BulletList items={spec.requiredViews} max={4} />
            </CompactSection>
            <CompactSection title="Add When Needed">
              <BulletList items={spec.addOnViews} max={4} />
            </CompactSection>
            <CompactSection title="Adequacy Warning" tone="amber">
              <p className="text-[8.7pt] leading-snug text-slate-800">{spec.viewAdequacyWarning}</p>
            </CompactSection>
          </div>
        </section>

        <div className="mt-3 grid grid-cols-12 gap-x-4 gap-y-3">
          <div className="col-span-12 space-y-3 print:col-span-4 lg:col-span-4">
            <section>
              <H2>Systematic Read</H2>
              <ol className="mt-1 space-y-0.5 text-[8.8pt]">
                {module.systematicChecklist.map((s, i) => (
                  <li key={s.step} className="leading-snug">
                    <span className="font-bold text-ucla-800">{i + 1}. {s.step}:</span>{' '}
                    <span className="text-slate-700">
                      {s.prompts.slice(0, 3).join(' / ')}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded border border-slate-200 bg-slate-50/60 p-2.5">
              <H2>Signs + Measurements</H2>
              <BulletList items={spec.signs} max={6} />
            </section>
          </div>

          <div className="col-span-12 space-y-3 print:col-span-4 lg:col-span-4">
            <section>
              <H2>Pattern Recognition</H2>
              <BulletList items={spec.patterns} max={6} />
            </section>

            {module.pathology.length > 0 && (
              <section className="rounded border border-slate-200 bg-white p-2.5">
                <H2>Key Clues</H2>
                <ul className="mt-1 space-y-1 text-[8.8pt]">
                  {module.pathology.slice(0, 3).map((p) => (
                    <li key={p.finding} className="leading-snug">
                      <span className="font-semibold text-ucla-800">{p.finding}:</span>{' '}
                      <span className="text-slate-700">{p.keyClue}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded border border-amber-200 bg-amber-50/50 p-2.5">
              <H2 tone="amber">Common Pitfalls</H2>
              <BulletList items={spec.pitfalls} max={5} />
            </section>
          </div>

          <aside className="col-span-12 space-y-3 print:col-span-4 lg:col-span-4">
            <section className="rounded border border-rose-200 bg-rose-50/60 p-2.5">
              <H2 tone="rose">Do Not Miss</H2>
              <BulletList items={spec.doNotMiss} max={7} />
            </section>

            <section className="rounded border border-ucla-200 bg-ucla-50/50 p-2.5">
              <H2>X-Ray Negative, Still Worried?</H2>
              <BulletList items={spec.negativeXrayEscalation} max={4} />
            </section>

            <section>
              <H2>Quick Tips</H2>
              <BulletList items={spec.quickTips} max={5} />
            </section>
          </aside>
        </div>

        <section className="mt-3 rounded border border-gold-300 bg-gold-50/70 p-2.5">
          <div className="grid gap-2 print:grid-cols-[1.1fr_1fr] lg:grid-cols-[1.1fr_1fr]">
            <div>
              <H2 tone="amber">Clinic Pearl</H2>
              <p className="mt-1 text-[9pt] font-semibold leading-snug text-slate-900">
                {spec.pearl}
              </p>
            </div>
            <div>
              <H2 tone="rose">Escalate Today For</H2>
              <p className="mt-1 text-[8.7pt] leading-snug text-slate-800">
                Dislocation, unstable fracture, neurovascular deficit, open injury,
                infection concern, SCFE, perilunate/lunate injury, Lisfranc instability,
                femoral neck stress fracture, or pathologic/aggressive lesion.
              </p>
            </div>
          </div>
        </section>

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

function CompactSection({
  title,
  tone = 'ucla',
  children,
}: {
  title: string;
  tone?: 'ucla' | 'rose' | 'amber';
  children: ReactNode;
}) {
  return (
    <section>
      <H2 tone={tone}>{title}</H2>
      <div className="mt-1">{children}</div>
    </section>
  );
}

function BulletList({ items, max }: { items: string[]; max?: number }) {
  return (
    <ul className="mt-1 space-y-0.5 text-[8.8pt]">
      {items.slice(0, max ?? items.length).map((item) => (
        <li key={item} className="leading-snug text-slate-700">
          <span className="font-bold text-ucla-700">•</span> {item}
        </li>
      ))}
    </ul>
  );
}

function H2({ children, tone = 'ucla' }: { children: ReactNode; tone?: 'ucla' | 'rose' | 'amber' }) {
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
