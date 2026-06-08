import { useState } from 'react';
import { AnatomyGuidedTour } from './AnatomyGuidedTour';
import { AnatomyKnowledgeCheck } from './AnatomyKnowledgeCheck';
import { MarkerAdjuster } from './MarkerAdjuster';
import { Icon, type IconName } from '../ui/Icon';
import { trainerLabels, type ModuleTrainerData } from '../../data/anatomyTrainer';

type Mode = 'learn' | 'test' | 'adjust';

interface Props {
  moduleId: string;
  data: ModuleTrainerData;
  isAdmin?: boolean;
  onCheckComplete?: (score: number, total: number) => void;
}

// The interactive "master the normal anatomy" workstation: learn the labeled
// structures, then get tested by identifying markers on the films.
export function ModuleTrainer({ moduleId, data, isAdmin = false, onCheckComplete }: Props) {
  const [mode, setMode] = useState<Mode>('learn');
  const [lastScore, setLastScore] = useState<{ score: number; total: number } | null>(null);
  const labels = trainerLabels(moduleId);

  const tabs: { id: Mode; label: string; icon: IconName; step?: number; admin?: boolean }[] = [
    { id: 'learn', label: labels.learnTab, icon: 'book-open', step: 1 },
    { id: 'test', label: 'Test yourself', icon: 'clipboard', step: 2 },
    { id: 'adjust', label: 'Adjust markers', icon: 'image', admin: true },
  ];

  function handleCheckComplete(score: number, total: number) {
    setLastScore({ score, total });
    onCheckComplete?.(score, total);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-ucla-800">First learn</span> the labeled structures,
        then <span className="font-semibold text-ucla-800">test yourself</span> with the labels
        hidden.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {tabs
          .filter((t) => !t.admin || isAdmin)
          .map((t) => {
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id)}
                aria-pressed={active}
                className={[
                  'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
                  active
                    ? 'border-ucla-600 bg-ucla-600 text-white shadow-soft'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-ucla-300 hover:text-ucla-900',
                ].join(' ')}
              >
                {t.step ? (
                  <span
                    className={[
                      'flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold',
                      active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500',
                    ].join(' ')}
                  >
                    {t.step}
                  </span>
                ) : (
                  <Icon name={t.icon} size={15} />
                )}
                {t.label}
              </button>
            );
          })}

        {lastScore && (
          <span
            className={[
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
              lastScore.score / lastScore.total >= 0.7
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-900',
            ].join(' ')}
          >
            <Icon name="check-circle" size={13} />
            Anatomy check: {lastScore.score}/{lastScore.total}
          </span>
        )}
      </div>

      {mode === 'learn' && (
        <div className="animate-fade-in">
          <p className="mb-3 text-sm text-slate-600">{labels.learnIntro}</p>
          <AnatomyGuidedTour steps={data.tour} onDone={() => setMode('test')} />
        </div>
      )}

      {mode === 'test' && (
        <div className="animate-fade-in">
          <p className="mb-3 text-sm text-slate-600">{labels.testIntro}</p>
          <AnatomyKnowledgeCheck items={data.check} onComplete={handleCheckComplete} />
        </div>
      )}

      {mode === 'adjust' && isAdmin && (
        <div className="animate-fade-in">
          <MarkerAdjuster moduleId={moduleId} data={data} />
        </div>
      )}
    </div>
  );
}
