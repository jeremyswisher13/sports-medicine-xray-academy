import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';

export function WelcomePage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] ?? 'Learner';
  const greeting = greetingFor(new Date());

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ucla-700">
          {greeting}, {firstName}
        </div>
        <h1 className="mt-2 text-balance">Welcome to the Sports Medicine X-Ray Academy.</h1>
        <p className="mt-3 max-w-prose text-slate-600 leading-relaxed">
          This curriculum is built specifically for UCLA family medicine residents and sports
          medicine fellows. The goal is a reproducible, clinic-ready approach to interpreting
          common musculoskeletal radiographs — and knowing when x-rays are not enough.
        </p>

        <ol className="mt-6 space-y-3">
          {[
            {
              title: 'Take the pre-course assessment',
              body:
                'A short knowledge check and confidence survey to establish a baseline for your learning.',
              href: '/quiz/pre',
              icon: 'lightning' as const,
            },
            {
              title: 'Work through the modules',
              body:
                'Each module follows a simpler learner path: Learn → Views → Images → Practice → Quiz → Takeaways.',
              href: '/modules',
              icon: 'graduation' as const,
            },
            {
              title: 'Practice with cases',
              body:
                'Case-based interpretation with open-license teaching radiographs where available.',
              href: '/cases',
              icon: 'clipboard' as const,
            },
            {
              title: 'Take the post-course assessment',
              body:
                'Compare your knowledge and confidence growth across the curriculum.',
              href: '/quiz/post',
              icon: 'check-circle' as const,
            },
          ].map((step, i) => (
            <li key={step.title} className="card p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
                  <span className="font-bold text-sm">{i + 1}</span>
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon name={step.icon} size={14} />
                    <h3 className="text-base text-ucla-900">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{step.body}</p>
                  <Link to={step.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ucla-700 hover:text-ucla-900">
                    Continue <Icon name="arrow-right" size={14} />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/dashboard" className="btn-primary">
            Go to dashboard
            <Icon name="arrow-right" size={14} />
          </Link>
          <Link to="/quiz/pre" className="btn-secondary">
            Start pre-course assessment
          </Link>
        </div>
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
