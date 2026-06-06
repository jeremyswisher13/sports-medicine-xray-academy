import { useState } from 'react';
import { Icon } from './ui/Icon';

interface Props {
  youtubeId: string;
  title: string;
}

export function YouTubeEmbed({ youtubeId, title }: Props) {
  const [active, setActive] = useState(false);

  if (!youtubeId) {
    return (
      <div className="aspect-video w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Video unavailable.
      </div>
    );
  }

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        aria-label={`Play ${title}`}
      >
        <img
          src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-ucla-900 shadow-elevated transition-transform group-hover:scale-105">
            <Icon name="play" size={20} />
          </span>
        </span>
        <span className="absolute bottom-2 left-3 right-3 line-clamp-1 text-left text-sm font-medium text-white">
          {title}
        </span>
      </button>
    );
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
      title={title}
      className="aspect-video w-full rounded-2xl border border-slate-200 shadow-sm"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
