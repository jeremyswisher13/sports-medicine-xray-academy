import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { ModuleCard } from '../components/ModuleCard';
import { CheatSheetPromo } from '../components/CheatSheetPromo';
import { modulePhaseCount } from '../data/learningFlow';
import { flashcards } from '../data/flashcards';
import { moduleSummaries } from '../data/moduleSummaries';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { useProgress } from '../hooks/useProgress';
import { hasCourseAssessment, hasPreviewCourseAssessment } from '../utils/progress';
import { nextDashboardModule } from '../utils/moduleReward';
import { dueFlashcardCount } from '../utils/flashcardSchedule';
import { latestCaseAttempts } from '../utils/assessment';

const quickAccess = [
  { id: 'foundations', label: 'X-Ray Basics', to: '/modules/xray-foundations', icon: 'graduation' as const },
  { id: 'systematic', label: 'Systematic Approach', to: '/modules/xray-foundations#systematic', icon: 'clipboard' as const },
  { id: 'fractures', label: 'Common Fractures', to: '/modules', icon: 'bone' as const },
  { id: 'cases', label: 'Sports Medicine Cases', to: '/cases', icon: 'shield' as const },
  { id: 'videos', label: 'AMSSM Videos', to: '/videos', icon: 'youtube' as const },
  { id: 'flashcards', label: 'Flashcards', to: '/flashcards', icon: 'sparkles' as const },
  { id: 'atlas', label: 'Image Atlas', to: '/atlas', icon: 'image' as const },
  { id: 'quiz', label: 'Quiz Mode', to: '/quiz/pre', icon: 'lightning' as const },
  { id: 'confidence', label: 'Confidence Ratings', to: '/progress', icon: 'star' as const },
];

