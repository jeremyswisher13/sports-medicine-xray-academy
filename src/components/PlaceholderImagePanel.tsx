import { Icon } from './ui/Icon';

type ViewKind =
  | 'AP'
  | 'Lateral'
  | 'Oblique'
  | 'Special'
  | 'Annotated'
  | 'Comparison';

interface Props {
  view?: ViewKind;
  caption?: string;
  className?: string;
}

const labelByView: Record<ViewKind, string> = {
  AP: 'AP view',
  Lateral: 'Lateral view',
  Oblique: 'Oblique view',
  Special: 'Special view',
  Annotated: 'Annotated image',
  Comparison: 'Normal comparison',
};

export function PlaceholderImagePanel({ view = 'AP', caption, className = '' }: Props) {
  return (
    <figure
      className={[
        'group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50',
        className,
      ].join(' ')}
      aria-label="Placeholder x-ray panel"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,23,42,0.06),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.04),transparent_55%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-soft">
          <Icon name="image" size={20} />
        </span>
        <span className="pill-primary">{labelByView[view]}</span>
        <p className="max-w-sm text-xs text-slate-500 leading-relaxed">
          Licensed teaching radiograph pending.
        </p>
      </div>
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-white/85 px-3 py-1.5 text-xs font-medium text-slate-600 backdrop-blur">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
