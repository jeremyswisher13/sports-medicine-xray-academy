import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { moduleSummaries } from '../data/moduleSummaries';
import {
  hasCourseAssessment,
  hasCompleteCourseConfidence,
  hasPreviewCourseAssessment,
} from '../utils/progress';
import type { ProgressSnapshot } from '../hooks/useProgress';

interface Props {
  snapshot: ProgressSnapshot;
  learnerPreview?: boolean;
}

export function CoursePathPanel({ snapshot, learnerPreview = false }: Props) {
  const preQuiz = snapshot.quizzes.find((q) => q.scope === 'pre');
  const postQuiz = snapshot.quizzes.find((q) => q.scope === 'post');
  const coreModules = moduleSummaries.filter((module) => module.status === 'full');
  const coreModuleIds = new Set(coreModules.map((module) => module.id));
  const hasPreConfidence = hasCompleteCourseConfidence(snapshot.confidence, 'pre');
  const hasPostConfidence = hasCompleteCourseConfidence(snapshot.confidence, 'post');
  const completedModules = snapshot.modules.filter(
    (m) => coreModuleIds.has(m.moduleId) && m.completed,
  ).length;
  const startedModules = snapshot.modules.filter(
    (m) => coreModuleIds.has(m.moduleId) && (m.visited || m.completed),
  ).length;
  const completedVideos = snapshot.videos.filter((v) => v.markedComplete).length;
  const totalModules = coreModules.length;

  const baselineDone =
    hasCourseAssessment(snapshot.quizzes, snapshot.confidence, 'pre') ||
    (learnerPreview && hasPreviewCourseAssessment('pre'));
  const modulesDone = completedModules >= totalModules;
  const outcomeDone =
    hasCourseAssessment(snapshot.quizzes, snapshot.confidence, 'post') ||
    (learnerPreview && hasPreviewCourseAssessment('post'));
  const nextModule =
    coreModules.find((m) => !snapshot.modules.find((p) => p.moduleId === m.id)?.completed) ??
    coreModules[0] ??
    moduleSummaries[0];

  const nextStep = !baselineDone
    ? {
        title: 'Take the pre-course baseline',
        body: 'Start with the knowledge check and confidence scale before the modules.',
        href: '/quiz/pre',
        cta: 'Start baseline',
      }
    : !modulesDone
      ? {
          title: `Continue ${nextModule.shortTitle}`,
          body: 'Work the core course module by module: entry check, learning phases, then post-check.',
          href: `/modules/${nextModule.id}`,
          cta: 'Continue module',
        }
      : !outcomeDone
        ? {
            title: 'Take the post-course assessment',
            body: 'Capture the outcome knowledge score and confidence shift.',
            href: '/quiz/post',
            cta: 'Start post-course',
          }
        : {
            title: 'Review your progress',
            body: 'Your course data is saved. Review modules, quizzes, cases, and confidence.',
            href: '/progress',
            cta: 'Open progress',
          };

  const steps = [
    {
      label: 'Baseline',
      detail: preQuiz
        ? `${Math.round(preQuiz.scorePercent)}% knowledge${hasPreConfidence ? ' + confidence' : ''}`
        : 'Knowledge + confidence',
      href: '/quiz/pre',
      done: baselineDone,
      active: !baselineDone,
      icon: 'lightning' as const,
    },
    {
      label: 'Modules',
      detail: `${completedModules}/${totalModules} core complete, ${startedModules} started`,
      href: '/modules',
      done: modulesDone,
      active: baselineDone && !modulesDone,
      icon: 'graduation' as const,
    },
    {
      label: 'Practice',
      detail: `${snapshot.cases.length} cases, ${completedVideos} videos`,
      href: '/cases',
      done: snapshot.cases.length > 0 || completedVideos > 0,
      active: false,
      icon: 'clipboard' as const,
    },
    {
      label: 'Outcome',
      detail: postQuiz
        ? `${Math.round(postQuiz.scorePercent)}% knowledge${hasPostConfidence ? ' + confidence' : ''}`
        : 'Post-quiz + confidence',
      href: '/quiz/post',
      done: outcomeDone,
      active: modulesDone && !outcomeDone,
      icon: 'check-circle' as const,
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-ucla-100 bg-ucla-50/70 shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.4fr]">
        <div className="border-b border-ucla-100 bg-white/80 p-5 sm:border-b-0 sm:border-r sm:p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ucla-700">
            Course path
          </div>
          <h2 className="mt-1 text-2xl text-ucla-900">{nextStep.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{nextStep.body}</p>
          {learnerPreview && (
            <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50 p-3 text-xs leading-relaxed text-gold-900">
              Learner preview is active. This panel is showing the fresh learner path.
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to={nextStep.href} className="btn-primary">
              {nextStep.cta}
              <Icon name="arrow-right" size={14} />
            </Link>
            <Link
              to="/cheatsheets"
              className="btn-secondary"
            >
              Cheat sheets
              <Icon name="printer" size={14} />
            </Link>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
          {steps.map((step, index) => (
            <Link
              key={step.label}
              to={step.href}
              className={[
                'group rounded-xl border p-4 no-underline transition-shadow hover:shadow-card',
                step.active
                  ? 'border-ucla-200 bg-white/90'
                  : step.done
                    ? 'border-emerald-200 bg-emerald-50/70'
                    : 'border-ucla-100 bg-white/75',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <span
                  className={[
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                    step.done
                      ? 'bg-emerald-600 text-white'
                      : step.active
                        ? 'bg-ucla-500 text-white'
                        : 'bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {step.done ? <Icon name="check" size={15} /> : <Icon name={step.icon} size={15} />}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Step {index + 1}
                    {step.active && <span className="text-ucla-700">Next</span>}
                  </div>
                  <h3 className="mt-1 text-base text-ucla-900 group-hover:text-ucla-700">
                    {step.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.detail}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
