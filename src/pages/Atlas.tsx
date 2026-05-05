import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { XRayImage } from '../components/XRayImage';
import { getAllRealImages } from '../data/images';
import { moduleSummaries } from '../data/moduleSummaries';
import { useAuth } from '../context/AuthContext';
import { ids, logAuditEvent, saveQuizAttempt } from '../services/firestore';
import type { XRayImageEntry } from '../types';

type AtlasKind = 'all' | 'normal' | 'pathology';
type PracticeMode = 'normal-pathology' | 'view' | 'key-clue';

const practiceViews = ['AP', 'Lateral', 'Oblique', 'Special', 'Annotated', 'Comparison'] as const;

type PracticeView = (typeof practiceViews)[number];
type PracticeImageEntry = XRayImageEntry & { view: PracticeView };

interface PracticeChoice {
  id: string;
  label: string;
}

interface PracticeStats {
  answered: number;
  correct: number;
  streak: number;
}

const emptyPracticeStats: PracticeStats = { answered: 0, correct: 0, streak: 0 };

function isPracticeImage(entry: XRayImageEntry): entry is PracticeImageEntry {
  return practiceViews.some((view) => view === entry.view);
}

function normalFirst(entries: PracticeImageEntry[]) {
  return [
    ...entries.filter((entry) => entry.isNormal),
    ...entries.filter((entry) => !entry.isNormal),
  ];
}

function getKeyClueText(entry: XRayImageEntry) {
  return (entry.caption ?? entry.alt).trim();
}

function hasKeyClue(entry: XRayImageEntry) {
  return getKeyClueText(entry).length > 0;
}

function buildPracticePool(
  mode: PracticeMode,
  filtered: XRayImageEntry[],
  allImages: XRayImageEntry[],
) {
  const filteredPractice = filtered.filter(isPracticeImage);
  const allPractice = allImages.filter(isPracticeImage);

  if (mode === 'normal-pathology') {
    const hasNormal = filteredPractice.some((entry) => entry.isNormal);
    const hasPathology = filteredPractice.some((entry) => !entry.isNormal);
    return normalFirst(hasNormal && hasPathology ? filteredPractice : allPractice);
  }

  if (mode === 'key-clue') {
    const filteredWithClues = filteredPractice.filter(hasKeyClue);
    const allWithClues = allPractice.filter(hasKeyClue);
    return normalFirst(filteredWithClues.length > 0 ? filteredWithClues : allWithClues);
  }

  return filteredPractice.length > 0 ? filteredPractice : allPractice;
}

function buildViewChoices(entry: PracticeImageEntry, pool: PracticeImageEntry[]): PracticeChoice[] {
  const poolViews = practiceViews.filter((view) => pool.some((image) => image.view === view));
  const orderedViews = [
    entry.view,
    ...poolViews.filter((view) => view !== entry.view),
    ...practiceViews.filter((view) => view !== entry.view && !poolViews.includes(view)),
  ];

  return orderedViews.slice(0, 4).map((view) => ({ id: view, label: view }));
}

function buildPracticeChoices(
  mode: PracticeMode,
  entry: PracticeImageEntry | undefined,
  pool: PracticeImageEntry[],
): PracticeChoice[] {
  if (!entry) return [];
  if (mode === 'normal-pathology') {
    return [
      { id: 'normal', label: 'Normal anatomy' },
      { id: 'pathology', label: 'Pathology' },
    ];
  }
  if (mode === 'view') {
    return buildViewChoices(entry, pool);
  }
  return [];
}

function getCorrectChoiceId(mode: PracticeMode, entry: PracticeImageEntry | undefined) {
  if (!entry) return null;
  if (mode === 'normal-pathology') return entry.isNormal ? 'normal' : 'pathology';
  if (mode === 'view') return entry.view;
  return null;
}

function getPracticeAnswer(mode: PracticeMode, entry: PracticeImageEntry) {
  const clue = getKeyClueText(entry);
  if (mode === 'normal-pathology') {
    return entry.isNormal
      ? 'Normal anatomy. Anchor on alignment, cortical contours, joint spacing, and soft tissues before looking for injury.'
      : `Pathology. Key clue: ${clue}`;
  }
  if (mode === 'view') {
    return `${entry.view} view. ${clue}`;
  }
  return clue;
}

