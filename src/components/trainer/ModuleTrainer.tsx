import { useState } from 'react';
import { AnatomyGuidedTour } from './AnatomyGuidedTour';
import { AnatomyKnowledgeCheck } from './AnatomyKnowledgeCheck';
import { MarkerAdjuster } from './MarkerAdjuster';
import { Icon, type IconName } from '../ui/Icon';
import type { ModuleTrainerData } from '../../data/anatomyTrainer';

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

  const tabs: { id: Mode; label: string; icon: IconName; admin?: boolean }[] = [
    { id: 'learn', label: 'Learn the normal', icon: 'book-open' },
    { id: 'test', label: 'Test yourself', icon: 'clipboard' },
    { id: 'adjust', label: 'Adjust markers', icon: 'image', admin: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs
          .filter((t) => !t.admin || isAdmin)
          .map((t) => {
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id)}
                className={[
                  'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
                  active
                    ? 'border-ucla-600 bg-ucla-600 text-white shadow-soft'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-ucla-300 hover:text-ucla-900',
                ].join(' ')}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            );
          })}
      </div>

      {mode === 'learn' && (
        <div className="animate-fade-in">
          <p className="mb-3 text-sm text-slate-600">
            Walk each labeled structure on the normal film. Master normal first — pathology is
            just a deviation from what you see here.
          </p>
          <AnatomyGuidedTour steps={data.tour} />
        </div>
      )}

      {mode === 'test' && (
        <div className="animate-fade-in">
          <p className="mb-3 text-sm text-slate-600">
            A marker lands on the film — name the structure. No labels this time.
          </p>
          <AnatomyKnowledgeCheck items={data.check} onComplete={onCheckComplete} />
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
