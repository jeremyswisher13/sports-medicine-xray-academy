import { useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import type { QuickCheckQ } from '../data/quickChecks';

// A single inline knowledge-check question with instant feedback. Dropped between
// lesson sections to keep the single-scroll module interactive.
export function InlineQuickCheck({ q }: { q: QuickCheckQ }) {
  const [picked, setPicked] = useState<number | null>(null);

  // Shuffle options once so the answer isn't always in the same place.
  const { order, correctPos } = useMemo(() => {
    const ord = q.options.map((_, i) => i);
    for (let i = ord.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ord[i], ord[j]] = [ord[j], ord[i]];
    }
    return { order: ord, correctPos: ord.indexOf(q.answer) };
  }, [q]);

  const answered = picked !== null;

  return (
    <section className="card border-ucla-100 bg-ucla-50/40 p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ucla-600 text-white">
          <Icon name="lightning" size={15} />
        </span>
        <div className="section-title">Quick check</div>
      </div>
      <h3 className="mt-2 text-base text-ucla-900">{q.question}</h3>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {order.map((origIdx, pos) => {
          const isCorrect = pos === correctPos;
          const isPicked = pos === picked;
          let cls = 'border-slate-200 bg-white text-slate-800 hover:border-ucla-300';
          if (answered && isCorrect) cls = 'border-emerald-400 bg-emerald-50 text-emerald-800';
          else if (answered && isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-800';
          else if (answered) cls = 'border-slate-200 bg-white text-slate-400';
          return (
            <button
              key={pos}
              type="button"
              disabled={answered}
              onClick={() => setPicked(pos)}
              className={[
                'flex w-full items-center gap-2 rounded-lg border-2 px-3 py-2 text-left text-sm font-medium transition-colors disabled:cursor-default',
                cls,
              ].join(' ')}
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[11px]">
                {String.fromCharCode(65 + pos)}
              </span>
              {q.options[origIdx]}
              {answered && isCorrect && <span className="sr-only"> (correct answer)</span>}
              {answered && isPicked && !isCorrect && (
                <span className="sr-only"> (your answer, incorrect)</span>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          role="status"
          aria-live="polite"
          className={[
            'mt-3 rounded-lg border px-3 py-2 text-sm',
            picked === correctPos
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-amber-200 bg-amber-50 text-amber-800',
          ].join(' ')}
        >
          <span className="font-semibold">
            {picked === correctPos ? 'Correct. ' : 'Not quite. '}
          </span>
          {q.explanation}
        </div>
      )}
    </section>
  );
}
