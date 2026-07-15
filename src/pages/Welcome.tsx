import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';

export function WelcomePage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] ?? 'Learner';
  const greeting = greetingFor(new Date());

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ucla-700">
          {greeting}, {firstName}
        </div>
        <h1 className="mt-2 text-balance">Welcome to the Sports Medicine X-Ray Academy.</h1>
        <p className="mt-3 max-w-prose text-slate-600 leading-relaxed">
          This curriculum is built specifically for UCLA family medicine residents and sports
          medicine fellows. The goal is a reproducible, clinic-ready approach to interpreting
          common musculoskeletal radiographs — and knowing when x-rays are not enough.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/dashboard" className="btn-primary">
            Go to dashboard
            <Icon name="arrow-right" size={14} />
          </Link>
          <Link to="/quiz/pre" className="btn-secondary">
            Start baseline
            <Icon name="lightning" size={14} />
          </Link>
        </div>

        <section className="calm-panel mt-8 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
              <div className="section-title">How to use this</div>
              <h2 className="mt-1 text-2xl text-ucla-950">One active pass at a time.</h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
                The dashboard tells you the next required step. Modules use short checks,
                image calls, cases, recall cards, and confidence ratings to keep learning active.
              </p>
            </div>
            <aside className="rounded-lg bg-ucla-50/70 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-ucla-800 ring-1 ring-ucla-100">
                  <Icon name="download" size={16} />
                </span>
                <div>
                  <h3 className="text-base text-ucla-950">Add it to your home screen.</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    On iPhone, open Safari, tap Share, then Add to Home Screen. It launches
                    full-screen and keeps your next learning step close.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Baseline first',
              body:
                'Capture knowledge and confidence before the modules so growth is measurable.',
              icon: 'lightning' as const,
            },
            {
              title: 'Read actively',
              body:
                'Call the image, answer the prompt, then reveal the teaching point.',
              icon: 'graduation' as const,
            },
            {
              title: 'Calibrate',
              body:
                'Finish with post-checks and confidence ratings so weak areas stay visible.',
              icon: 'check-circle' as const,
            },
            {
              title: 'Use quick reps',
              body:
                'Open cards or cheat sheets between patients without losing your place.',
              icon: 'sparkles' as const,
            },
          ].map((step, i) => (
            <li key={step.title} className="card p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ucla-50 text-ucla-800">
                  <span className="font-bold text-sm">{i + 1}</span>
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon name={step.icon} size={14} />
                    <h3 className="text-base text-ucla-900">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function greetingFor(d: Date) {
  const h = d.getHours();
  if (h < 5) return 'Good evening';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
