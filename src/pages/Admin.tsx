import { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';
import { useAdminData } from '../hooks/useAdminData';
import { moduleContents } from '../data/modules';
import { moduleSummaries } from '../data/moduleSummaries';
import { checks } from '../data/moduleChecks';
import { postCourseQuiz, preCourseQuiz } from '../data/quizzes';
import { videoResources } from '../data/videoResources';
import type {
  AuditEvent,
  CaseAttempt,
  ConfidenceRating,
  ModuleProgress,
  QuizAttempt,
  UserProfile,
  VideoProgress,
} from '../types';

const coreModuleSummaries = moduleSummaries.filter((module) => module.status === 'full');
const coreModuleIds = new Set(coreModuleSummaries.map((module) => module.id));
const activeLearningScopes = ['module-coach', 'systematic-read', 'atlas-practice'] as const;

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function avgOrUndefined(nums: number[]): number | undefined {
  return nums.length ? avg(nums) : undefined;
}

function formatOptionalFixed(value: number | undefined, digits: number): string {
  return value !== undefined ? value.toFixed(digits) : '';
}

function formatOptionalPercent(value: number | undefined): string {
  return value !== undefined ? `${Math.round(value)}%` : '—';
}

function formatDeltaPercent(value: number | undefined): string {
  return value !== undefined ? `${value > 0 ? '+' : ''}${value.toFixed(0)}%` : '—';
}

function formatDeltaNumber(value: number | undefined): string {
  return value !== undefined ? `${value > 0 ? '+' : ''}${value.toFixed(1)}` : '—';
}

function formatDate(ms?: number) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString();
}

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((c) => {
          const s = String(c ?? '');
          if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
          return s;
        })
        .join(','),
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface PerLearner {
  user: UserProfile;
  modulesCompleted: number;
  preCourseScore?: number;
  postCourseScore?: number;
  preCourseConfidenceAvg?: number;
  postCourseConfidenceAvg?: number;
  videosCompleted: number;
  cases: number;
  casesCorrect: number;
  lastEventAt?: number;
  modulePreChecks: number;
  modulePostChecks: number;
  moduleOutcomesPending: number;
  modulePreAvg?: number;
  modulePostAvg?: number;
  modulePreConfAvg?: number;
  modulePostConfAvg?: number;
}

interface QuestionStat {
  questionId: string;
  prompt: string;
  moduleId?: string;
  domain?: string;
  attempts: number;
  misses: number;
}

function buildPerLearner(
  user: UserProfile,
  modules: ModuleProgress[],
  quizzes: QuizAttempt[],
  confidence: ConfidenceRating[],
  videos: VideoProgress[],
  cases: CaseAttempt[],
  audit: AuditEvent[],
): PerLearner {
  const myMods = modules.filter((x) => x.userId === user.uid);
  const myQuiz = quizzes.filter((x) => x.userId === user.uid);
  const myConf = confidence.filter((x) => x.userId === user.uid);
  const myVid = videos.filter((x) => x.userId === user.uid);
  const myCases = cases.filter((x) => x.userId === user.uid);
  const myAudit = audit.filter((x) => x.userId === user.uid);

  const modulePreScores = myMods
    .map((m) => m.preCheckScore)
    .filter((n): n is number => typeof n === 'number');
  const modulePostScores = myMods
    .map((m) => m.postCheckScore)
    .filter((n): n is number => typeof n === 'number');
  const modulePreConf = myMods
    .map((m) => m.preCheckConfidence)
    .filter((n): n is number => typeof n === 'number');
  const modulePostConf = myMods
    .map((m) => m.postCheckConfidence)
    .filter((n): n is number => typeof n === 'number');

  return {
    user,
    modulesCompleted: myMods.filter((m) => coreModuleIds.has(m.moduleId) && m.completed).length,
    preCourseScore: myQuiz.find((q) => q.scope === 'pre')?.scorePercent,
    postCourseScore: myQuiz.find((q) => q.scope === 'post')?.scorePercent,
    preCourseConfidenceAvg: avgOrUndefined(myConf.filter((c) => c.scope === 'pre').map((c) => c.value)),
    postCourseConfidenceAvg: avgOrUndefined(myConf.filter((c) => c.scope === 'post').map((c) => c.value)),
    videosCompleted: myVid.filter((v) => v.markedComplete).length,
    cases: myCases.length,
    casesCorrect: myCases.filter((c) => c.correct).length,
    lastEventAt: myAudit.reduce<number | undefined>(
      (a, e) => (a && a > (e.createdAt ?? 0) ? a : e.createdAt),
      undefined,
    ),
    modulePreChecks: myMods.filter((m) => coreModuleIds.has(m.moduleId) && Boolean(m.preCheckAt)).length,
    modulePostChecks: myMods.filter((m) => coreModuleIds.has(m.moduleId) && Boolean(m.postCheckAt)).length,
    moduleOutcomesPending: myMods.filter(
      (m) => coreModuleIds.has(m.moduleId) && Boolean(m.preCheckAt) && !m.postCheckAt,
    ).length,
    modulePreAvg: avgOrUndefined(modulePreScores),
    modulePostAvg: avgOrUndefined(modulePostScores),
    modulePreConfAvg: avgOrUndefined(modulePreConf),
    modulePostConfAvg: avgOrUndefined(modulePostConf),
  };
}

