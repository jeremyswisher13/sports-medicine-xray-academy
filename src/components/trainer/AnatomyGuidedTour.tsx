import { useEffect, useState } from 'react';
import { AnnotatedXray } from './AnnotatedXray';
import { Icon } from '../ui/Icon';
import type { TrainerTourStep } from '../../data/anatomyTrainer';

interface Props {
  steps: TrainerTourStep[];
  onReachEnd?: () => void;
}

// Stepped, labeled walkthrough of the normal structures on the films.
export function AnatomyGuidedTour({ steps, onReachEnd }: Props) {
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [steps]);

  useEffect(() => {
    if (steps.length && i >= steps.length - 1) onReachEnd?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, steps]);

  if (!steps.length) return null;
  const step = steps[Math.min(i, steps.length - 1)];
  const atEnd = i >= steps.length - 1;

  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
      <AnnotatedXray
        imageKey={step.imageKey}
        markers={step.markers}
        showLabels
        pulse
      />

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

        <h3 className="mt-3 text-lg text-ucla-900">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.note}</p>

        <div className="mt-auto flex items-center gap-2 pt-6">
          <button
            type="button"
            className="btn-secondary"
            disabled={i === 0}
            onClick={() => setI((n) => Math.max(0, n - 1))}
          >
            <Icon name="chevron-left" size={14} />
            Back
          </button>
          {!atEnd ? (
            <button type="button" className="btn-primary" onClick={() => setI((n) => n + 1)}>
              Next
              <Icon name="arrow-right" size={14} />
            </button>
          ) : (
            <button type="button" className="btn-secondary" onClick={() => setI(0)}>
              Restart tour
            </button>
          )}
          <span className="ml-auto flex flex-wrap gap-1">
            {steps.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Go to step ${n + 1}`}
                onClick={() => setI(n)}
                className={[
                  'h-2 w-2 rounded-full transition-colors',
                  n === i ? 'bg-ucla-600' : 'bg-slate-300 hover:bg-slate-400',
                ].join(' ')}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