export function DashboardPage() {
  const { user, learnerPreview, isAdminAccount } = useAuth();
  const { snapshot } = useProgress();
  const { bookmarks, isModuleSaved, toggleModuleBookmark } = useBookmarks();
  const learnerModules = learnerPreview ? [] : snapshot.modules;
  const learnerCases = learnerPreview ? [] : snapshot.cases;
  const learnerVideos = learnerPreview ? [] : snapshot.videos;
  const learnerQuizzes = learnerPreview ? [] : snapshot.quizzes;
  const learnerConfidence = learnerPreview ? [] : snapshot.confidence;
  const coreModules = moduleSummaries.filter((module) => module.status === 'full');
  const coreModuleIds = new Set(coreModules.map((module) => module.id));
  const cardsDue = learnerPreview || !user
    ? flashcards.length
    : dueFlashcardCount(flashcards.map((flashcard) => flashcard.id), user.uid);

  function progressFor(moduleId: string): number {
    const p = learnerModules.find((m) => m.moduleId === moduleId);
    if (!p) return 0;
    if (p.completed) return 100;
    if (p.completedTabs?.length) {
      return Math.min(100, (p.completedTabs.length / modulePhaseCount) * 100);
    }
    return p.visited ? 10 : 0;
  }

  function confidenceFor(moduleId: string): number | null {
    const p = learnerModules.find((m) => m.moduleId === moduleId);
    return p?.postCheckConfidence ?? p?.preCheckConfidence ?? null;
  }

  const completedCount = learnerModules.filter(
    (m) => coreModuleIds.has(m.moduleId) && m.completed,
  ).length;
  const totalCount = coreModules.length;
  const overallPct = (completedCount / Math.max(totalCount, 1)) * 100;
  const allCoreComplete = totalCount > 0 && completedCount === totalCount;
  const hasCourseBaseline =
    hasCourseAssessment(learnerQuizzes, learnerConfidence, 'pre') ||
    (learnerPreview && hasPreviewCourseAssessment('pre'));
  const hasCoursePost =
    hasCourseAssessment(learnerQuizzes, learnerConfidence, 'post') ||
    (learnerPreview && hasPreviewCourseAssessment('post'));
  const canOpenModules = hasCourseBaseline || (isAdminAccount && !learnerPreview);
  const nextModule = nextDashboardModule(learnerModules) ?? coreModules[0] ?? moduleSummaries[0];
  const nextModuleProgress = learnerModules.find((m) => m.moduleId === nextModule.id);
  const savedModuleIds = new Set(bookmarks.map((bookmark) => bookmark.moduleId));
  const savedModules = moduleSummaries.filter((module) => savedModuleIds.has(module.id));
  const weakModules = coreModules
    .filter((module) => {
      const confidence = confidenceFor(module.id);
      const progress = learnerModules.find((m) => m.moduleId === module.id);
      return Boolean(progress) && confidence !== null && confidence < 4;
    })
    .slice(0, 3);
  const nextRequiredTask = !canOpenModules
    ? {
        eyebrow: 'Required next',
        title: 'Take the pre-course baseline',
        body: 'Seven knowledge questions plus confidence ratings unlock the modules and give you a starting point.',
        to: '/quiz/pre',
        cta: 'Start baseline',
        icon: 'lightning' as const,
      }
    : allCoreComplete && !hasCoursePost
      ? {
          eyebrow: 'Required next',
          title: 'Take the post-course assessment',
          body: 'Close the loop with a course-wide score and confidence delta after the module path.',
          to: '/quiz/post',
          cta: 'Start post-course check',
          icon: 'flag' as const,
        }
      : allCoreComplete && hasCoursePost
        ? {
            eyebrow: 'Course complete',
            title: 'Your course outcomes are ready',
            body: 'Review your score and confidence changes, then revisit any region that needs another pass.',
            to: '/progress',
            cta: 'View outcomes',
            icon: 'check-circle' as const,
          }
      : {
          eyebrow: nextModuleProgress?.visited ? 'Continue learning' : 'Start next module',
          title: nextModuleProgress?.visited
            ? `Resume ${nextModule.title}`
            : `Start ${nextModule.title}`,
          body: nextModuleProgress?.visited
            ? 'Pick up with the next active drill, then finish the post-check when ready.'
            : 'Begin with the module quick check, then work through the guided read.',
          to: `/modules/${nextModule.id}${
            nextModuleProgress?.lastSectionId ? `#${nextModuleProgress.lastSectionId}` : ''
          }`,
          cta: nextModuleProgress?.visited ? 'Resume module' : 'Open module',
          icon: 'book-open' as const,
        };
  const dashboardStats = [
    { label: 'Cases', value: latestCaseAttempts(learnerCases).length },
    { label: 'Videos', value: learnerVideos.filter((v) => v.markedComplete).length },
    { label: 'Cards due', value: cardsDue },
  ];
  const supportLinks =
    weakModules.length > 0
      ? weakModules.map((module) => ({
          label: module.shortTitle,
          meta: `confidence ${confidenceFor(module.id)}/5`,
          to: `/modules/${module.id}`,
          icon: 'star' as const,
        }))
      : [
          {
            label: 'Image atlas',
            meta: 'normal anatomy reps',
            to: '/atlas',
            icon: 'image' as const,
          },
          {
            label: 'Flashcards',
            meta: `${cardsDue} due today`,
            to: '/flashcards',
            icon: 'sparkles' as const,
          },
          {
            label: 'Cases',
            meta: 'read-and-call practice',
            to: '/cases',
            icon: 'shield' as const,
          },
        ];

  return (
    <div className="container-page py-6 sm:py-10">
      <section className="learning-hero p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-center">
          <div className="min-w-0">
            <div className="mb-5 border-b border-slate-200 pb-4">
              <div className="section-title">UCLA Sports Medicine · Jeremy Swisher, MD</div>
              <h1 className="mt-1 text-xl text-balance text-ucla-950 sm:text-2xl">
                Sports Medicine MSK X-Ray Academy
              </h1>
            </div>
            <div className="section-title">{nextRequiredTask.eyebrow}</div>
            <h2 className="mt-2 max-w-3xl text-2xl text-balance text-ucla-950 sm:text-3xl">
              {nextRequiredTask.title}
            </h2>
            <p className="mt-3 max-w-prose leading-relaxed text-slate-600">
              {nextRequiredTask.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to={nextRequiredTask.to} className="btn-primary">
                {nextRequiredTask.cta}
                <Icon name="arrow-right" size={14} />
              </Link>
              {canOpenModules && (
                <Link to="/progress" className="btn-secondary">
                  View progress
                  <Icon name="bar-chart" size={14} />
                </Link>
              )}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Course progress
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  <span className="font-semibold tabular-nums text-ucla-900">
                    {completedCount}
                  </span>{' '}
                  of {totalCount} modules
                </div>
              </div>
              <div className="text-2xl font-bold tabular-nums text-ucla-900">
                {Math.round(overallPct)}%
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
              <div
                className="h-full rounded-full bg-ucla-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-500">
              {dashboardStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums text-ucla-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            {user && (
              <p className="mt-4 hidden truncate text-[11px] text-slate-500 sm:block">
                {user.email || user.displayName} · {learnerPreview ? 'learner preview' : user.role}
              </p>
            )}
          </aside>
        </div>
      </section>

      {canOpenModules && (
        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="calm-panel p-5 sm:p-6">
            <div className="section-title">
              {weakModules.length > 0 ? 'Needs another look' : 'Quiet review'}
            </div>
            <h2 className="mt-1 text-xl text-ucla-950">Support tools stay one click away.</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {supportLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm no-underline transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ucla-50 text-ucla-800">
                    <Icon name={item.icon} size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-800">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{item.meta}</span>
                  </span>
                </Link>
              ))}
            </div>
          </article>

          <CheatSheetPromo compact />
        </section>
      )}

      {canOpenModules && savedModules.length > 0 && (
        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2>Saved for review</h2>
              <p className="mt-1 text-sm text-slate-500">
                Quick return to modules you marked for another pass.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
              {savedModules.length} saved
            </span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedModules.map((m) => (
              <ModuleCard
                key={m.id}
                module={m}
                progressPercent={progressFor(m.id)}
                completed={learnerModules.find((x) => x.moduleId === m.id)?.completed}
                confidence={confidenceFor(m.id)}
                saved={isModuleSaved(m.id)}
                onToggleSaved={(module) => void toggleModuleBookmark(module)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2>
              {canOpenModules
                ? allCoreComplete
                  ? 'Course review'
                  : 'Next in course'
                : 'Continue modules'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {canOpenModules
                ? allCoreComplete
                  ? 'Your core path is complete. Review outcomes or revisit a region as needed.'
                  : 'Keep the dashboard focused on the next best module. Use the full catalog when you want to browse.'
                : 'Complete the course baseline first so your knowledge and confidence shift can be measured.'}
            </p>
          </div>
          {canOpenModules && (
            <Link to="/modules" className="btn-secondary">
              Browse modules
              <Icon name="book-open" size={14} />
            </Link>
          )}
        </div>
        {canOpenModules && !allCoreComplete ? (
          <div className="mt-4 max-w-lg">
            <ModuleCard
              module={nextModule}
              progressPercent={progressFor(nextModule.id)}
              completed={learnerModules.find((x) => x.moduleId === nextModule.id)?.completed}
              confidence={confidenceFor(nextModule.id)}
              saved={isModuleSaved(nextModule.id)}
              onToggleSaved={(module) => void toggleModuleBookmark(module)}
            />
          </div>
        ) : canOpenModules ? (
          <div className="calm-panel mt-4 max-w-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon name="check-circle" size={17} />
              </span>
              <div>
                <h3 className="text-lg text-ucla-900">Core modules complete</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {hasCoursePost
                    ? 'Your course score and confidence changes are available now.'
                    : 'Finish the post-course assessment to capture your outcome.'}
                </p>
                <Link
                  to={hasCoursePost ? '/progress' : '/quiz/post'}
                  className="btn-primary mt-4"
                >
                  {hasCoursePost ? 'Review outcomes' : 'Take post-course check'}
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-gold-200 bg-gold-50/70 p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-900">
                <Icon name="lock" size={16} />
              </span>
              <div>
                <h3 className="text-lg text-ucla-900">Modules unlock after the baseline.</h3>
                <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-700">
                  Start with the short pre-course knowledge quiz and confidence scale. After that,
                  each module will capture its own entry check and post-check.
                </p>
                <Link to="/quiz/pre" className="btn-primary mt-4">
                  Start baseline
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {canOpenModules && <details className="calm-panel mt-8 overflow-hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="block text-base font-semibold text-ucla-950">
              Browse resource library
            </span>
            <span className="mt-0.5 block text-sm text-slate-500">
              Cases, videos, flashcards, atlas images, and assessments.
            </span>
          </span>
          <Icon name="chevron-down" size={16} className="shrink-0 text-slate-500" />
        </summary>
        <div className="grid grid-cols-1 gap-2 border-t border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccess.map((q) => (
            <Link
              key={q.id}
              to={q.to}
              className="group flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-3 no-underline ring-1 ring-slate-200 transition-colors hover:bg-ucla-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ucla-50 text-ucla-800 transition-colors group-hover:bg-white">
                <Icon name={q.icon} size={16} />
              </span>
              <span className="text-sm font-semibold text-slate-800">{q.label}</span>
            </Link>
          ))}
        </div>
      </details>}
    </div>
  );
}
