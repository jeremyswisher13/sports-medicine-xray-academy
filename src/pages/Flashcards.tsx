import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { Flashcard } from '../components/Flashcard';
import { flashcards } from '../data/flashcards';
import { moduleSummaries } from '../data/moduleSummaries';
import { useAuth } from '../context/AuthContext';
import { logAuditEvent } from '../services/firestore';
import type { Flashcard as FlashcardData } from '../types';

const STORAGE_KEY = 'sxra:flashcards-state';

interface PersistedState {
  reviewedIds: string[];
  needsReviewIds: string[];
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // ignore
  }
  return { reviewedIds: [], needsReviewIds: [] };
}

function saveState(s: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function validModuleFilter(moduleId: string | null): string {
  return moduleId && moduleSummaries.some((module) => module.id === moduleId)
    ? moduleId
    : 'all';
}

export function FlashcardsPage() {
  const { user, learnerPreview } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleParam = searchParams.get('module');
  const [moduleFilter, setModuleFilter] = useState<string>(() =>
    validModuleFilter(moduleParam),
  );
  const [mode, setMode] = useState<'all' | 'review-only'>('all');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [persisted, setPersisted] = useState<PersistedState>(loadState);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    saveState(persisted);
  }, [persisted]);

  useEffect(() => {
    setModuleFilter(validModuleFilter(moduleParam));
  }, [moduleParam]);

  const moduleDecks = useMemo(() => {
    return moduleSummaries
      .map((m) => ({
        module: m,
        cards: flashcards.filter((f) => f.moduleId === m.id),
      }))
      .filter((d) => d.cards.length > 0);
  }, []);

  const deck = useMemo(() => {
    let pool = flashcards;
    if (moduleFilter !== 'all') {
      pool = pool.filter((f) => f.moduleId === moduleFilter);
    }
    if (mode === 'review-only') {
      pool = pool.filter((f) => persisted.needsReviewIds.includes(f.id));
    }
    return shuffleSeed === 0 ? pool : shuffle(pool);
  }, [moduleFilter, mode, persisted.needsReviewIds, shuffleSeed]);

  // Reset index when deck composition changes.
  useEffect(() => {
    setIndex(0);
  }, [moduleFilter, mode, shuffleSeed]);

  const card = deck[index];

  function recordFlashcardReview(
    outcome: 'got-it' | 'review' | 'skip',
    reviewedCard: FlashcardData,
  ) {
    if (!user || learnerPreview) return;
    void logAuditEvent({
      userId: user.uid,
      type: 'flashcard_reviewed',
      moduleId: reviewedCard.moduleId,
      refId: reviewedCard.id,
      details: { outcome },
    });
  }

  function handleResult(outcome: 'got-it' | 'review') {
    if (!card) return;
    recordFlashcardReview(outcome, card);
    setPersisted((prev) => {
      const reviewedIds = Array.from(new Set([...prev.reviewedIds, card.id]));
      let needsReviewIds = prev.needsReviewIds.filter((id) => id !== card.id);
      if (outcome === 'review') {
        needsReviewIds = Array.from(new Set([...needsReviewIds, card.id]));
      }
      return { reviewedIds, needsReviewIds };
    });
    setIndex((i) => (i + 1) % Math.max(deck.length, 1));
  }

  function handleSkip() {
    if (card) recordFlashcardReview('skip', card);
    setIndex((i) => (i + 1) % Math.max(deck.length, 1));
  }

  function changeModuleFilter(next: string) {
    setModuleFilter(next);
    if (next === 'all') setSearchParams({});
    else setSearchParams({ module: next });
  }

  function resetProgress() {
    setPersisted({ reviewedIds: [], needsReviewIds: [] });
    setIndex(0);
  }

  const totalReviewed = persisted.reviewedIds.length;
  const totalNeedReview = persisted.needsReviewIds.length;
  const totalCards = flashcards.length;

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-title">Active recall</div>
          <h1 className="mt-1 text-balance">Flashcards</h1>
          <p className="mt-1 max-w-prose text-slate-600 leading-relaxed">
            High-yield prompts for spaced retrieval. Tap a card to flip; mark "Got it" or
            "Need review."
          </p>
        </div>
        <div className="card flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ucla-50 text-ucla-800">
            <Icon name="lightning" size={16} />
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your review pile
            </div>
            <div className="text-sm font-semibold text-ucla-900 tabular-nums">
              {totalNeedReview} cards · {totalReviewed}/{totalCards} reviewed
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6">
        {card ? (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="section-title">Current card</div>
                <h2 className="mt-1 text-base text-ucla-900">
                  {moduleFilter === 'all'
                    ? 'Mixed sports X-ray deck'
                    : moduleSummaries.find((module) => module.id === moduleFilter)?.title}
                </h2>
              </div>
              <span className="pill border-ucla-100 bg-ucla-50 text-ucla-800">
                {mode === 'review-only' ? 'Review pile' : `${deck.length} cards`}
              </span>
            </div>
            <Flashcard
              card={card}
              index={index}
              total={deck.length}
              onResult={handleResult}
              onSkip={handleSkip}
            />
          </>
        ) : (
          <div className="card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Icon name="check" size={20} />
            </div>
            <h3 className="mt-3 text-ucla-900">Nothing in this deck.</h3>
            <p className="mt-1 text-sm text-slate-600">
              {mode === 'review-only'
                ? 'No cards are flagged for review. Try studying all cards.'
                : 'Pick a different module.'}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link to="/modules" className="btn-secondary">
                Back to modules
              </Link>
              <button
                className="btn-primary"
                onClick={() => {
                  setMode('all');
                  setModuleFilter('all');
                  setShuffleSeed((s) => s + 1);
                }}
              >
                Study all cards
              </button>
            </div>
          </div>
        )}
      </section>

      <details className="mt-4 rounded-2xl border border-ucla-100 bg-white/95 p-4 shadow-soft">
        <summary className="cursor-pointer text-sm font-semibold text-ucla-900">
          Choose deck and study mode
        </summary>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className="input"
            value={moduleFilter}
            onChange={(e) => changeModuleFilter(e.target.value)}
            aria-label="Filter by module"
          >
            <option value="all">All modules ({flashcards.length})</option>
            {moduleDecks.map((d) => (
              <option key={d.module.id} value={d.module.id}>
                {d.module.title} ({d.cards.length})
              </option>
            ))}
          </select>
          <select
            className="input"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'all' | 'review-only')}
            aria-label="Study mode"
          >
            <option value="all">All cards</option>
            <option value="review-only">Only "Need review"</option>
          </select>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShuffleSeed((s) => s + 1)}
          >
            <Icon name="lightning" size={14} />
            Shuffle
          </button>
          <button type="button" className="btn-ghost" onClick={resetProgress}>
            Reset progress
          </button>
        </div>

        <section className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="label">Module decks</div>
            <button
              type="button"
              onClick={() => {
                setMode('all');
                changeModuleFilter('all');
              }}
              className="text-xs font-semibold text-ucla-700 hover:text-ucla-900"
            >
              Study all {totalCards}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {moduleDecks.map((deckSummary) => {
              const selected = moduleFilter === deckSummary.module.id;
              const reviewedCount = deckSummary.cards.filter((deckCard) =>
                persisted.reviewedIds.includes(deckCard.id),
              ).length;
              return (
                <button
                  key={deckSummary.module.id}
                  type="button"
                  onClick={() => {
                    setMode('all');
                    changeModuleFilter(deckSummary.module.id);
                  }}
                  className={[
                    'rounded-2xl border p-3 text-left shadow-soft transition-colors',
                    selected
                      ? 'border-ucla-300 bg-ucla-700 text-white'
                      : 'border-ucla-100 bg-white/90 text-slate-700 hover:bg-ucla-50',
                  ].join(' ')}
                  aria-pressed={selected}
                >
                  <div
                    className={[
                      'text-sm font-semibold leading-tight',
                      selected ? 'text-white' : 'text-ucla-900',
                    ].join(' ')}
                  >
                    {deckSummary.module.shortTitle}
                  </div>
                  <div className={selected ? 'mt-1 text-xs text-ucla-50' : 'mt-1 text-xs text-slate-500'}>
                    {reviewedCount}/{deckSummary.cards.length} reviewed
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </details>
    </div>
  );
}
