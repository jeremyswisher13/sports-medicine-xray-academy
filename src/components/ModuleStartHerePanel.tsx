import { Link } from 'react-router-dom';
import type { ModuleContent, XRayImageEntry } from '../types';
import { XRayImage } from './XRayImage';
import { Icon } from './ui/Icon';

interface Props {
  module: ModuleContent;
  heroImage?: XRayImageEntry | null;
  onReviewImages: () => void;
  onStartGuidedRead: () => void;
}

export function ModuleStartHerePanel({
  module,
  heroImage,
  onReviewImages,
  onStartGuidedRead,
}: Props) {
  const learningGoals =
    module.overview.length > 0
      ? module.overview.slice(0, 3)
      : module.keyTakeaways.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-2xl border border-ucla-100 bg-white/95 shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-5 sm:p-6">
          <div className="section-title">Start here</div>
          <h2 className="mt-1 max-w-2xl text-2xl text-ucla-950 sm:text-3xl">
            One guided pass before the details.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Start with the normal-first read, then unlock the deeper checklist, recall cards,
            anatomy, and escalation points.
          </p>

          {learningGoals.length > 0 && (
            <ol className="mt-5 grid gap-2">
              {learningGoals.map((goal, index) => (
                <li
                  key={goal}
                  className="flex items-start gap-3 rounded-xl border border-ucla-100 bg-ucla-50/70 px-3 py-2.5 text-sm leading-relaxed text-slate-700"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ucla-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{goal}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={onStartGuidedRead}>
              Start guided read
              <Icon name="arrow-right" size={14} />
            </button>
            <button type="button" className="btn-secondary" onClick={onReviewImages}>
              Normal images
              <Icon name="image" size={14} />
            </button>
            <Link to={`/modules/${module.id}/cheatsheet`} className="btn-ghost no-underline">
              Cheat sheet
              <Icon name="printer" size={14} />
            </Link>
          </div>
        </div>

        {heroImage && (
          <aside className="border-t border-ucla-100 bg-slate-950 p-3 lg:border-l lg:border-t-0">
            <XRayImage entry={heroImage} className="h-full min-h-[220px]" />
          </aside>
        )}
      </div>
    </section>
  );
}
