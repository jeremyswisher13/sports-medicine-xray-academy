import { useMemo, useState } from 'react';
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
import { nextRecommendedModule } from '../utils/moduleReward';
import { dueFlashcardCount } from '../utils/flashcardSchedule';

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
  const [query, setQuery] = useState('');
  const learnerModules = learnerPreview ? [] : snapshot.modules;
  const learnerCases = learnerPreview ? [] : snapshot.cases;
  const learnerVideos = learnerPreview ? [] : snapshot.videos;
  const learnerQuizzes = learnerPreview ? [] : snapshot.quizzes;
  const learnerConfidence = learnerPreview ? [] : snapshot.confidence;
  const coreModules = moduleSummaries.filter((module) => module.status === 'full');
  const coreModuleIds = new Set(coreModules.map((module) => module.id));
  const cardsDue = dueFlashcardCount(flashcards.map((flashcard) => flashcard.id));

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

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? moduleSummaries.filter((m) =>
          [m.title, m.shortTitle, m.description, ...m.emphasis, m.region]
            .join(' ')
            .toLowerCase()
            .includes(q),
        )
      : moduleSummaries;
    return matches;
  }, [query]);

  const completedCount = learnerModules.filter(
    (m) => coreModuleIds.has(m.moduleId) && m.completed,
  ).length;
  const totalCount = coreModules.length;
  const overallPct = (completedCount / Math.max(totalCount, 1)) * 100;
  const hasCourseBaseline =
    hasCourseAssessment(learnerQuizzes, learnerConfidence, 'pre') ||
    (learnerPreview && hasPreviewCourseAssessment('pre'));
  const hasCoursePost =
    hasCourseAssessment(learnerQuizzes, learnerConfidence, 'post') ||
    (learnerPreview && hasPreviewCourseAssessment('post'));
  const canOpenModules = hasCourseBaseline || (isAdminAccount && !learnerPreview);
  const nextModule =
    nextRecommendedModule(learnerModules) ?? coreModules[0] ?? moduleSummaries[0];
  const nextModuleProgress = learnerModules.find((m) => m.moduleId === nextModule.id);
  const heroPrimary = canOpenModules
    ? {
        label: `Continue ${nextModule.shortTitle}`,
        to: `/modules/${nextModule.id}`,
      }
    : {
        label: 'Start pre-course baseline',
        to: '/quiz/pre',
      };
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
    : nextModuleProgress?.completed && !hasCoursePost
      ? {
          eyebrow: 'Required next',
          title: 'Take the post-course assessment',
          body: 'Close the loop with a course-wide score and confidence delta after the module path.',
          to: '/quiz/post',
          cta: 'Start post-course check',
          icon: 'flag' as const,
        }
      : {
          eyebrow: nextModuleProgress?.visited ? 'Continue learning' : 'Start next module',
          title: nextModuleProgress?.visited
            ? `Resume ${nextModule.title}`
            : `Start ${nextModule.title}`,
          body: nextModuleProgress?.visited
            ? 'Pick up with the next active drill, then finish the post-check when ready.'
            : 'Begin with the module quick check, then work through the guided read.',
          to: `/modules/${nextModule.id}`,
          cta: nextModuleProgress?.visited ? 'Resume module' : 'Open module',
          icon: 'book-open' as const,
        };

  return (
    <div className="container-page py-8 sm:py-12">
      <section className="card-premium">
        <div className="card-premium-bar" />
        <div className="p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ucla-700">
              UCLA Sports Medicine • Jeremy Swisher, MD
            </div>
            <h1 className="mt-2 text-balance text-ucla-950">Sports Medicine X-Ray Academy</h1>
            <p className="mt-3 max-w-prose leading-relaxed text-slate-600">
              A high-yield radiograph interpretation platform for UCLA family medicine residents
              and sports medicine fellows.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to={heroPrimary.to} className="btn-gold">
                {heroPrimary.label}
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-ucla-100 bg-white/90 p-5 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your progress
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums text-ucla-900">
                {completedCount}
              </span>
              <span className="text-sm text-slate-500">of {totalCount} modules</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-ucla-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
              <div>
                <div className="font-semibold text-ucla-900 tabular-nums">
                  {learnerCases.length}
                </div>
                Cases attempted
              </div>
              <div>
                <div className="font-semibold text-ucla-900 tabular-nums">
                  {learnerVideos.filter((v) => v.markedComplete).length}
                </div>
                Videos completed
              </div>
              <div>
                <div className="font-semibold text-ucla-900 tabular-nums">
                  {cardsDue}
                </div>
                Cards due
              </div>
            </div>
            {user && (
              <p className="mt-3 text-[11px] text-slate-500">
                Signed in as {user.email || user.displayName} (
                {learnerPreview ? 'learner preview' : user.role}).
              </p>
            )}
          </div>
        </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-ucla-100 bg-white/95 p-5 shadow-soft sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ucla-600 text-white shadow-soft">
              <Icon name={nextRequiredTask.icon} size={18} />
            </span>
            <div className="min-w-0">
              <div className="section-title">{nextRequiredTask.eyebrow}</div>
              <h2 className="mt-1 text-2xl text-ucla-950">{nextRequiredTask.title}</h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
                {nextRequiredTask.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={nextRequiredTask.to} className="btn-primary">
                  {nextRequiredTask.cta}
                  <Icon name="arrow-right" size={14} />
                </Link>
                <Link to="/flashcards" className="btn-secondary">
                  Warm up with cards
                  <Icon name="sparkles" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-ucla-100 bg-ucla-50/70 p-5 shadow-soft sm:p-6">
          <div className="section-title">Review tools</div>
          <h2 className="mt-1 text-2xl text-ucla-950">Fast support when you get stuck.</h2>
          {weakModules.length > 0 ? (
            <div className="mt-3 space-y-2">
              {weakModules.map((module) => (
                <Link
                  key={module.id}
                  to={`/modules/${module.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ucla-100 bg-white px-3 py-2 text-sm font-semibold text-ucla-900 no-underline shadow-soft hover:bg-ucla-50"
                >
                  <span>{module.title}</span>
                  <span className="text-xs text-slate-500">confidence {confidenceFor(module.id)}/5</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Use atlas reps for normal anatomy, flashcards for quick retrieval practice, and the
              cheat-sheet panel below for clinic thresholds.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/atlas" className="btn-secondary">
              Image atlas
              <Icon name="image" size={14} />
            </Link>
          </div>
        </article>
      </section>

      <div className="mt-5">
        <CheatSheetPromo />
      </div>

      {canOpenModules && savedModules.length > 0 && (
        <section className="mt-10">
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

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2>Continue modules</h2>
            <p className="mt-1 text-sm text-slate-500">
              {canOpenModules
                ? 'Follow the guided path one module at a time, then return to saved areas for extra practice.'
                : 'Complete the course baseline first so your knowledge and confidence shift can be measured.'}
            </p>
          </div>
          {canOpenModules && (
            <div className="relative w-full sm:max-w-xs">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="search" size={14} />
              </span>
              <input
                className="input pl-9"
                placeholder="Search modules…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search modules"
              />
            </div>
          )}
        </div>
        {canOpenModules ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((m) => (
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
        ) : (
          <div className="mt-4 rounded-2xl border border-gold-200 bg-gold-50/70 p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-900">
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

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2>Resource library</h2>
            <p className="mt-1 text-sm text-slate-500">
              Jump into cases, videos, flashcards, atlas images, or assessments when you need them.
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {quickAccess.map((q) => (
            <Link
              key={q.id}
              to={q.to}
              className="group flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-3 no-underline shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800 transition-colors group-hover:bg-ucla-100">
                <Icon name={q.icon} size={16} />
              </span>
              <span className="text-sm font-semibold text-slate-800">{q.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
