import { useEffect, useState } from 'react';
import { Icon } from './ui/Icon';
import type { Flashcard as Card } from '../types';

interface Props {
  card: Card;
  index: number;
  total: number;
  onResult: (outcome: 'got-it' | 'review') => void;
  onSkip?: () => void;
}

export function Flashcard({ card, index, total, onResult, onSkip }: Props) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip on card change.
  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  // Keyboard shortcuts for rapid review. Uses letters + arrows (not Space/Enter)
  // so it never conflicts with native button activation when a control is
  // focused. Ignored while typing in a form field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) {
        return;
      }
      switch (e.key) {
        case 'f':
        case 'F':
          e.preventDefault();
          setFlipped((prev) => !prev);
          break;
        case 'ArrowRight':
        case 'g':
        case 'G':
          e.preventDefault();
          onResult('got-it');
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          onResult('review');
          break;
        case 's':
        case 'S':
          if (onSkip) {
            e.preventDefault();
            onSkip();
          }
          break;
        default:
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onResult, onSkip]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold uppercase tracking-wide text-ucla-700">
          Card {index + 1} of {total}
        </span>
        <button
          type="button"
          className="text-slate-500 hover:text-slate-800"
          onClick={() => onSkip?.()}
        >
          Skip
        </button>
      </div>

      <div className="[perspective:1400px]">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? 'Show prompt' : 'Reveal answer'}
          className={[
            'relative w-full rounded-2xl text-left transition-transform duration-500 [transform-style:preserve-3d] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ucla-600 focus-visible:ring-offset-2',
            'min-h-[260px] sm:min-h-[280px]',
            flipped ? '[transform:rotateY(180deg)]' : '',
          ].join(' ')}
        >
          {/* Front */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <article className="card flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ucla-700">
                  Prompt
                </div>
                <p className="mt-3 font-serif text-2xl leading-snug text-ucla-900 text-balance">
                  {card.front}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>Tap to reveal</span>
                <Icon name="chevron-right" size={16} />
              </div>
            </article>
          </div>
          {/* Back */}
          <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <article className="card flex h-full flex-col justify-between p-6 sm:p-8 bg-ucla-50/60">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ucla-700">
                  Answer
                </div>
                <p className="mt-3 text-base leading-relaxed text-slate-800">{card.back}</p>
                {card.pearl && (
                  <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50/70 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-gold-800">
                      Pearl
                    </div>
                    <p className="mt-1 text-sm text-slate-800">{card.pearl}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>Tap to flip back</span>
                <Icon name="chevron-left" size={16} />
              </div>
            </article>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onResult('review')}
        >
          <Icon name="alert" size={14} />
          Need review
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => onResult('got-it')}
        >
          <Icon name="check" size={14} />
          Got it
        </button>
      </div>

      <p className="hidden text-right text-[11px] text-slate-400 sm:block">
        Shortcuts: <kbd className="font-semibold text-slate-500">F</kbd> flip ·{' '}
        <kbd className="font-semibold text-slate-500">G</kbd> got it ·{' '}
        <kbd className="font-semibold text-slate-500">R</kbd> review ·{' '}
        <kbd className="font-semibold text-slate-500">S</kbd> skip
      </p>
    </div>
  );
}
