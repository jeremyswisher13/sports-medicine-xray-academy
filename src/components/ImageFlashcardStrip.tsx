import { useEffect, useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import type { XRayImageEntry } from '../types';

interface ImageFlashcardStripProps {
  images: XRayImageEntry[];
  maxCards?: number;
  title?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}

const DEFAULT_IMAGE_CARD_COUNT = 3;

export function ImageFlashcardStrip({
  images,
  maxCards = DEFAULT_IMAGE_CARD_COUNT,
  title = 'Image flashcards',
  eyebrow = 'Normal-first reps',
  description = 'Make the call before reading the caption. Start with view and normal-versus-pathology.',
  className = '',
}: ImageFlashcardStripProps) {
  const [revealedIds, setRevealedIds] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );

  const cards = useMemo(
    () => images.filter((image) => !image.isDiagram).slice(0, maxCards),
    [images, maxCards],
  );

  useEffect(() => {
    setRevealedIds(new Set<string>());
  }, [images, maxCards]);

  function toggle(imageId: string) {
    setRevealedIds((current) => {
      const next = new Set(current);
      if (next.has(imageId)) next.delete(imageId);
      else next.add(imageId);
      return next;
    });
  }

  if (cards.length === 0) return null;

  return (
    <section className={['space-y-3', className].filter(Boolean).join(' ')}>
      <div>
        <div className="section-title">{eyebrow}</div>
        <h2 className="mt-1 text-xl text-ucla-900 sm:text-2xl">{title}</h2>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((image, index) => {
          const revealed = revealedIds.has(image.id);
          const answer = image.isNormal ? 'Normal anatomy' : 'Pathology';
          const clue = image.caption ?? image.alt;
          return (
            <article
              key={image.id}
              className="overflow-hidden rounded-xl border border-ucla-100 bg-white/95 shadow-soft"
            >
              <button
                type="button"
                onClick={() => toggle(image.id)}
                className="block w-full text-left"
                aria-expanded={revealed}
              >
                <div className="relative aspect-[4/3] bg-slate-950">
                  <img
                    src={image.src}
                    alt="Radiograph flashcard"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                  <div className="absolute left-2 top-2 rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ucla-900 shadow-soft">
                    Image {index + 1}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 rounded-xl border border-ucla-100 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft">
                    {revealed ? `${answer} · ${image.view}` : 'Call: view + normal/pathology'}
                  </div>
                </div>

                <div className="p-4">
                  {revealed ? (
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            'pill',
                            image.isNormal
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                              : 'border-rose-100 bg-rose-50 text-rose-800',
                          ].join(' ')}
                        >
                          <Icon
                            name={image.isNormal ? 'check-circle' : 'alert'}
                            size={13}
                          />
                          {answer}
                        </span>
                        <span className="pill">{image.view}</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-relaxed text-ucla-950">
                        {clue}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-ucla-900">
                        <Icon name="eye" size={15} />
                        Commit before reveal
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Name the projection, decide normal versus pathology, then tap to reveal.
                      </p>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-ucla-700">
                    <span>{revealed ? 'Tap to hide answer' : 'Tap to reveal answer'}</span>
                    <Icon name={revealed ? 'chevron-left' : 'chevron-right'} size={14} />
                  </div>
                </div>
              </button>
              <div className="border-t border-ucla-100 bg-ucla-50/60 px-4 py-2 text-[11px] leading-relaxed text-slate-500">
                {image.attribution ?? image.source ?? 'Open-license teaching image'}
                {image.license ? ` · ${image.license}` : ''}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