export function AtlasPage() {
  const { user, learnerPreview } = useAuth();
  const allImages = useMemo(() => getAllRealImages(), []);
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [kindFilter, setKindFilter] = useState<AtlasKind>('normal');
  const [query, setQuery] = useState('');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('normal-pathology');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const [practiceStats, setPracticeStats] = useState<Record<PracticeMode, PracticeStats>>({
    'normal-pathology': emptyPracticeStats,
    view: emptyPracticeStats,
    'key-clue': emptyPracticeStats,
  });

  const imageCounts = useMemo(
    () => ({
      total: allImages.length,
      normal: allImages.filter((image) => image.isNormal).length,
      pathology: allImages.filter((image) => !image.isNormal).length,
    }),
    [allImages],
  );

  const filtered = useMemo(() => {
    return allImages.filter((img) => {
      const matchesModule =
        moduleFilter === 'all' || img.moduleId === moduleFilter;
      const matchesKind =
        kindFilter === 'all' ||
        (kindFilter === 'normal' && img.isNormal) ||
        (kindFilter === 'pathology' && !img.isNormal);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [img.caption, img.alt, img.attribution]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesModule && matchesKind && matchesQuery;
    });
  }, [allImages, moduleFilter, kindFilter, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const img of filtered) {
      const key = img.moduleId ?? 'other';
      const arr = map.get(key) ?? [];
      arr.push(img);
      map.set(key, arr);
    }
    return map;
  }, [filtered]);

  const moduleTitleById = useMemo(
    () => new Map(moduleSummaries.map((module) => [module.id, module.title])),
    [],
  );

  const practiceImages = useMemo(
    () => buildPracticePool(practiceMode, filtered, allImages),
    [allImages, filtered, practiceMode],
  );

  const safePracticeIndex = practiceImages.length > 0
    ? practiceIndex % practiceImages.length
    : 0;
  const practiceImage = practiceImages[safePracticeIndex];
  const practiceChoices = useMemo(
    () => buildPracticeChoices(practiceMode, practiceImage, practiceImages),
    [practiceImage, practiceImages, practiceMode],
  );
  const correctChoiceId = getCorrectChoiceId(practiceMode, practiceImage);
  const practiceAnswer = practiceImage ? getPracticeAnswer(practiceMode, practiceImage) : '';
  const practiceModuleTitle = practiceImage?.moduleId
    ? moduleTitleById.get(practiceImage.moduleId)
    : undefined;
  const activePracticeStats = practiceStats[practiceMode];

  useEffect(() => {
    setSelectedChoice(null);
    setShowPracticeAnswer(false);
  }, [practiceImage?.id, practiceMode]);

  const handleNextPractice = () => {
    setPracticeIndex((current) => (
      practiceImages.length > 0 ? (current + 1) % practiceImages.length : 0
    ));
  };

  const handleRandomPractice = () => {
    setPracticeIndex((current) => {
      if (practiceImages.length <= 1) return 0;
      const safeCurrent = current % practiceImages.length;
      const next = Math.floor(Math.random() * practiceImages.length);
      return next === safeCurrent ? (next + 1) % practiceImages.length : next;
    });
  };

  function saveAtlasPractice(choiceId: string, correct: boolean) {
    if (!user || learnerPreview || !practiceImage) return;
    const now = Date.now();
    void saveQuizAttempt({
      id: ids.newId(),
      userId: user.uid,
      scope: 'atlas-practice',
      ...(practiceImage.moduleId ? { moduleId: practiceImage.moduleId } : {}),
      startedAt: now,
      submittedAt: now,
      answers: [
        {
          questionId: `${practiceImage.id}:${practiceMode}`,
          selectedOptionId: choiceId,
          correct,
        },
      ],
      scorePercent: correct ? 100 : 0,
    });
    void logAuditEvent({
      userId: user.uid,
      type: 'atlas_practice_answered',
      ...(practiceImage.moduleId ? { moduleId: practiceImage.moduleId } : {}),
      refId: practiceImage.id,
      details: {
        mode: practiceMode,
        correct,
      },
    });
  }

  const handlePracticeChoice = (choiceId: string) => {
    if (showPracticeAnswer) return;
    setSelectedChoice(choiceId);
    setShowPracticeAnswer(true);
    const correct = correctChoiceId ? choiceId === correctChoiceId : true;
    setPracticeStats((prev) => {
      const current = prev[practiceMode];
      return {
        ...prev,
        [practiceMode]: {
          answered: current.answered + 1,
          correct: current.correct + (correct ? 1 : 0),
          streak: correct ? current.streak + 1 : 0,
        },
      };
    });
    if (correctChoiceId) {
      saveAtlasPractice(choiceId, correct);
    }
  };

  const handleRevealKeyClue = () => {
    if (showPracticeAnswer) return;
    setShowPracticeAnswer(true);
    setPracticeStats((prev) => {
      const current = prev[practiceMode];
      return {
        ...prev,
        [practiceMode]: {
          answered: current.answered + 1,
          correct: current.correct + 1,
          streak: current.streak + 1,
        },
      };
    });
    saveAtlasPractice('revealed-key-clue', true);
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-title">Open-license teaching atlas</div>
          <h1 className="mt-1 text-balance">Image atlas</h1>
          <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
            Start with normal anatomy, then compare pathology. All radiographs are open-license
            teaching images with source attribution and license metadata.
          </p>
        </div>
        <div className="card flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
            <Icon name="image" size={16} />
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Atlas
            </div>
            <div className="text-sm font-semibold text-ucla-900">
              {imageCounts.total} images · {imageCounts.normal} normal ·{' '}
              {imageCounts.pathology} pathology
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(['all', 'normal', 'pathology'] as const).map((k) => {
          const active = kindFilter === k;
          const count =
            k === 'all'
              ? imageCounts.total
              : k === 'normal'
                ? imageCounts.normal
                : imageCounts.pathology;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={[
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize',
                active
                  ? k === 'normal'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
                    : 'border-ucla-200 bg-ucla-50 text-ucla-900 ring-1 ring-ucla-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
              ].join(' ')}
            >
              {k === 'all' ? 'All' : k === 'normal' ? 'Normal anatomy' : 'Pathology'} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={14} />
          </span>
          <input
            className="input pl-9"
            placeholder="Search by finding, view, or contributor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input"
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
        >
          <option value="all">All modules</option>
          {moduleSummaries.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-ucla-100 bg-gradient-to-br from-white via-ucla-50/70 to-white shadow-soft">
        <div className="grid gap-4 p-4 lg:grid-cols-[0.95fr_1.05fr] lg:p-5">
          <div className="flex flex-col justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-ucla-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ucla-800">
                <Icon name="lightning" size={13} />
                Atlas practice
              </div>
              <h2 className="mt-3 text-2xl text-ucla-950">Normal-first image reps</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                Work the same filtered atlas set as quick calls: normal versus pathology, view
                recognition, then a key clue from the image metadata.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {([
                { id: 'normal-pathology', label: 'Normal vs pathology', icon: 'check-circle' },
                { id: 'view', label: 'View recognition', icon: 'eye' },
                { id: 'key-clue', label: 'Key clue', icon: 'sparkles' },
              ] as const).map((mode) => {
                const active = practiceMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPracticeMode(mode.id)}
                    className={[
                      'flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition',
                      active
                        ? 'border-ucla-200 bg-white text-ucla-900 ring-1 ring-ucla-100'
                        : 'border-white bg-white/70 text-slate-700 hover:border-ucla-100 hover:bg-white',
                    ].join(' ')}
                  >
                    <span className={[
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      active ? 'bg-ucla-50 text-ucla-800' : 'bg-slate-50 text-slate-500',
                    ].join(' ')}
                    >
                      <Icon name={mode.icon} size={15} />
                    </span>
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-ucla-100 bg-white/80 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Practice pool
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-ucla-950">
                    {practiceImages.length} image{practiceImages.length === 1 ? '' : 's'}
                    {practiceModuleTitle ? ` · ${practiceModuleTitle}` : ''}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {activePracticeStats.correct}/{activePracticeStats.answered} correct · streak{' '}
                    {activePracticeStats.streak}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRandomPractice}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ucla-100 bg-white px-3 text-xs font-semibold text-ucla-800 hover:bg-ucla-50"
                  >
                    <Icon name="sparkles" size={13} />
                    Random
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPractice}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ucla-700 px-3 text-xs font-semibold text-white hover:bg-ucla-800"
                  >
                    Next
                    <Icon name="arrow-right" size={13} />
                  </button>
                </div>
              </div>
            </div>

            {practiceImage && (
              <div className="rounded-xl border border-ucla-100 bg-white/85 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ucla-800">
                  <Icon
                    name={
                      practiceMode === 'normal-pathology'
                        ? 'check-circle'
                        : practiceMode === 'view'
                          ? 'eye'
                          : 'sparkles'
                    }
                    size={13}
                  />
                  {practiceMode === 'normal-pathology'
                    ? 'Normal-vs-pathology challenge'
                    : practiceMode === 'view'
                      ? 'View recognition'
                      : 'Key-clue prompt'}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {practiceMode === 'normal-pathology'
                    ? 'Call the image before reading the caption.'
                    : practiceMode === 'view'
                      ? 'Name the projection, then check the label.'
                      : 'Commit the key clue you would say out loud.'}
                </p>

                {practiceChoices.length > 0 ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {practiceChoices.map((choice) => {
                      const selected = selectedChoice === choice.id;
                      const correct = correctChoiceId === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => handlePracticeChoice(choice.id)}
                          className={[
                            'rounded-xl border px-3 py-2 text-left text-sm font-semibold transition',
                            showPracticeAnswer && correct
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                              : showPracticeAnswer && selected
                                ? 'border-rose-200 bg-rose-50 text-rose-700'
                                : selected
                                  ? 'border-ucla-300 bg-ucla-50 text-ucla-900 ring-1 ring-ucla-100'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-ucla-200 hover:bg-ucla-50',
                          ].join(' ')}
                        >
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleRevealKeyClue}
                    disabled={showPracticeAnswer}
                    className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-ucla-700 px-3 text-xs font-semibold text-white hover:bg-ucla-800 disabled:cursor-default disabled:bg-ucla-200"
                  >
                    {showPracticeAnswer ? 'Clue revealed' : 'Reveal clue'}
                    <Icon name="chevron-right" size={13} />
                  </button>
                )}

                {showPracticeAnswer && (
                  <div className="mt-3 rounded-xl border border-ucla-100 bg-ucla-50/80 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ucla-800">
                      Answer
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      {practiceAnswer}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative min-h-[280px]">
            {practiceImage ? (
              <div className="relative overflow-hidden rounded-xl border border-ucla-100 bg-white p-2">
                {showPracticeAnswer ? (
                  <XRayImage entry={practiceImage} />
                ) : (
                  <>
                    <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-soft">
                      <img
                        src={practiceImage.src}
                        alt="Atlas practice radiograph"
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    </figure>
                    <div className="absolute left-2 right-12 top-2 z-10 inline-flex min-h-8 items-center gap-1.5 rounded-xl border border-ucla-100 bg-white/95 px-3 py-1 text-xs font-semibold text-ucla-900 shadow-soft">
                      <Icon name="eye" size={12} />
                      Make the call first
                    </div>
                    <div className="absolute inset-x-2 bottom-2 z-10 rounded-b-xl border-t border-ucla-100 bg-white/95 px-3 py-2 text-[11px] font-semibold text-slate-600 backdrop-blur">
                      Caption, label, and attribution reveal after the call.
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-ucla-100 bg-white text-sm text-slate-500">
                No practice images match those filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {kindFilter === 'normal' && (
        <div className="mt-5 rounded-xl border border-ucla-100 bg-white p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
              <Icon name="check-circle" size={16} />
            </span>
            <div>
              <div className="text-sm font-semibold text-ucla-900">
                Normal-first study mode
              </div>
              <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600">
                Review normal alignment, joint spacing, cortical contours, and growth plates before
                pathology. This view keeps the learner anchored to normal before introducing
                abnormal patterns.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-8">
        {moduleSummaries
          .filter((m) => grouped.has(m.id))
          .map((m) => {
            const list = grouped.get(m.id) ?? [];
            return (
              <section key={m.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl">{m.title}</h2>
                  <span className="text-xs text-slate-500">
                    {list.length} image{list.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((img) => (
                    <XRayImage key={img.id} entry={img} />
                  ))}
                </div>
              </section>
            );
          })}
        {grouped.size === 0 && (
          <div className="card p-6 text-center text-sm text-slate-500">
            No images match those filters.
          </div>
        )}
      </div>

      <div className="mt-10 card p-5 text-xs text-slate-500 leading-relaxed">
        <div className="font-semibold text-ucla-900 mb-1">Licensing and patient-image policy</div>
        Images in this atlas are open-license radiographs from Wikimedia Commons or original
        non-patient teaching assets. Each radiograph is attributed to its contributor and links back
        to the original file page. Real patient images are not used in this deployed academy.
      </div>
    </div>
  );
}