export function AdminPage() {
  const { isAdminAccount } = useAuth();
  const { data, loading, error, refresh } = useAdminData(isAdminAccount);
  const [tab, setTab] = useState<'overview' | 'learners' | 'modules' | 'audit'>('overview');
  const [search, setSearch] = useState('');
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  const perLearner = useMemo<PerLearner[]>(() => {
    return data.users.map((u) =>
      buildPerLearner(u, data.modules, data.quizzes, data.confidence, data.videos, data.cases, data.audit),
    );
  }, [data]);

  const filteredLearners = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return perLearner;
    return perLearner.filter((l) =>
      [l.user.displayName, l.user.email, l.user.role].join(' ').toLowerCase().includes(q),
    );
  }, [perLearner, search]);

  const topMetrics = useMemo(() => {
    const totalLearners = data.users.length;
    const totalModuleViews = data.modules.length;
    const totalCompletions = data.modules.filter((m) => m.completed).length;
    const totalQuizzes = data.quizzes.length;
    const totalModulePreChecks = data.modules.filter((m) => Boolean(m.preCheckAt)).length;
    const totalModulePostChecks = data.modules.filter((m) => Boolean(m.postCheckAt)).length;
    const courseScoreDeltas = data.users
      .map((u) => {
        const pre = data.quizzes.find((q) => q.userId === u.uid && q.scope === 'pre');
        const post = data.quizzes.find((q) => q.userId === u.uid && q.scope === 'post');
        if (!pre || !post) return null;
        return post.scorePercent - pre.scorePercent;
      })
      .filter((n): n is number => n !== null);
    const moduleScoreDeltas = data.modules
      .filter(
        (m) =>
          typeof m.preCheckScore === 'number' && typeof m.postCheckScore === 'number',
      )
      .map((m) => (m.postCheckScore as number) - (m.preCheckScore as number));
    const moduleConfDeltas = data.modules
      .filter(
        (m) =>
          typeof m.preCheckConfidence === 'number' &&
          typeof m.postCheckConfidence === 'number',
      )
      .map((m) => (m.postCheckConfidence as number) - (m.preCheckConfidence as number));
    return {
      totalLearners,
      totalModuleViews,
      totalCompletions,
      totalQuizzes,
      totalModulePreChecks,
      totalModulePostChecks,
      moduleOutcomeRate:
        totalModulePreChecks === 0 ? 0 : (totalModulePostChecks / totalModulePreChecks) * 100,
      avgCourseDelta: avgOrUndefined(courseScoreDeltas),
      avgModuleDelta: avgOrUndefined(moduleScoreDeltas),
      avgModuleConfDelta: avgOrUndefined(moduleConfDeltas),
      videoCompletionRate:
        videoResources.length === 0
          ? 0
          : (data.videos.filter((v) => v.markedComplete).length /
              (videoResources.length * Math.max(1, data.users.length))) *
            100,
    };
  }, [data]);

  const activeLearningMetrics = useMemo(() => {
    const coachAttempts = data.quizzes.filter((q) => q.scope === 'module-coach');
    const systematicAttempts = data.quizzes.filter((q) => q.scope === 'systematic-read');
    const atlasAttempts = data.quizzes.filter((q) => q.scope === 'atlas-practice');
    const flashcardEvents = data.audit.filter((event) => event.type === 'flashcard_reviewed');
    const flashcardsNeedReview = flashcardEvents.filter(
      (event) => event.details?.outcome === 'review',
    ).length;
    const activeAttempts = [...coachAttempts, ...systematicAttempts, ...atlasAttempts];
    const correctAttempts = activeAttempts.filter((attempt) =>
      attempt.answers.every((answer) => answer.correct),
    ).length;
    const highConfidenceIncorrect = coachAttempts.filter((attempt) => {
      const answer = attempt.answers[0];
      const phaseId = answer?.questionId.split(':')[1];
      if (!answer || answer.correct || !phaseId) return false;
      return data.confidence.some(
        (rating) =>
          rating.userId === attempt.userId &&
          rating.scope === 'module-coach' &&
          rating.moduleId === attempt.moduleId &&
          rating.domain === phaseId &&
          rating.value >= 4,
      );
    }).length;
    return {
      total: activeAttempts.length,
      coach: coachAttempts.length,
      systematic: systematicAttempts.length,
      atlas: atlasAttempts.length,
      flashcards: flashcardEvents.length,
      flashcardsNeedReview,
      correctRate: activeAttempts.length === 0 ? 0 : (correctAttempts / activeAttempts.length) * 100,
      highConfidenceIncorrect,
    };
  }, [data.audit, data.confidence, data.quizzes]);

  const moduleAnalytics = useMemo(() => {
    return moduleSummaries.map((m) => {
      const progress = data.modules.filter((p) => p.moduleId === m.id);
      const activeAttempts = data.quizzes.filter(
        (attempt) =>
          attempt.moduleId === m.id &&
          activeLearningScopes.some((scope) => scope === attempt.scope),
      );
      const views = progress.length;
      const completions = progress.filter((p) => p.completed).length;
      const preCheckCount = progress.filter((p) => Boolean(p.preCheckAt)).length;
      const postCheckCount = progress.filter((p) => Boolean(p.postCheckAt)).length;
      const preScores = progress
        .map((p) => p.preCheckScore)
        .filter((n): n is number => typeof n === 'number');
      const postScores = progress
        .map((p) => p.postCheckScore)
        .filter((n): n is number => typeof n === 'number');
      const preConf = progress
        .map((p) => p.preCheckConfidence)
        .filter((n): n is number => typeof n === 'number');
      const postConf = progress
        .map((p) => p.postCheckConfidence)
        .filter((n): n is number => typeof n === 'number');
      return {
        module: m,
        views,
        completions,
        preCheckCount,
        postCheckCount,
        preAvg: avgOrUndefined(preScores),
        postAvg: avgOrUndefined(postScores),
        preConfAvg: avgOrUndefined(preConf),
        postConfAvg: avgOrUndefined(postConf),
        activeAttemptCount: activeAttempts.length,
        activeCorrectRate:
          activeAttempts.length === 0
            ? undefined
            : (activeAttempts.filter((attempt) => attempt.scorePercent >= 100).length /
                activeAttempts.length) *
              100,
      };
    });
  }, [data.modules, data.quizzes]);

  const questionBank = useMemo(() => {
    const bank = new Map<string, { prompt: string; moduleId?: string; domain?: string }>();
    const allQuestions = [
      ...preCourseQuiz,
      ...postCourseQuiz,
      ...moduleContents.flatMap((m) => [
        ...m.quiz,
        ...checks.pre(m.id),
        ...checks.post(m.id),
      ]),
    ];
    for (const q of allQuestions) {
      bank.set(q.id, {
        prompt: q.prompt,
        ...(q.moduleId ? { moduleId: q.moduleId } : {}),
        domain: q.domain,
      });
    }
    return bank;
  }, []);

  const questionAnalytics = useMemo<QuestionStat[]>(() => {
    const stats = new Map<string, QuestionStat>();
    for (const attempt of data.quizzes) {
      for (const answer of attempt.answers) {
        const meta = questionBank.get(answer.questionId);
        const existing =
          stats.get(answer.questionId) ??
          {
            questionId: answer.questionId,
            prompt: meta?.prompt ?? answer.questionId,
            moduleId: meta?.moduleId ?? attempt.moduleId,
            domain: meta?.domain,
            attempts: 0,
            misses: 0,
          };
        existing.attempts += 1;
        if (!answer.correct) existing.misses += 1;
        stats.set(answer.questionId, existing);
      }
    }
    return [...stats.values()]
      .filter((q) => q.attempts > 0)
      .sort((a, b) => b.misses / b.attempts - a.misses / a.attempts || b.misses - a.misses)
      .slice(0, 8);
  }, [data.quizzes, questionBank]);

  const followUpLearners = useMemo(() => {
    return perLearner
      .filter(
        (l) =>
          l.moduleOutcomesPending > 0 ||
          (l.preCourseScore !== undefined && l.postCourseScore === undefined),
      )
      .sort(
        (a, b) =>
          b.moduleOutcomesPending - a.moduleOutcomesPending ||
          (b.lastEventAt ?? 0) - (a.lastEventAt ?? 0),
      )
      .slice(0, 8);
  }, [perLearner]);

  const recentAudit = useMemo(
    () =>
      [...data.audit]
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        .slice(0, 100),
    [data.audit],
  );

  const selectedLearner = perLearner.find((l) => l.user.uid === selectedUid) ?? null;
  const selectedDetail = useMemo(() => {
    if (!selectedLearner) return null;
    const uid = selectedLearner.user.uid;
    return {
      modules: data.modules.filter((m) => m.userId === uid),
      quizzes: data.quizzes.filter((q) => q.userId === uid),
      confidence: data.confidence.filter((c) => c.userId === uid),
      videos: data.videos.filter((v) => v.userId === uid),
      cases: data.cases.filter((c) => c.userId === uid),
      audit: data.audit
        .filter((a) => a.userId === uid)
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        .slice(0, 100),
    };
  }, [selectedLearner, data]);

  if (!isAdminAccount) {
    return (
      <div className="container-page py-12">
        <div className="card mx-auto max-w-md p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700">
            <Icon name="lock" size={16} />
          </div>
          <h3 className="mt-3 text-ucla-900">Admin only</h3>
          <p className="mt-1 text-sm text-slate-600">
            This page is restricted to course administrators.
          </p>
        </div>
      </div>
    );
  }

  function exportLearnersCSV() {
    const header = [
      'Display Name',
      'Email',
      'Role',
      'Last Active',
      'Modules Completed',
      'Pre-Course Score',
      'Post-Course Score',
      'Pre-Course Confidence (avg)',
      'Post-Course Confidence (avg)',
      'Module Pre Checks',
      'Module Post Checks',
      'Module Outcomes Pending',
      'Module Pre Avg',
      'Module Post Avg',
      'Module Pre Confidence',
      'Module Post Confidence',
      'Cases Attempted',
      'Cases Correct',
      'Videos Completed',
    ];
    const rows = perLearner.map((l) => [
      l.user.displayName,
      l.user.email,
      l.user.role,
      formatDate(l.lastEventAt),
      l.modulesCompleted,
      l.preCourseScore ?? '',
      l.postCourseScore ?? '',
      formatOptionalFixed(l.preCourseConfidenceAvg, 2),
      formatOptionalFixed(l.postCourseConfidenceAvg, 2),
      l.modulePreChecks,
      l.modulePostChecks,
      l.moduleOutcomesPending,
      formatOptionalFixed(l.modulePreAvg, 1),
      formatOptionalFixed(l.modulePostAvg, 1),
      formatOptionalFixed(l.modulePreConfAvg, 2),
      formatOptionalFixed(l.modulePostConfAvg, 2),
      l.cases,
      l.casesCorrect,
      l.videosCompleted,
    ]);
    downloadCSV('learners.csv', [header, ...rows]);
  }

  function exportAuditCSV() {
    const header = ['When', 'User ID', 'Type', 'Module', 'Ref', 'Details'];
    const rows = data.audit
      .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
      .map((e) => [
        formatDate(e.createdAt),
        e.userId,
        e.type,
        e.moduleId ?? '',
        e.refId ?? '',
        e.details ? JSON.stringify(e.details) : '',
      ]);
    downloadCSV('audit-log.csv', [header, ...rows]);
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-title">Course administration</div>
          <h1 className="mt-1 text-balance">Admin dashboard</h1>
          <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
            Aggregate learner progress, pre/post deltas, video completion, and audit log.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={() => void refresh()} disabled={loading}>
            <Icon name="lightning" size={14} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          <button className="btn-secondary" onClick={exportLearnersCSV}>
            Export learners CSV
          </button>
          <button className="btn-secondary" onClick={exportAuditCSV}>
            Export audit CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-sm text-rose-800">
          {error.includes('PERMISSION_DENIED')
            ? 'Permission denied — confirm Firestore rules deployed and your account is in the admin email allowlist.'
            : error}
        </div>
      )}

      {/* Top metrics */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        <Stat label="Learners" value={topMetrics.totalLearners.toString()} />
        <Stat
          label="Baselines"
          value={topMetrics.totalModulePreChecks.toString()}
          sub="Module entry checks"
        />
        <Stat
          label="Outcomes"
          value={`${topMetrics.totalModulePostChecks}`}
          sub={`${topMetrics.moduleOutcomeRate.toFixed(0)}% of baselines`}
        />
        <Stat
          label="Module completions"
          value={`${topMetrics.totalCompletions} / ${topMetrics.totalModuleViews}`}
          sub="Completed / module visits"
        />
        <Stat
          label="Course score Δ"
          value={formatDeltaPercent(topMetrics.avgCourseDelta)}
          sub="Avg post − pre"
        />
        <Stat
          label="Module score Δ"
          value={formatDeltaPercent(topMetrics.avgModuleDelta)}
          sub="Per-module pre→post"
        />
        <Stat
          label="Active drills"
          value={activeLearningMetrics.total.toString()}
          sub={`${activeLearningMetrics.correctRate.toFixed(0)}% correct`}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'learners', label: `Learners (${data.users.length})` },
          { id: 'modules', label: 'Module analytics' },
          { id: 'audit', label: 'Audit log' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as typeof tab)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold',
              tab === t.id
                ? 'border-ucla-600 bg-ucla-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="card p-5">
            <h3 className="text-base text-ucla-900">Most engaged modules</h3>
            <ul className="mt-3 space-y-2">
              {[...moduleAnalytics]
                .sort((a, b) => b.views - a.views)
                .slice(0, 6)
                .map((m) => (
                  <li
                    key={m.module.id}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <span className="flex-1 truncate text-sm font-medium text-slate-800">
                      {m.module.title}
                    </span>
                    <span className="pill">{m.views} views</span>
                    <span className="pill">{m.preCheckCount} pre</span>
                    <span className="pill">{m.postCheckCount} post</span>
                    <span className="pill-primary">{m.completions} done</span>
                    {m.preAvg !== undefined && m.postAvg !== undefined ? (
                      <span className="pill bg-emerald-50 text-emerald-800 border-emerald-100">
                        {Math.round(m.postAvg - m.preAvg) >= 0 ? '+' : ''}
                        {Math.round(m.postAvg - m.preAvg)}%
                      </span>
                    ) : null}
                  </li>
                ))}
            </ul>
          </article>
          <article className="card p-5">
            <h3 className="text-base text-ucla-900">Confidence growth</h3>
            <p className="mt-1 text-sm text-slate-500">
              Average per-module pre/post confidence delta.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Mini label="Module Δ" value={formatDeltaNumber(topMetrics.avgModuleConfDelta)} />
              <Mini label="Outcome capture" value={`${topMetrics.moduleOutcomeRate.toFixed(0)}%`} />
              <Mini label="Video completion" value={`${topMetrics.videoCompletionRate.toFixed(0)}%`} />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Confidence and score deltas come from the per-module pre/post quick checks.
            </p>
          </article>
          <article className="card p-5">
            <h3 className="text-base text-ucla-900">Active learning signal</h3>
            <p className="mt-1 text-sm text-slate-500">
              Coach, systematic-read, and atlas-practice reps that happen inside the learning flow.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Mini label="Coach commits" value={activeLearningMetrics.coach.toString()} />
              <Mini label="Read steps" value={activeLearningMetrics.systematic.toString()} />
              <Mini label="Atlas reps" value={activeLearningMetrics.atlas.toString()} />
              <Mini label="Flashcard reps" value={activeLearningMetrics.flashcards.toString()} />
              <Mini
                label="Need review"
                value={activeLearningMetrics.flashcardsNeedReview.toString()}
              />
              <Mini label="Overconfident misses" value={activeLearningMetrics.highConfidenceIncorrect.toString()} />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Overconfident misses are module-coach questions missed with confidence rated 4 or 5.
            </p>
          </article>
          <article className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base text-ucla-900">Learners needing follow-up</h3>
              <span className="pill-primary">{followUpLearners.length}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Baselines captured but outcomes still pending.
            </p>
            <ul className="mt-3 space-y-2">
              {followUpLearners.map((l) => (
                <li
                  key={l.user.uid}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {l.user.displayName || l.user.email}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {l.user.email}
                    </span>
                  </span>
                  <span className="pill">{l.moduleOutcomesPending} module post pending</span>
                  {l.preCourseScore !== undefined && l.postCourseScore === undefined && (
                    <span className="pill-gold">course post pending</span>
                  )}
                </li>
              ))}
              {followUpLearners.length === 0 && (
                <li className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-500">
                  No follow-up flags yet.
                </li>
              )}
            </ul>
          </article>
          <article className="card p-5">
            <h3 className="text-base text-ucla-900">Most missed questions</h3>
            <p className="mt-1 text-sm text-slate-500">
              Use these to tighten teaching points and module explanations.
            </p>
            <ul className="mt-3 space-y-2">
              {questionAnalytics.map((q) => {
                const missRate = q.attempts === 0 ? 0 : (q.misses / q.attempts) * 100;
                const moduleTitle = moduleSummaries.find((m) => m.id === q.moduleId)?.shortTitle;
                return (
                  <li key={q.questionId} className="rounded-xl border border-slate-200 px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pill bg-rose-50 text-rose-800 border-rose-100">
                        {Math.round(missRate)}% missed
                      </span>
                      {moduleTitle && <span className="pill">{moduleTitle}</span>}
                      {q.domain && <span className="pill">{q.domain}</span>}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-700">{q.prompt}</p>
                    <div className="mt-1 text-xs text-slate-500">
                      {q.misses} misses / {q.attempts} attempts
                    </div>
                  </li>
                );
              })}
              {questionAnalytics.length === 0 && (
                <li className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-500">
                  No question attempts yet.
                </li>
              )}
            </ul>
          </article>
        </div>
      )}

      {tab === 'learners' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <article className="card overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="search" size={14} />
                </span>
                <input
                  className="input pl-9"
                  placeholder="Search learners…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <span className="text-xs text-slate-500">
                {filteredLearners.length} / {data.users.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2">Learner</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Mods</th>
                    <th className="px-4 py-2">Checks</th>
                    <th className="px-4 py-2">Course Δ</th>
                    <th className="px-4 py-2">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLearners.map((l) => {
                    const courseDelta =
                      l.preCourseScore !== undefined && l.postCourseScore !== undefined
                        ? l.postCourseScore - l.preCourseScore
                        : null;
                    return (
                      <tr
                        key={l.user.uid}
                        onClick={() => setSelectedUid(l.user.uid)}
                        className={[
                          'cursor-pointer border-b border-slate-50 hover:bg-slate-50',
                          selectedUid === l.user.uid ? 'bg-ucla-50/40' : '',
                        ].join(' ')}
                      >
                        <td className="px-4 py-2">
                          <div className="font-medium text-slate-800">
                            {l.user.displayName || '(no name)'}
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-[20ch]">
                            {l.user.email}
                          </div>
                        </td>
                        <td className="px-4 py-2 uppercase text-xs text-slate-600">
                          {l.user.role}
                        </td>
                        <td className="px-4 py-2 tabular-nums">
                          {l.modulesCompleted}/{coreModuleSummaries.length}
                        </td>
                        <td className="px-4 py-2 tabular-nums">
                          {l.modulePreChecks}/{l.modulePostChecks}
                        </td>
                        <td className="px-4 py-2 tabular-nums">
                          {courseDelta !== null
                            ? `${courseDelta > 0 ? '+' : ''}${Math.round(courseDelta)}%`
                            : '—'}
                        </td>
                        <td className="px-4 py-2 text-xs text-slate-500">
                          {formatDate(l.lastEventAt)}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLearners.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                        No learners yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="card p-5">
            {!selectedLearner && (
              <div className="text-sm text-slate-500">Select a learner to see detail.</div>
            )}
            {selectedLearner && selectedDetail && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Learner
                  </div>
                  <div className="text-base font-semibold text-ucla-900">
                    {selectedLearner.user.displayName}
                  </div>
                  <div className="text-xs text-slate-500">{selectedLearner.user.email}</div>
                </div>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-500">Modules done</dt>
                  <dd className="font-semibold tabular-nums">
                    {selectedLearner.modulesCompleted}/{coreModuleSummaries.length}
                  </dd>
                  <dt className="text-slate-500">Module baselines</dt>
                  <dd className="font-semibold tabular-nums">
                    {selectedLearner.modulePreChecks}/{coreModuleSummaries.length}
                  </dd>
                  <dt className="text-slate-500">Module outcomes</dt>
                  <dd className="font-semibold tabular-nums">
                    {selectedLearner.modulePostChecks}/{selectedLearner.modulePreChecks}
                  </dd>
                  <dt className="text-slate-500">Outcomes pending</dt>
                  <dd className="font-semibold tabular-nums">
                    {selectedLearner.moduleOutcomesPending}
                  </dd>
                  <dt className="text-slate-500">Course pre</dt>
                  <dd className="font-semibold tabular-nums">
                    {selectedLearner.preCourseScore !== undefined
                      ? `${Math.round(selectedLearner.preCourseScore)}%`
                      : '—'}
                  </dd>
                  <dt className="text-slate-500">Course post</dt>
                  <dd className="font-semibold tabular-nums">
                    {selectedLearner.postCourseScore !== undefined
                      ? `${Math.round(selectedLearner.postCourseScore)}%`
                      : '—'}
                  </dd>
                  <dt className="text-slate-500">Mod pre avg</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatOptionalPercent(selectedLearner.modulePreAvg)}
                  </dd>
                  <dt className="text-slate-500">Mod post avg</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatOptionalPercent(selectedLearner.modulePostAvg)}
                  </dd>
                  <dt className="text-slate-500">Cases (correct)</dt>
                  <dd className="font-semibold tabular-nums">
                    {selectedLearner.casesCorrect}/{selectedLearner.cases}
                  </dd>
                  <dt className="text-slate-500">Videos done</dt>
                  <dd className="font-semibold tabular-nums">
                    {selectedLearner.videosCompleted}/{videoResources.length}
                  </dd>
                </dl>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Per-module deltas
                  </div>
                  <ul className="mt-1 space-y-1 text-sm">
                    {selectedDetail.modules.map((p) => {
                      const m = moduleSummaries.find((x) => x.id === p.moduleId);
                      const delta =
                        p.preCheckScore !== undefined && p.postCheckScore !== undefined
                          ? p.postCheckScore - p.preCheckScore
                          : null;
                      return (
                        <li
                          key={p.moduleId}
                          className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5"
                        >
                          <span className="truncate">{m?.title ?? p.moduleId}</span>
                          <span className="tabular-nums text-xs text-slate-600">
                            {p.preCheckScore !== undefined ? `${Math.round(p.preCheckScore)}%` : '—'}
                            {' → '}
                            {p.postCheckScore !== undefined ? `${Math.round(p.postCheckScore)}%` : '—'}
                            {delta !== null && (
                              <span
                                className={[
                                  'ml-2 font-semibold',
                                  delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-rose-700' : '',
                                ].join(' ')}
                              >
                                ({delta > 0 ? '+' : ''}
                                {Math.round(delta)})
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                    {selectedDetail.modules.length === 0 && (
                      <li className="text-xs text-slate-500">No module activity yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {tab === 'modules' && (
        <article className="card mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">Module</th>
                  <th className="px-4 py-2">Region</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Views</th>
                  <th className="px-4 py-2">Pre</th>
                  <th className="px-4 py-2">Post</th>
                  <th className="px-4 py-2">Completions</th>
                  <th className="px-4 py-2">Active reps</th>
                  <th className="px-4 py-2">Score Δ</th>
                  <th className="px-4 py-2">Conf Δ</th>
                </tr>
              </thead>
              <tbody>
                {moduleAnalytics.map((m) => {
                  const scoreDelta =
                    m.preAvg !== undefined && m.postAvg !== undefined
                      ? m.postAvg - m.preAvg
                      : null;
                  const confDelta =
                    m.preConfAvg !== undefined && m.postConfAvg !== undefined
                      ? m.postConfAvg - m.preConfAvg
                      : null;
                  return (
                    <tr key={m.module.id} className="border-b border-slate-50">
                      <td className="px-4 py-2 font-medium text-slate-800">
                        {m.module.title}
                      </td>
                      <td className="px-4 py-2 text-slate-600">{m.module.region}</td>
                      <td className="px-4 py-2 text-slate-600">{m.module.estimatedMinutes} min</td>
                      <td className="px-4 py-2 tabular-nums">{m.views}</td>
                      <td className="px-4 py-2 tabular-nums">{m.preCheckCount}</td>
                      <td className="px-4 py-2 tabular-nums">{m.postCheckCount}</td>
                      <td className="px-4 py-2 tabular-nums">{m.completions}</td>
                      <td className="px-4 py-2 tabular-nums">
                        {m.activeAttemptCount}
                        {m.activeCorrectRate !== undefined && (
                          <span className="ml-1 text-xs text-slate-500">
                            ({Math.round(m.activeCorrectRate)}%)
                          </span>
                        )}
                      </td>
                      <td
                        className={[
                          'px-4 py-2 tabular-nums',
                          scoreDelta && scoreDelta > 0
                            ? 'text-emerald-700'
                            : scoreDelta && scoreDelta < 0
                              ? 'text-rose-700'
                              : 'text-slate-500',
                        ].join(' ')}
                      >
                        {scoreDelta !== null
                          ? `${scoreDelta > 0 ? '+' : ''}${Math.round(scoreDelta)}%`
                          : '—'}
                      </td>
                      <td
                        className={[
                          'px-4 py-2 tabular-nums',
                          confDelta && confDelta > 0
                            ? 'text-emerald-700'
                            : confDelta && confDelta < 0
                              ? 'text-rose-700'
                              : 'text-slate-500',
                        ].join(' ')}
                      >
                        {confDelta !== null ? `${confDelta > 0 ? '+' : ''}${confDelta.toFixed(1)}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {tab === 'audit' && (
        <article className="card mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">When</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Event</th>
                  <th className="px-4 py-2">Module</th>
                  <th className="px-4 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {recentAudit.map((e) => {
                  const u = data.users.find((x) => x.uid === e.userId);
                  return (
                    <tr key={e.id} className="border-b border-slate-50">
                      <td className="px-4 py-2 text-xs text-slate-500">
                        {formatDate(e.createdAt)}
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-medium text-slate-800 text-sm">
                          {u?.displayName ?? e.userId}
                        </div>
                        <div className="text-[11px] text-slate-500">{u?.email ?? ''}</div>
                      </td>
                      <td className="px-4 py-2 text-slate-700">{e.type}</td>
                      <td className="px-4 py-2 text-slate-600">{e.moduleId ?? '—'}</td>
                      <td className="px-4 py-2 text-xs text-slate-500 max-w-[24ch] truncate">
                        {e.details ? JSON.stringify(e.details) : ''}
                      </td>
                    </tr>
                  );
                })}
                {recentAudit.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                      No audit events yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-ucla-900">{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-base font-semibold tabular-nums text-ucla-900">{value}</div>
    </div>
  );
}
