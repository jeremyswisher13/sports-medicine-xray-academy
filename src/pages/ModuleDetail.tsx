import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tabs } from '../components/ui/Tabs';
import { Icon } from '../components/ui/Icon';
import { SystematicReadChecklist } from '../components/SystematicReadChecklist';
import { ViewSelector } from '../components/ViewSelector';
import { AnatomyLandmarkCard } from '../components/AnatomyLandmarkCard';
import { PathologyComparisonCard } from '../components/PathologyComparisonCard';
import {
  ClinicalPearlCallout,
  DoNotMissCallout,
  PitfallCallout,
} from '../components/Callouts';
import { CasePracticeCard } from '../components/CasePracticeCard';
import { QuizQuestion } from '../components/QuizQuestion';
import { VideoResourceCard } from '../components/VideoResourceCard';
import { ModuleCheck } from '../components/ModuleCheck';
import { XRayImage } from '../components/XRayImage';
import { CheatSheetPromo } from '../components/CheatSheetPromo';
import { ModulePhaseGuide } from '../components/ModulePhaseGuide';
import { modulePhases } from '../data/learningFlow';
import { getModule } from '../data/modules';
import { getPostCheck, getPreCheck } from '../data/moduleChecks';
import {
  getImage,
  getNormalImagesForModule,
  getPathologyImagesForModule,
  getRealImagesForModule,
} from '../data/images';
import { getVideosForModule } from '../data/videoResources';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';
import {
  ids,
  logAuditEvent,
  markModuleVisited,
  saveModuleProgress,
  saveQuizAttempt,
} from '../services/firestore';

