import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
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
import { ImageFlashcardStrip } from '../components/ImageFlashcardStrip';
import { ModuleSectionRail } from '../components/ModuleSectionRail';
import { ModuleTrainer } from '../components/trainer/ModuleTrainer';
import { ModuleResourceMenu } from '../components/ModuleResourceMenu';
import { ModuleCompletionReward } from '../components/ModuleCompletionReward';
import { Disclosure } from '../components/ui/Disclosure';
import { modulePhases } from '../data/learningFlow';
import { getModule } from '../data/modules';
import { getTrainerForModule, trainerKind, trainerLabels } from '../data/anatomyTrainer';
import { getPostCheck, getPreCheck } from '../data/moduleChecks';
import {
  getDiagramsForModule,
  getImage,
  getNormalImagesForModule,
  getPathologyImagesForModule,
  getRealImagesForModule,
} from '../data/images';
import { getVideosForModule } from '../data/videoResources';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { useProgress } from '../hooks/useProgress';
import {
  ids,
  logAuditEvent,
  markModuleVisited,
  saveModuleProgress,
  saveQuizAttempt,
} from '../services/firestore';
import type { XRayImageEntry } from '../types';

// The single-scroll module is one page with a sticky "on this page" rail.
const MODULE_SECTIONS = [
  { id: 'read', label: 'How to read it' },
  { id: 'views', label: 'Views' },
  { id: 'images', label: "Normal & can't-miss" },
  { id: 'practice', label: 'Practice' },
  { id: 'finish', label: 'Recap & check' },
];

