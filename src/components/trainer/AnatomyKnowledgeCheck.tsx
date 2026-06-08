import { useEffect, useMemo, useState } from 'react';
import { AnnotatedXray } from './AnnotatedXray';
import { Icon } from '../ui/Icon';
import type { TrainerCheckItem } from '../../data/anatomyTrainer';

interface Props {
  items: TrainerCheckItem[];
  onComplete?: (score: number, total: number) => void;
}

// Marker on the film → "what is the marked structure?" multiple choice, scored.
export function AnatomyKnowledgeCheck({ items, onComplete }: Props) {
  const [round, setRound] = useState(0);

  // Shuffle each question's options once per round so the answer isn't always A.
  const qs = useMemo(() => {
    void round;
    return items.map((it) => {
      const order = it.options.map((_, n) => n);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return { ...it, optOrder: order, correctPos: order.indexOf(it.answer) };
    });
  }, [items, round]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }, [items]);

  useEffect(() => {
    if (done) onComplete?.(score, qs.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function restart() {
    setRound((r) => r + 1);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (!qs.length) return null;

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    const message =
      pct >= 90
        ? "Excellent — you've internalized the normal anatomy."
        : pct >= 70
          ? 'Solid. Review the ones you missed, then move on.'
          : 'Keep going — run the Guided Tour again, then retake the check.';
    return (
      <div className="mx-auto max-w-md py-6 text-center">
        <div className="section-title">Knowledge check</div>
        <p className="mt-2 text-5xl font-bold text-ucla-700">
          {score}
          <span className="text-2xl font-normal text-slate-400">/{qs.length}</span>
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{pct}%</p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-slate-600">{message}</p>
        <div className="mt-6">
          <button type="button" className="btn-primary" onClick={restart}>
            Retake check
          </button>
        </div>
      </div>
    );
  }

  const q = qs[idx];
  const answered = picked !== null;

  function pick(pos: number) {
    if (answered) return;
    setPicked(pos);
    if (pos === q.correctPos) setScore((s) => s + 1);
  }

  function next() {
    if (idx < qs.length - 1) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      setDone(true);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
      <AnnotatedXray imageKey={q.imageKey} markers={[q.marker]} pulse hideCaption />

      <div className="flex min-h-[280px] flex-col">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>
            Question {idx + 1} of {qs.length}
          </span>
          <span>Score {score}</span>
        </div>

        <h3 className="mt-3 text-base text-ucla-900">{q.prompt}</h3>

        <div className="mt-3 space-y-2">
          {q.optOrder.map((origIdx, pos) => {
            const isCorrect = pos === q.correctPos;
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
                onClick={() => pick(pos)}
                className={[
                  'flex w-full items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-left text-sm font-medium transition-colors disabled:cursor-default',
                  cls,
                ].join(' ')}
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[11px]">
                  {String.fromCharCode(65 + pos)}
                </span>
                {q.options[origIdx]}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={[
              'mt-3 rounded-lg border px-3 py-2 text-sm',
              picked === q.correctPos
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-800',
            ].join(' ')}
          >
            <span className="font-semibold">
              {picked === q.correctPos ? 'Correct. ' : 'Not quite. '}
            </span>
            {q.explanation}
          </div>
        )}

        <div className="mt-auto flex justify-end pt-5">
          <button type="button" className="btn-primary" disabled={!answered} onClick={next}>
            {idx < qs.length - 1 ? 'Next' : 'See results'}
            <Icon name="arrow-right" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
