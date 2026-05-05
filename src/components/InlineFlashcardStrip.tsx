import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { flashcards } from '../data/flashcards';
import { useAuth } from '../context/AuthContext';
import { logAuditEvent } from '../services/firestore';
import {
  loadFlashcardState,
  nextDueAt,
  saveFlashcardState,
} from '../utils/flashcardSchedule';
import type { Flashcard as FlashcardData } from '../types';
import { Icon } from './ui/Icon';

interface InlineFlashcardStripProps {
  moduleId: string;
  maxCards?: number;
  startIndex?: number;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULT_CARD_COUNT = 4;
const MIN_CARD_COUNT = 3;
const MAX_CARD_COUNT = 5;

function clampCardCount(count: number): number {
  return Math.min(Math.max(count, MIN_CARD_COUNT), MAX_CARD_COUNT);
}

export function InlineFlashcardStrip({
  moduleId,
  maxCards = DEFAULT_CARD_COUNT,
  startIndex = 0,
  eyebrow = 'Active recall',
  title = 'Quick flashcards',
  description,
  className = '',
}: InlineFlashcardStripProps) {
  const { user, learnerPreview } = useAuth();
  const [revealedCardIds, setRevealedCardIds] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const [reviewedCardIds, setReviewedCardIds] = useState<ReadonlySet<string>>(
    () => new Set(loadFlashcardState().reviewedIds),
  );

  const cards = useMemo(() => {
    const limit = clampCardCount(maxCards);
    const moduleCards = flashcards.filter((card) => card.moduleId === moduleId);
    if (moduleCards.length <= limit) return moduleCards;
    return Array.from({ length: limit }, (_, idx) => {
      const safeIndex = (startIndex + idx) % moduleCards.length;
      return moduleCards[safeIndex];
    });
  }, [maxCards, moduleId, startIndex]);

  useEffect(() => {
    setRevealedCardIds(new Set<string>());
    setReviewedCardIds(new Set(loadFlashcardState().reviewedIds));
  }, [moduleId, maxCards, startIndex]);

  function toggleCard(cardId: string) {
    setRevealedCardIds((current) => {
      const next = new Set(current);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  }

  function recordCardReview(card: FlashcardData, outcome: 'got-it' | 'review') {
    const persisted = loadFlashcardState();
    const reviewedIds = Array.from(new Set([...persisted.reviewedIds, card.id]));
    let needsReviewIds = persisted.needsReviewIds.filter((id) => id !== card.id);
    if (outcome === 'review') {
      needsReviewIds = Array.from(new Set([...needsReviewIds, card.id]));
    }

    saveFlashcardState({
      reviewedIds,
      needsReviewIds,
      dueById: {
        ...persisted.dueById,
        [card.id]: nextDueAt(outcome),
      },
    });
    setReviewedCardIds(new Set(reviewedIds));

    if (user && !learnerPreview) {
      void logAuditEvent({
        userId: user.uid,
        type: 'flashcard_reviewed',
        moduleId: card.moduleId,
        refId: card.id,
        details: { outcome, source: 'module-inline' },
      });
    }
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className={['space-y-3', className].filter(Boolean).join(' ')}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="section-title">{eyebrow}</div>
          <h2 className="mt-1 text-xl text-ucla-900 sm:text-2xl">{title}</h2>
          {description && (
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          )}
        </div>
        <Link
          to={`/flashcards?module=${encodeURIComponent(moduleId)}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-ucla-200 bg-white px-3 py-1.5 text-xs font-semibold text-ucla-800 shadow-soft no-underline transition-colors hover:bg-ucla-50 hover:text-ucla-900"
        >
          Study deck
          <Icon name="arrow-right" size={14} />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const revealed = revealedCardIds.has(card.id);

          return (
            <article
              key={card.id}
              className={[
                'group flex min-h-44 flex-col justify-between rounded-xl border p-4 text-left shadow-soft transition-colors',
                revealed
                  ? 'border-ucla-200 bg-white text-slate-800'
                  : 'border-ucla-100 bg-ucla-50/80 text-ucla-900 hover:bg-white',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => toggleCard(card.id)}
                aria-expanded={revealed}
                className="flex flex-1 flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ucla-700">
                      <Icon name={revealed ? 'check-circle' : 'sparkles'} size={14} />
                      Card {index + 1}
                    </span>
                    <span className="rounded-full border border-ucla-100 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      {reviewedCardIds.has(card.id)
                        ? 'Counted'
                        : revealed
                          ? 'Answer'
                          : 'Prompt'}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold leading-relaxed text-ucla-950 text-balance">
                    {card.front}
                  </p>

                  {revealed && (
                    <div className="mt-3 rounded-lg border border-ucla-100 bg-ucla-50/60 p-3">
                      <p className="text-sm leading-relaxed text-slate-700">{card.back}</p>
                      {card.pearl && (
                        <p className="mt-2 border-t border-ucla-100 pt-2 text-xs font-medium leading-relaxed text-ucla-800">
                          {card.pearl}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-ucla-700">
                  <span>{revealed ? 'Tap to hide' : 'Tap to reveal'}</span>
                  <Icon
                    name={revealed ? 'chevron-left' : 'chevron-right'}
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </button>

              {revealed && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ucla-100 pt-3">
                  <button
                    type="button"
                    onClick={() => recordCardReview(card, 'got-it')}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                  >
                    <Icon name="check" size={13} />
                    Got it
                  </button>
                  <button
                    type="button"
                    onClick={() => recordCardReview(card, 'review')}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-900 transition-colors hover:bg-gold-100"
                  >
                    <Icon name="star" size={13} />
                    Review
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
