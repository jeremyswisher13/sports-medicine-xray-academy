import { useEffect, useRef, useState } from 'react';
import { AnnotatedXray } from './AnnotatedXray';
import { Icon } from '../ui/Icon';
import type { TrainerTourStep } from '../../data/anatomyTrainer';

interface Props {
  steps: TrainerTourStep[];
  /** Called when the learner chooses to move on from the tour (e.g. to the test). */
  onDone?: () => void;
}

// Stepped, labeled walkthrough of the normal structures on the films.
export function AnatomyGuidedTour({ steps, onDone }: Props) {
  const [i, setI] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => setI(0), [steps]);

  // On phones the film is tall and the controls sit below it; after navigating,
  // pull the new film back into view so the learner isn't left scrolled past it.
  function go(n: number) {
    setI(n);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      requestAnimationFrame(() =>
        rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      );
    }
  }

  if (!steps.length) return null;
  const step = steps[Math.min(i, steps.length - 1)];
  const atEnd = i >= steps.length - 1;

  return (
    <div ref={rootRef} className="grid scroll-mt-[120px] gap-5 lg:grid-cols-2 lg:items-start">
      <AnnotatedXray imageKey={step.imageKey} markers={step.markers} showLabels pulse />

      <div className="flex min-h-[280px] flex-col">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>
            Step {i + 1} of {steps.length}
          </span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
            <span
              className="block h-full rounded-full bg-ucla-600 transition-all"
              style={{ width: `${((i + 1) / steps.length) * 100}%` }}
            />
          </span>
        </div>

        {/* Announce the step to screen readers when it changes. */}
        <div aria-live="polite">
          <h3 className="mt-3 text-lg text-ucla-900">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.note}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <button
            type="button"
            className="btn-secondary"
            disabled={i === 0}
            onClick={() => go(Math.max(0, i - 1))}
          >
            <Icon name="chevron-left" size={14} />
            Back
          </button>
          {!atEnd ? (
            <button type="button" className="btn-primary" onClick={() => go(i + 1)}>
              Next
              <Icon name="arrow-right" size={14} />
            </button>
          ) : onDone ? (
            <button type="button" className="btn-primary" onClick={onDone}>
              Test yourself
              <Icon name="arrow-right" size={14} />
            </button>
          ) : (
            <button type="button" className="btn-secondary" onClick={() => go(0)}>
              Restart tour
            </button>
          )}
          {atEnd && onDone && (
            <button type="button" className="btn-secondary" onClick={() => go(0)}>
              Restart
            </button>
          )}
          <span className="ml-auto flex flex-wrap">
            {steps.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Go to step ${n + 1}`}
                aria-current={n === i ? 'step' : undefined}
                onClick={() => go(n)}
                className="grid h-9 w-5 place-items-center"
              >
                <span
                  className={[
                    'h-2 w-2 rounded-full transition-colors',
                    n === i ? 'bg-ucla-600' : 'bg-slate-300 hover:bg-slate-400',
                  ].join(' ')}
                />
              </button>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