export function ModuleDetailPage() {
  const params = useParams<{ moduleId: string }>();
  const location = useLocation();
  const moduleId = params.moduleId ?? '';
  const module = getModule(moduleId);
  const { user, learnerPreview, isAdminAccount } = useAuth();
  const { snapshot, refresh } = useProgress();
  const { isModuleSaved, toggleModuleBookmark } = useBookmarks();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [preCheckCompletedNow, setPreCheckCompletedNow] = useState(false);
  const [moduleCaseIndex, setModuleCaseIndex] = useState(0);
  const [moduleQuizIndex, setModuleQuizIndex] = useState(0);

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
    setQuizAnswers({});
    setQuizSubmitted(false);
    setPreCheckCompletedNow(false);
    setModuleCaseIndex(0);
    setModuleQuizIndex(0);
  }, [moduleId]);

  // Self-heal: if a post-check was captured but the module was never marked
  // complete (legacy/stuck record, or a partial save), finish it silently.
  // The normal flow already completes via the post-check's completeModuleOnFinish.
  const healingRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!user || !module || learnerPreview) return;
    const saved = snapshot.modules.find((m) => m.moduleId === module.id);
    if (!saved || !saved.postCheckAt || saved.completed) return;
    if (healingRef.current.has(module.id)) return; // already healing this module
    healingRef.current.add(module.id);
    const completedAt = Date.now();
    void (async () => {
      await saveModuleProgress({
        ...saved,
        visited: true,
        completed: true,
        completedAt,
        completedTabs: saved.completedTabs?.length
          ? saved.completedTabs
          : modulePhases.map((t) => t.id),
        lastViewedAt: completedAt,
      });
      await logAuditEvent({ userId: user.uid, type: 'module_completed', moduleId: module.id });
      await refresh();
    })();
  }, [user, module, learnerPreview, snapshot.modules, refresh]);

  useEffect(() => {
    if (location.hash !== '#systematic') return;
    window.setTimeout(() => {
      document.getElementById('read')?.scrollIntoView({ block: 'start' });
    }, 0);
  }, [location.hash, moduleId]);

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
  const conceptDiagrams = useMemo(
    () => (module ? getDiagramsForModule(module.id) : []),
    [module],
  );
  const systematicPracticeImage = normalImages[0] ?? realImages.find((img) => !img.isDiagram);
  const imageFlashcards = useMemo(
    () => [...normalImages, ...pathologyImages],
    [normalImages, pathologyImages],
  );

  const trainer = useMemo(
    () => (module ? getTrainerForModule(module.id) : undefined),
    [module],
  );
  const sections = useMemo(() => {
    if (!trainer || !module) return MODULE_SECTIONS;
    const kind = trainerKind(module.id);
    const trainerLabel =
      kind === 'finding' ? "Can't-miss" : kind === 'systematic' ? 'Systematic read' : 'Normal anatomy';
    return [
      { id: 'trainer', label: trainerLabel },
      { id: 'read', label: 'How to read it' },
      { id: 'views', label: 'Views' },
      { id: 'images', label: "Pathology & can't-miss" },
      { id: 'practice', label: 'Practice' },
      { id: 'finish', label: 'Recap & check' },
    ];
  }, [trainer, module]);

  if (!module) {
    return (
      <div className="container-page py-12">
        <div className="card mx-auto max-w-md p-8 text-center">
          <h2 className="text-ucla-900">Module not found</h2>
          <p className="mx-auto mt-2 max-w-prose text-slate-600">
            We couldn't find that module — it may have moved. The rest of the curriculum is fine.
          </p>
          <Link to="/modules" className="btn-primary mt-5 inline-flex no-underline">
            Browse all modules
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const totalQuiz = module.quiz.length;
  const correctCount = module.quiz.filter(
    (q) => quizAnswers[q.id] === q.correctOptionId,
  ).length;
  const scorePercent = totalQuiz === 0 ? 0 : (correctCount / totalQuiz) * 100;
  const currentModuleCase = module.cases[moduleCaseIndex] ?? module.cases[0];
  const currentModuleQuizQuestion = module.quiz[moduleQuizIndex] ?? module.quiz[0];
  const moduleQuizAnswered = currentModuleQuizQuestion
    ? Boolean(quizAnswers[currentModuleQuizQuestion.id])
    : false;
  const allModuleQuizAnswered = Object.keys(quizAnswers).length === totalQuiz;

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
  const moduleSaved = isModuleSaved(module.id);
  const hasPreCheck =
    Boolean(moduleProgress?.preCheckAt) &&
    moduleProgress?.preCheckConfidence !== undefined;
  const contentUnlocked = Boolean(isAdminBypass || hasPreCheck || preCheckCompletedNow);
  const isComplete = moduleProgress?.completed;

  const heroImage = getModuleHeroImage(module.id, normalImages, realImages);

  return (
    <div className="container-page py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Link to="/modules" className="text-slate-500 hover:text-slate-800 no-underline">
            ← Modules
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">{module.title}</span>
        </div>
        <ModuleResourceMenu
          module={module}
          saved={moduleSaved}
          onToggleSaved={() => void toggleModuleBookmark(module)}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2.5">
        <h1 className="text-2xl text-balance text-ucla-950 sm:text-3xl">{module.title}</h1>
        <span className="pill">{module.region}</span>
        {!contentUnlocked ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-900">
            <Icon name="lock" size={12} />
            Baseline required
          </span>
        ) : isComplete ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <Icon name="check-circle" size={12} />
            Completed
          </span>
        ) : null}
        {learnerPreview && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-900">
            <Icon name="eye" size={12} />
            Learner preview
          </span>
        )}
        {isAdminBypass && !hasPreCheck && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ucla-200 bg-white px-2.5 py-1 text-xs font-semibold text-ucla-900">
            <Icon name="shield" size={12} />
            Admin bypass
          </span>
        )}
      </div>

      {!contentUnlocked ? (
        <section className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <aside className="overflow-hidden rounded-xl border border-ucla-100 bg-white shadow-soft">
            <div className="border-b border-ucla-100 bg-ucla-50/80 px-5 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ucla-700">
                Module entry check
              </div>
              <h2 className="mt-1 text-xl text-ucla-900">Capture your baseline first.</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Three knowledge questions and one confidence rating unlock the lesson.
              </p>
            </div>
            <ol className="space-y-2 p-5 text-sm text-slate-700">
              {['Answer the short knowledge check', 'Rate your confidence', 'Work through the module', 'Finish with the post-check'].map((step, idx) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ucla-500 text-xs font-bold text-white">
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
          {((isAdminBypass && !hasPreCheck) || learnerPreview) && (
            <div
              className={[
                'mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-soft',
                learnerPreview
                  ? 'border-gold-200 bg-gold-50/80 text-slate-700'
                  : 'border-ucla-100 bg-ucla-50/80 text-slate-700',
              ].join(' ')}
            >
              <Icon
                name={learnerPreview ? 'eye' : 'shield'}
                size={15}
                className={learnerPreview ? 'mt-0.5 text-gold-900' : 'mt-0.5 text-ucla-800'}
              />
              <p className="leading-relaxed">
                {learnerPreview
                  ? 'Learner preview is active; checks do not save to analytics.'
                  : 'Admin bypass is active. Learners still complete the entry check before this content opens.'}
              </p>
            </div>
          )}

          <ModuleSectionRail sections={sections} className="mt-4" />

          <div className="mt-6 space-y-10">
            {/* Intro */}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <div>
                <p className="leading-relaxed text-slate-600">{module.description}</p>
                {module.emphasis.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {module.emphasis.map((e) => (
                      <li key={e} className="pill-primary">
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  <span>{module.estimatedMinutes} min</span>
                  <span>·</span>
                  <span>{module.cases.length} case{module.cases.length === 1 ? '' : 's'}</span>
                  <span>·</span>
                  <span>{module.quiz.length} quiz</span>
                  {moduleProgress?.preCheckAt && (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-ucla-800">
                        Pre {Math.round(moduleProgress.preCheckScore ?? 0)}% · confidence{' '}
                        {moduleProgress.preCheckConfidence ?? '—'}/5
                      </span>
                    </>
                  )}
                </div>
              </div>
              {heroImage && (
                <div className="overflow-hidden rounded-xl bg-slate-950">
                  <XRayImage entry={heroImage} className="min-h-[200px]" />
                </div>
              )}
            </div>

            {trainer && (
              <section id="trainer" className="scroll-mt-[132px] space-y-4">
                <SectionHeading n={1} title={trainerLabels(module.id).section} />
                <ModuleTrainer
                  moduleId={module.id}
                  data={trainer}
                  isAdmin={isAdminBypass}
                  onCheckComplete={(score, total) => {
                    if (!user || learnerPreview) return;
                    void logAuditEvent({
                      userId: user.uid,
                      type: 'trainer_check',
                      moduleId: module.id,
                      details: { score, total },
                    });
                  }}
                />
              </section>
            )}

            {/* How to read it */}
            <section id="read" className="scroll-mt-[132px] space-y-4">
              <SectionHeading n={trainer ? 2 : 1} title="How to read it" />
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <SystematicReadChecklist
                  items={module.systematicChecklist}
                  practiceImage={systematicPracticeImage}
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
              </div>
              <aside className="card p-5">
                <div className="label">When to escalate</div>
                <ul className="mt-2 space-y-2">
                  {module.whenToEscalate.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                      <Icon name="lightning" size={14} className="mt-0.5 text-ucla-700" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </section>

            {/* 2 — Views */}
            <section id="views" className="scroll-mt-[132px] space-y-4">
              <SectionHeading n={trainer ? 3 : 2} title="Views you order" />
              <ViewSelector views={module.views} />
              {realImages.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {realImages.slice(0, 3).map((img) => (
                    <XRayImage key={img.id} entry={img} />
                  ))}
                </div>
              )}
            </section>

            {/* 3 — Normal vs. can't-miss */}
            <section id="images" className="scroll-mt-[132px] space-y-5">
              <SectionHeading n={trainer ? 4 : 3} title="Normal vs. can't-miss" />
              <ImageFlashcardStrip
                images={imageFlashcards}
                maxCards={3}
                title="Call the image first"
                description="Decide the view and normal-versus-pathology before the caption appears."
              />

              {conceptDiagrams.length > 0 && (
                <section>
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <div className="section-title">Concept diagrams</div>
                      <p className="mt-1 text-sm text-slate-500">
                        Original labeled schematics for the high-yield read habits in this module.
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {conceptDiagrams.length} diagram{conceptDiagrams.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {conceptDiagrams.map((img) => (
                      <XRayImage key={img.id} entry={img} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="section-title">Normal anatomy reference</div>
                    <p className="mt-1 text-sm text-slate-500">
                      Anchor the normal view and landmarks first, then move to pathology.
                    </p>
                  </div>
                  {normalImages.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {normalImages.length} view{normalImages.length === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
                {normalImages.length > 0 ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {normalImages.map((img) => (
                      <XRayImage key={img.id} entry={img} />
                    ))}
                  </div>
                ) : (
                  <div className="card mt-3 p-5 text-sm text-slate-600">
                    Use the systematic checklist, view drill, and available teaching images to anchor
                    the normal-first read for this module.
                  </div>
                )}
                <div className="mt-3">
                  <AnatomyLandmarkCard landmarks={module.anatomy} />
                </div>
              </section>

              <section className="border-t border-slate-200/70 pt-5">
                <div className="section-title">Pathology</div>
                <p className="mt-1 text-sm text-slate-500">
                  Start with the highest-yield findings; expand any card for the normal-versus-pathologic detail.
                </p>
                <div className="mt-3">
                  <PathologyComparisonCard items={module.pathology.slice(0, 2)} />
                </div>
                {module.pathology.length > 2 && (
                  <div className="mt-3">
                    <Disclosure
                      summary={`Show ${module.pathology.length - 2} more finding${
                        module.pathology.length - 2 === 1 ? '' : 's'
                      }`}
                    >
                      <PathologyComparisonCard items={module.pathology.slice(2)} />
                    </Disclosure>
                  </div>
                )}

                {pathologyImages.length > 0 && (
                  <div className="mt-3">
                    <Disclosure
                      summary="View teaching radiographs (atlas)"
                      description="Open-license example images sourced from Wikimedia Commons."
                    >
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {pathologyImages.map((img) => (
                          <XRayImage key={img.id} entry={img} />
                        ))}
                      </div>
                      <Link
                        to="/atlas"
                        className="mt-3 inline-block text-xs font-semibold text-ucla-700 hover:text-ucla-900 no-underline"
                      >
                        Full atlas →
                      </Link>
                    </Disclosure>
                  </div>
                )}
              </section>

              <section>
                <div className="section-title">Do not miss</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {module.doNotMiss.length === 0 && (
                    <div className="card p-5 text-sm text-slate-500 sm:col-span-2">
                      Do-not-miss references for this module are covered through the cases, quiz, and takeaways.
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
                </div>
              </section>

              {(module.pitfalls.length > 0 || module.pearls.length > 0) && (
                <Disclosure
                  summary="Pitfalls & pearls"
                  description={`${module.pitfalls.length} pitfall${
                    module.pitfalls.length === 1 ? '' : 's'
                  } · ${module.pearls.length} pearl${module.pearls.length === 1 ? '' : 's'}`}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
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
                  </div>
                </Disclosure>
              )}
            </section>

            {/* 4 — Practice: cases, videos, quick quiz */}
            <section id="practice" className="scroll-mt-[132px] space-y-4">
              <SectionHeading n={trainer ? 5 : 4} title="Practice" />
              {module.cases.length === 0 && (
                <div className="card p-5 text-sm text-slate-500">
                  Case-based practice for this module is available in the{' '}
                  <Link to="/cases" className="underline">
                    curated case library
                  </Link>{' '}
                  in the meantime.
                </div>
              )}
              {currentModuleCase && (
                <>
                  <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <div className="section-title">Case practice</div>
                      <h3 className="mt-1 text-base text-ucla-900">
                        Case {moduleCaseIndex + 1} of {module.cases.length}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={moduleCaseIndex === 0}
                        onClick={() => setModuleCaseIndex((idx) => Math.max(0, idx - 1))}
                      >
                        <Icon name="chevron-left" size={14} />
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={moduleCaseIndex >= module.cases.length - 1}
                        onClick={() =>
                          setModuleCaseIndex((idx) => Math.min(module.cases.length - 1, idx + 1))
                        }
                      >
                        Next case
                        <Icon name="arrow-right" size={14} />
                      </button>
                    </div>
                  </div>
                  <CasePracticeCard key={currentModuleCase.id} scenario={currentModuleCase} />
                </>
              )}

              {videos.length > 0 && (
                <Disclosure
                  summary="Related AMSSM videos"
                  description={`${videos.length} supplemental video${
                    videos.length === 1 ? '' : 's'
                  } for this region.`}
                >
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
                </Disclosure>
              )}

              {module.quiz.length > 0 && (
                <div className="space-y-4 border-t border-slate-200/70 pt-5">
                  <div className="section-title">Quick quiz</div>
                  {!quizSubmitted && currentModuleQuizQuestion && (
                    <>
                      <div className="rounded-2xl border border-ucla-100 bg-ucla-50/60 p-4 shadow-soft">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                          <span>
                            Question {moduleQuizIndex + 1} of {totalQuiz}
                          </span>
                          <span>{Object.keys(quizAnswers).length}/{totalQuiz} answered</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-ucla-100">
                          <div
                            className="h-full rounded-full bg-ucla-600 transition-all"
                            style={{ width: `${((moduleQuizIndex + 1) / Math.max(totalQuiz, 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <QuizQuestion
                        question={currentModuleQuizQuestion}
                        index={moduleQuizIndex}
                        total={module.quiz.length}
                        selectedOptionId={quizAnswers[currentModuleQuizQuestion.id]}
                        formative
                        cheatSheetModuleId={module.id}
                        onSelect={(id) =>
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [currentModuleQuizQuestion.id]: id,
                          }))
                        }
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          className="btn-secondary"
                          disabled={moduleQuizIndex === 0}
                          onClick={() => setModuleQuizIndex((idx) => Math.max(0, idx - 1))}
                        >
                          <Icon name="chevron-left" size={14} />
                          Previous
                        </button>
                        {moduleQuizIndex < totalQuiz - 1 ? (
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={!moduleQuizAnswered}
                            onClick={() =>
                              setModuleQuizIndex((idx) => Math.min(totalQuiz - 1, idx + 1))
                            }
                          >
                            Next question
                            <Icon name="arrow-right" size={14} />
                          </button>
                        ) : (
                          <button
                            className="btn-primary"
                            onClick={submitQuiz}
                            disabled={!allModuleQuizAnswered}
                          >
                            Submit quiz
                          </button>
                        )}
                      </div>
                    </>
                  )}
                  {quizSubmitted && (
                    <>
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-slate-700 shadow-soft">
                        Score:{' '}
                        <span className="font-bold tabular-nums text-ucla-900">
                          {Math.round(scorePercent)}%
                        </span>{' '}
                        ({correctCount} / {totalQuiz}). Review the explanations, then finish
                        with the post-check below.
                      </div>
                      {module.quiz.map((q, idx) => (
                        <QuizQuestion
                          key={q.id}
                          question={q}
                          index={idx}
                          total={module.quiz.length}
                          selectedOptionId={quizAnswers[q.id]}
                          showFeedback
                          locked
                          formative
                          cheatSheetModuleId={module.id}
                          onSelect={(id) =>
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: id }))
                          }
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </section>

            {/* 5 — Recap & finish */}
            <section id="finish" className="scroll-mt-[132px] space-y-4">
              <SectionHeading n={trainer ? 6 : 5} title="Recap & check" />
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

              {moduleProgress?.postCheckAt && (
                <ModuleCompletionReward
                  module={module}
                  progress={moduleProgress}
                  allModuleProgress={snapshot.modules}
                />
              )}
            </section>

            <CheatSheetPromo module={module} compact />
          </div>
        </>
      )}
    </div>
  );
}

function SectionHeading({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ucla-600 text-sm font-bold text-white"
      >
        {n}
      </span>
      <h2 className="text-xl text-ucla-900">{title}</h2>
    </div>
  );
}

function getModuleHeroImage(
  moduleId: string,
  normalImages: XRayImageEntry[],
  realImages: XRayImageEntry[],
): XRayImageEntry | null {
  const schematicImageKeyByModule: Partial<Record<string, string>> = {
    'xray-foundations': 'foundations:systematic-read',
    shoulder: 'shoulder:ac-cc-distance',
    knee: 'knee-segond',
    'ankle-foot': 'ankle-mortise-clear-spaces',
    'do-not-miss': 'do-not-miss-klein-line',
  };
  const fallbackKey = schematicImageKeyByModule[moduleId];
  return normalImages[0] ?? realImages[0] ?? (fallbackKey ? getImage(fallbackKey) : null);
}