export function ModuleDetailPage() {
  const params = useParams<{ moduleId: string }>();
  const moduleId = params.moduleId ?? '';
  const module = getModule(moduleId);
  const { user, learnerPreview, isAdminAccount } = useAuth();
  const { snapshot, refresh } = useProgress();
  const [active, setActive] = useState('learn');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [preCheckCompletedNow, setPreCheckCompletedNow] = useState(false);

  useEffect(() => {
    if (!user || !module || learnerPreview) return;
    void markModuleVisited({
      userId: user.uid,
      moduleId: module.id,
      lastViewedAt: Date.now(),
    });
    void logAuditEvent({ userId: user.uid, type: 'module_viewed', moduleId: module.id });
  }, [user, module, learnerPreview]);

  useEffect(() => {
    setActive('learn');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setPreCheckCompletedNow(false);
  }, [moduleId]);

  const videos = useMemo(
    () => (module ? getVideosForModule(module.id) : []),
    [module],
  );

  const preCheckQs = useMemo(() => (module ? getPreCheck(module) : []), [module]);
  const postCheckQs = useMemo(() => (module ? getPostCheck(module) : []), [module]);
  const realImages = useMemo(
    () => (module ? getRealImagesForModule(module.id) : []),
    [module],
  );
  const normalImages = useMemo(
    () => (module ? getNormalImagesForModule(module.id) : []),
    [module],
  );
  const pathologyImages = useMemo(
    () => (module ? getPathologyImagesForModule(module.id) : []),
    [module],
  );

  if (!module) {
    return (
      <div className="container-page py-12">
        <div className="card p-6 text-center">
          <h2>Module not found</h2>
          <p className="mt-2 text-slate-600">
            We couldn't find that module.{' '}
            <Link to="/modules" className="underline">
              Back to modules
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const totalQuiz = module.quiz.length;
  const correctCount = module.quiz.filter(
    (q) => quizAnswers[q.id] === q.correctOptionId,
  ).length;
  const scorePercent = totalQuiz === 0 ? 0 : (correctCount / totalQuiz) * 100;

  async function submitQuiz() {
    if (!user || !module) return;
    setQuizSubmitted(true);
    if (learnerPreview) return;
    const attempt = {
      id: ids.newId(),
      userId: user.uid,
      scope: 'module' as const,
      moduleId: module.id,
      startedAt: Date.now(),
      submittedAt: Date.now(),
      answers: module.quiz.map((q) => ({
        questionId: q.id,
        selectedOptionId: quizAnswers[q.id] ?? '',
        correct: quizAnswers[q.id] === q.correctOptionId,
      })),
      scorePercent,
    };
    await saveQuizAttempt(attempt);
    await logAuditEvent({
      userId: user.uid,
      type: 'quiz_submitted',
      moduleId: module.id,
      details: { scope: 'module', score: scorePercent },
    });
  }

  const savedModuleProgress = snapshot.modules.find((m) => m.moduleId === module.id);
  const moduleProgress = learnerPreview ? undefined : savedModuleProgress;
  const isAdminBypass = isAdminAccount && !learnerPreview;
  const hasPreCheck =
    Boolean(moduleProgress?.preCheckAt) &&
    moduleProgress?.preCheckConfidence !== undefined;
  const contentUnlocked = Boolean(isAdminBypass || hasPreCheck || preCheckCompletedNow);
  const isComplete = moduleProgress?.completed;

  async function markComplete() {
    if (!user || !module) return;
    const existing = moduleProgress;
    const completedAt = Date.now();
    const progressUpdate = {
      userId: user.uid,
      moduleId: module.id,
      visited: true,
      completedTabs: modulePhases.map((t) => t.id),
      completed: true,
      completedAt,
      lastViewedAt: completedAt,
      ...(existing?.preCheckAt !== undefined ? { preCheckAt: existing.preCheckAt } : {}),
      ...(existing?.postCheckAt !== undefined ? { postCheckAt: existing.postCheckAt } : {}),
      ...(existing?.preCheckScore !== undefined ? { preCheckScore: existing.preCheckScore } : {}),
      ...(existing?.postCheckScore !== undefined ? { postCheckScore: existing.postCheckScore } : {}),
      ...(existing?.preCheckConfidence !== undefined
        ? { preCheckConfidence: existing.preCheckConfidence }
        : {}),
      ...(existing?.postCheckConfidence !== undefined
        ? { postCheckConfidence: existing.postCheckConfidence }
        : {}),
    };
    await saveModuleProgress(progressUpdate);
    await logAuditEvent({
      userId: user.uid,
      type: 'module_completed',
      moduleId: module.id,
    });
    await refresh();
  }

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Link to="/modules" className="text-slate-500 hover:text-slate-800 no-underline">
            ← Modules
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">{module.title}</span>
        </div>
        <Link
          to={`/modules/${module.id}/cheatsheet`}
          className="inline-flex items-center gap-1.5 rounded-full border border-ucla-800 bg-ucla-800 px-3 py-1.5 text-xs font-semibold text-white shadow-soft hover:bg-ucla-900 no-underline"
        >
          <Icon name="printer" size={12} />
          Cheat sheet
        </Link>
      </div>

      <header className="mt-3 grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <span className="pill">{module.region}</span>
          {module.status === 'placeholder' && (
            <span className="pill ml-2">In build</span>
          )}
          <h1 className="mt-2 text-balance">{module.title}</h1>
          <p className="mt-2 max-w-prose text-slate-600 leading-relaxed">
            {module.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{module.estimatedMinutes} min</span>
            <span>•</span>
            <span>{module.cases.length} cases</span>
            <span>•</span>
            <span>{module.quiz.length} quiz questions</span>
            <span>•</span>
            <span>{videos.length} AMSSM videos</span>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Module status
          </div>
          {!contentUnlocked ? (
            <div className="mt-2 rounded-xl border border-gold-200 bg-gold-50/70 p-3">
              <div className="flex items-center gap-2 font-semibold text-gold-900">
                <Icon name="lock" size={15} />
                Baseline required
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">
                Complete the entry quiz and confidence rating to unlock this module.
              </p>
            </div>
          ) : isComplete ? (
            <div className="mt-2 flex items-center gap-2 text-emerald-700">
              <Icon name="check-circle" size={16} />
              <span className="font-semibold">Completed</span>
            </div>
          ) : moduleProgress?.postCheckAt ? (
            <button className="btn-primary mt-2 w-full" onClick={markComplete} disabled={!user}>
              Mark module complete
              <Icon name="check" size={14} />
            </button>
          ) : learnerPreview ? (
            <div className="mt-2 rounded-xl border border-gold-200 bg-gold-50/70 p-3">
              <div className="flex items-center gap-2 font-semibold text-gold-900">
                <Icon name="eye" size={15} />
                Learner preview active
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">
                You are seeing the fresh learner flow. Preview checks do not save to analytics.
              </p>
            </div>
          ) : isAdminBypass ? (
            <div className="mt-2 rounded-xl border border-ucla-100 bg-ucla-50/70 p-3">
              <div className="flex items-center gap-2 font-semibold text-ucla-900">
                <Icon name="shield" size={15} />
                Admin bypass active
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">
                You can preview content without completing the learner baseline.
              </p>
            </div>
          ) : (
            <button className="btn-primary mt-2 w-full" onClick={() => setActive('takeaways')}>
              Take post-check to complete
              <Icon name="arrow-right" size={14} />
            </button>
          )}
          {moduleProgress?.preCheckAt && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="text-slate-500">Pre score</div>
                <div className="font-semibold tabular-nums text-ucla-900">
                  {Math.round(moduleProgress.preCheckScore ?? 0)}%
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="text-slate-500">Pre confidence</div>
                <div className="font-semibold tabular-nums text-ucla-900">
                  {moduleProgress.preCheckConfidence ?? '—'}/5
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {!contentUnlocked ? (
        <section className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <aside className="overflow-hidden rounded-xl border border-ucla-800 bg-white shadow-soft">
            <div className="bg-ucla-950 px-5 py-4 text-white">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-200">
                Module entry check
              </div>
              <h2 className="mt-1 text-xl text-white">Capture your baseline first.</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Three knowledge questions and one confidence rating unlock the lesson.
              </p>
            </div>
            <ol className="space-y-2 p-5 text-sm text-slate-700">
              {['Answer the short knowledge check', 'Rate your confidence', 'Work through the module', 'Finish with the post-check'].map((step, idx) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ucla-800 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </aside>
          <ModuleCheck
            phase="pre"
            moduleId={module.id}
            moduleTitle={module.title}
            questions={preCheckQs}
            existingProgress={moduleProgress}
            variant="inline"
            required
            onComplete={() => {
              setPreCheckCompletedNow(true);
              void refresh();
            }}
          />
        </section>
      ) : (
        <>
          <div
            className={[
              'mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4',
              isAdminBypass && !hasPreCheck
                ? 'border-ucla-100 bg-ucla-50/70'
                : learnerPreview
                  ? 'border-gold-200 bg-gold-50/70'
                : 'border-emerald-200 bg-emerald-50/70',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <span
                className={[
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  isAdminBypass && !hasPreCheck
                    ? 'bg-ucla-100 text-ucla-800'
                    : learnerPreview
                      ? 'bg-gold-100 text-gold-900'
                    : 'bg-emerald-100 text-emerald-700',
                ].join(' ')}
              >
                <Icon
                  name={isAdminBypass && !hasPreCheck ? 'shield' : learnerPreview ? 'eye' : 'check-circle'}
                  size={16}
                />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {isAdminBypass && !hasPreCheck
                    ? 'Admin preview mode'
                    : learnerPreview
                      ? 'Learner preview mode'
                      : 'Baseline captured'}
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  {isAdminBypass && !hasPreCheck
                    ? 'Learners will see the entry gate here. Your admin account can review the content directly.'
                    : learnerPreview
                      ? 'This is the learner path with admin bypass and saved admin progress ignored.'
                    : 'The module is open. Complete the post-check on Key Takeaways when you finish.'}
                </p>
              </div>
            </div>
            {!isComplete && (
              <button className="btn-secondary" onClick={() => setActive('takeaways')}>
                Go to post-check
                <Icon name="arrow-right" size={14} />
              </button>
            )}
          </div>

          <div className="mt-6 sticky top-16 z-20 -mx-4 bg-[#F3F6FA]/90 px-4 py-2 backdrop-blur sm:mx-0 sm:px-0">
            <Tabs items={modulePhases} active={active} onChange={setActive} />
          </div>

          <ModulePhaseGuide active={active} onChange={setActive} className="mt-4" />

          <div className="mt-6 animate-fade-in">
        {active === 'learn' && (
          <div className="space-y-4">
          <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <article className="card p-5 sm:p-6">
              <h3 className="text-ucla-900">Module overview</h3>
              <ul className="mt-3 space-y-2 prose-clinical">
                {module.overview.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ucla-700" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {module.emphasis.length > 0 && (
                <div className="mt-4">
                  <div className="label">Emphasis</div>
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {module.emphasis.map((e) => (
                      <li key={e} className="pill-primary">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
            <aside className="space-y-4">
              {(() => {
                const heroImageKey =
                  module.id === 'xray-foundations'
                    ? 'foundations:systematic-read'
                    : module.id === 'shoulder'
                      ? 'shoulder:ac-cc-distance'
                      : module.id === 'knee'
                        ? 'knee-segond'
                        : module.id === 'ankle-foot'
                          ? 'ankle-mortise-clear-spaces'
                          : module.id === 'do-not-miss'
                            ? 'do-not-miss-klein-line'
                            : null;
                const heroImage = realImages[0] ?? (heroImageKey ? getImage(heroImageKey) : null);
                if (!heroImage) return null;
                return <XRayImage entry={heroImage} />;
              })()}
              <div className="card p-5">
                <div className="label">When to escalate</div>
                <ul className="mt-2 space-y-2">
                  {module.whenToEscalate.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                      <Icon name="lightning" size={14} className="mt-0.5 text-ucla-700" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </section>
          <CheatSheetPromo module={module} compact />
          <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <SystematicReadChecklist
              items={module.systematicChecklist}
              storageKey={module.id}
            />
            <article className="card p-5 sm:p-6">
              <h3 className="text-ucla-900">Read it like a sports doc</h3>
              <ul className="mt-3 space-y-2">
                {module.systematicNotes.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ucla-700" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>
          <AnatomyLandmarkCard landmarks={module.anatomy} />
          </div>
        )}

        {active === 'views' && (
          <section className="space-y-4">
            <ViewSelector views={module.views} />
            {realImages.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {realImages.slice(0, 3).map((img) => (
                  <XRayImage key={img.id} entry={img} />
                ))}
              </div>
            )}
          </section>
        )}

        {active === 'images' && (
          <div className="space-y-5">
            {normalImages.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="section-title">Normal anatomy reference</div>
                    <p className="mt-1 text-sm text-slate-500">
                      Compare these to the pathology atlas under the next tab.
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {normalImages.length} view{normalImages.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {normalImages.map((img) => (
                    <XRayImage key={img.id} entry={img} />
                  ))}
                </div>
              </section>
            )}
            <AnatomyLandmarkCard landmarks={module.anatomy} />
          </div>
        )}

        {active === 'images' && (
          <div className="mt-5 space-y-4">
            {pathologyImages.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="section-title">Pathology atlas</div>
                    <p className="mt-1 text-sm text-slate-500">
                      Open-license teaching radiographs sourced from Wikimedia Commons.
                    </p>
                  </div>
                  <Link
                    to="/atlas"
                    className="text-xs font-semibold text-ucla-700 hover:text-ucla-900 no-underline"
                  >
                    Full atlas →
                  </Link>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pathologyImages.map((img) => (
                    <XRayImage key={img.id} entry={img} />
                  ))}
                </div>
              </section>
            )}
            {module.id === 'do-not-miss' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <XRayImage entry={getImage('do-not-miss-gilula-arcs')} />
              </div>
            )}
            <PathologyComparisonCard items={module.pathology} />
          </div>
        )}

        {active === 'images' && (
          <section className="mt-5 grid gap-3 sm:grid-cols-2">
            {module.doNotMiss.length === 0 && (
              <div className="card p-5 text-sm text-slate-500 sm:col-span-2">
                Do-not-miss references are in build for this module.
              </div>
            )}
            {module.doNotMiss.map((d) => (
              <DoNotMissCallout key={d.title} title={d.title}>
                <div>
                  <p>{d.why}</p>
                  <p className="mt-1">
                    <span className="font-semibold">Imaging next: </span>
                    {d.imagingNext}
                  </p>
                </div>
              </DoNotMissCallout>
            ))}
          </section>
        )}

        {active === 'images' && (
          <section className="mt-5 grid gap-3 sm:grid-cols-2">
            {module.pitfalls.length === 0 && module.pearls.length === 0 && (
              <div className="card p-5 text-sm text-slate-500 sm:col-span-2">
                Pitfalls and pearls are in build for this module.
              </div>
            )}
            {module.pitfalls.map((p) => (
              <PitfallCallout key={p.title} title={p.title}>
                {p.body}
              </PitfallCallout>
            ))}
            {module.pearls.map((p) => (
              <ClinicalPearlCallout key={p.title} title={p.title}>
                {p.body}
              </ClinicalPearlCallout>
            ))}
          </section>
        )}

        {active === 'practice' && (
          <section className="space-y-4">
            {module.cases.length === 0 && (
              <div className="card p-5 text-sm text-slate-500">
                Case-based practice is in build for this module. Try the{' '}
                <Link to="/cases" className="underline">
                  curated case library
                </Link>{' '}
                in the meantime.
              </div>
            )}
            {module.cases.map((c) => (
              <CasePracticeCard key={c.id} scenario={c} />
            ))}
          </section>
        )}

        {active === 'practice' && (
          <section className="mt-5 space-y-4">
            {videos.length === 0 && (
              <div className="card p-5 text-sm text-slate-500">
                No supplemental AMSSM video has been added for this module yet.
              </div>
            )}
            <div className="grid gap-4 lg:grid-cols-2">
              {videos.map((v) => {
                const initial = snapshot.videos.find((vp) => vp.videoId === v.id) ?? null;
                return (
                  <VideoResourceCard
                    key={v.id}
                    video={v}
                    initialProgress={initial}
                    onProgressChange={() => void refresh()}
                  />
                );
              })}
            </div>
          </section>
        )}

        {active === 'quiz' && (
          <section className="space-y-4">
            {module.quiz.length === 0 ? (
              <div className="card p-5 text-sm text-slate-500">
                Module quiz is in build. Try the{' '}
                <Link to="/quiz/pre" className="underline">
                  pre-course assessment
                </Link>{' '}
                or{' '}
                <Link to="/quiz/post" className="underline">
                  post-course assessment
                </Link>
                .
              </div>
            ) : (
              <>
                {module.quiz.map((q, idx) => (
                  <QuizQuestion
                    key={q.id}
                    question={q}
                    index={idx}
                    total={module.quiz.length}
                    selectedOptionId={quizAnswers[q.id]}
                    showFeedback={quizSubmitted}
                    locked={quizSubmitted}
                    formative
                    onSelect={(id) =>
                      setQuizAnswers((prev) => ({ ...prev, [q.id]: id }))
                    }
                  />
                ))}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {quizSubmitted ? (
                    <div className="text-sm text-slate-700">
                      Score:{' '}
                      <span className="font-bold tabular-nums text-ucla-900">
                        {Math.round(scorePercent)}%
                      </span>{' '}
                      ({correctCount} / {totalQuiz})
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      {Object.keys(quizAnswers).length} of {totalQuiz} answered
                    </span>
                  )}
                  <button
                    className="btn-primary"
                    onClick={submitQuiz}
                    disabled={
                      quizSubmitted ||
                      Object.keys(quizAnswers).length !== totalQuiz
                    }
                  >
                    Submit module quiz
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {active === 'takeaways' && (
          <section className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <article className="card p-5 sm:p-6">
                <h3 className="text-ucla-900">Key takeaways</h3>
                <ul className="mt-3 space-y-2">
                  {module.keyTakeaways.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <aside className="space-y-4">
                {moduleProgress?.preCheckScore !== undefined && (
                  <div className="card p-5">
                    <div className="label">Your delta</div>
                    <dl className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
                      <dt className="text-slate-500">Pre score</dt>
                      <dd className="font-semibold text-slate-800 tabular-nums">
                        {Math.round(moduleProgress.preCheckScore)}%
                      </dd>
                      {moduleProgress.postCheckScore !== undefined && (
                        <>
                          <dt className="text-slate-500">Post score</dt>
                          <dd className="font-semibold text-slate-800 tabular-nums">
                            {Math.round(moduleProgress.postCheckScore)}%
                          </dd>
                        </>
                      )}
                      {moduleProgress.preCheckConfidence !== undefined && (
                        <>
                          <dt className="text-slate-500">Pre confidence</dt>
                          <dd className="font-semibold text-slate-800 tabular-nums">
                            {moduleProgress.preCheckConfidence}/5
                          </dd>
                        </>
                      )}
                      {moduleProgress.postCheckConfidence !== undefined && (
                        <>
                          <dt className="text-slate-500">Post confidence</dt>
                          <dd className="font-semibold text-slate-800 tabular-nums">
                            {moduleProgress.postCheckConfidence}/5
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                )}
                <div className="card p-5">
                  <div className="label">Next steps</div>
                  <ul className="mt-2 space-y-2">
                    <li>
                      <Link to={`/modules/${module.id}/cheatsheet`} className="text-sm font-semibold text-ucla-700">
                        Open the one-page cheat sheet →
                      </Link>
                    </li>
                    <li>
                      <Link to="/cases" className="text-sm font-semibold text-ucla-700">
                        Practice with the case library →
                      </Link>
                    </li>
                    <li>
                      <Link to="/videos" className="text-sm font-semibold text-ucla-700">
                        Review supplemental AMSSM videos →
                      </Link>
                    </li>
                    <li>
                      <Link to="/quiz/post" className="text-sm font-semibold text-ucla-700">
                        Take the post-course assessment →
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>

            <ModuleCheck
              phase="post"
              moduleId={module.id}
              moduleTitle={module.title}
              questions={postCheckQs}
              existingProgress={moduleProgress}
              variant="banner"
              completeModuleOnFinish
              completedTabsOnFinish={modulePhases.map((t) => t.id)}
              onComplete={() => void refresh()}
            />
          </section>
        )}
          </div>
        </>
      )}
    </div>
  );
}
