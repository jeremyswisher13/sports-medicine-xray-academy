interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: Props) {
  return (
    <div
      className={[
        align === 'center' ? 'text-center mx-auto max-w-3xl' : '',
        className,
      ].join(' ')}
    >
      {eyebrow && <div className="section-title">{eyebrow}</div>}
      <h2 className="mt-2 text-balance">{title}</h2>
      {description && (
        <p className="mt-2 max-w-3xl text-slate-600 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
