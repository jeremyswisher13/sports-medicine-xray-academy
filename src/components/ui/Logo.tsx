interface Props {
  size?: number;
  variant?: 'navy' | 'white';
  className?: string;
}

interface WordmarkProps {
  height?: number;
  variant?: 'navy' | 'white';
  className?: string;
}

const logoSources: Record<NonNullable<Props['variant']>, string> = {
  navy: '/brand/mark-color.svg',
  white: '/brand/mark-color-on-dark.svg',
};

const wordmarkSources: Record<NonNullable<WordmarkProps['variant']>, string> = {
  navy: '/brand/wordmark-color.png',
  white: '/brand/wordmark-on-dark.png',
};

export function Logo({ size = 36, variant = 'navy', className = '' }: Props) {
  return (
    <img
      src={logoSources[variant]}
      width={size}
      height={size}
      alt="Sports Medicine X-Ray Academy logo"
      className={['block shrink-0', className].filter(Boolean).join(' ')}
      decoding="async"
    />
  );
}

export function Wordmark({ height = 42, variant = 'navy', className = '' }: WordmarkProps) {
  return (
    <img
      src={wordmarkSources[variant]}
      width={Math.round(height * 4.6)}
      height={height}
      alt="Sports Medicine X-Ray Academy"
      className={['block h-auto shrink-0', className].filter(Boolean).join(' ')}
      decoding="async"
    />
  );
}
