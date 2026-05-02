import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';
import type { QuizQuestionData } from '../types';

interface Props {
  question: QuizQuestionData;
  index: number;
  total: number;
  selectedOptionId?: string;
  showFeedback?: boolean;
  locked?: boolean;
  formative?: boolean;
  cheatSheetModuleId?: string;
  onSelect: (optionId: string) => void;
}

export function QuizQuestion({
  question,
  index,
  total,
  selectedOptionId,
  showFeedback = false,
  locked = false,
  formative = false,
  cheatSheetModuleId,
  onSelect,
}: Props) {
  const [revealed, setRevealed] = useState(showFeedback);

  const isCorrect = (id: string) => id === question.correctOptionId;
  const isSelected = (id: string) => id === selectedOptionId;

  return (
    <article className="card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
          Question {index + 1} of {total}
        </div>
        <div className="pill">{question.domain.replace('-', ' ')}</div>
      </div>
      <h3 className="mt-2 text-lg sm:text-xl text-balance text-slate-900">
        {question.prompt}
      </h3>
      <fieldset disabled={locked} className="mt-4 grid gap-2">
        {question.options.map((opt) => {
          const selected = isSelected(opt.id);
          const reveal = revealed || showFeedback;
          const correct = isCorrect(opt.id);
          let cls =
            'flex w-full items-start gap-3 rounded-xl border bg-white px-4 py-3 text-left text-sm transition-colors';
          if (reveal) {
            if (correct) cls += ' border-emerald-300 bg-emerald-50/60';
            else if (selected && !correct) cls += ' border-rose-300 bg-rose-50/60';
            else cls += ' border-slate-200';
          } else {
            cls += selected
              ? ' border-ucla-500 bg-ucla-50/60'
              : ' border-slate-200 hover:border-slate-300';
          }
          return (
            <button
              key={opt.id}
              type="button"
              className={cls}
              onClick={() => onSelect(opt.id)}
              aria-pressed={selected}
            >
              <span
                className={[
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                  reveal && correct
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : reveal && selected && !correct
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : selected
                        ? 'border-ucla-700 bg-ucla-700 text-white'
                        : 'border-slate-300 bg-white text-slate-500',
                ].join(' ')}
              >
                {reveal && correct ? (
                  <Icon name="check" size={12} />
                ) : (
                  opt.id.toUpperCase()
                )}
              </span>
              <span className="text-slate-800 leading-snug">{opt.text}</span>
            </button>
          );
        })}
      </fieldset>

      {formative && !showFeedback && !revealed && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setRevealed(true)}
            disabled={!selectedOptionId}
          >
            Show explanation
          </button>
        </div>
      )}

      {(revealed || showFeedback) && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-ucla-700">
            Explanation
          </div>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed">
            {question.explanation}
          </p>
          {question.whyOthersWrong && Object.keys(question.whyOthersWrong).length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {Object.entries(question.whyOthersWrong).map(([id, txt]) => (
                <li key={id}>
                  <span className="font-semibold uppercase mr-1.5 text-slate-500">
                    {id}:
                  </span>
                  {txt}
                </li>
              ))}
            </ul>
          )}
          {cheatSheetModuleId && (
            <Link
              to={`/modules/${cheatSheetModuleId}/cheatsheet`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ucla-700 no-underline hover:text-ucla-900"
            >
              <Icon name="printer" size={13} />
              Open related cheat sheet
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
