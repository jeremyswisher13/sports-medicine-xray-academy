import { useId } from 'react';

interface Props {
  size?: number;
  variant?: 'navy' | 'white';
}

export function Logo({ size = 36, variant = 'navy' }: Props) {
  const id = useId().replace(/:/g, '');
  const isLight = variant === 'white';
  const plateId = `sxra-plate-${id}`;
  const glowId = `sxra-glow-${id}`;
  const beamId = `sxra-beam-${id}`;
  const filmFill = isLight ? '#F7FBFE' : '#0A4E75';
  const primary = isLight ? '#003B5C' : '#FFFFFF';
  const secondary = isLight ? '#005587' : '#CFE8F6';
  const border = isLight ? '#B8DDF2' : '#6BBBE8';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sports Medicine X-Ray Academy logo"
      className="block"
    >
      <defs>
        <linearGradient id={plateId} x1="7" y1="5" x2="58" y2="61" gradientUnits="userSpaceOnUse">
          <stop stopColor={isLight ? '#FFFFFF' : '#0072BC'} />
          <stop offset="0.52" stopColor={isLight ? '#EEF8FD' : '#005587'} />
          <stop offset="1" stopColor={isLight ? '#DDEFF8' : '#003B5C'} />
        </linearGradient>
        <radialGradient id={glowId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(45 17) rotate(129) scale(31 30)">
          <stop stopColor={isLight ? '#FFFFFF' : '#9DDBFF'} stopOpacity="0.82" />
          <stop offset="1" stopColor={isLight ? '#FFFFFF' : '#9DDBFF'} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={beamId} x1="20" y1="46" x2="47" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE680" />
          <stop offset="0.5" stopColor="#FFD100" />
          <stop offset="1" stopColor="#FFB81C" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${plateId})`} />
      <rect x="2.75" y="2.75" width="58.5" height="58.5" rx="17.25" stroke={border} strokeOpacity={isLight ? 0.9 : 0.55} strokeWidth="1.5" />
      <circle cx="45" cy="17" r="24" fill={`url(#${glowId})`} />

      <rect
        x="16.5"
        y="15.5"
        width="31"
        height="33"
        rx="6"
        fill={filmFill}
        fillOpacity={isLight ? 0.92 : 0.42}
        stroke={border}
        strokeWidth="1.4"
      />
      <path d="M14.5 20H49.5M14.5 44H49.5" stroke="#FFD100" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M22 22.5H42M22 41.5H42" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={isLight ? 0.72 : 0.62} />

      <path d="M19.5 45.5L44.5 20.5" stroke={`url(#${beamId})`} strokeWidth="4.1" strokeLinecap="round" />
      <path d="M19.5 19.5L44.5 44.5" stroke={primary} strokeWidth="2.9" strokeLinecap="round" strokeOpacity={isLight ? 0.9 : 0.82} />

      <circle cx="32" cy="32" r="8.8" fill={isLight ? '#FFFFFF' : '#F6FBFE'} />
      <circle cx="32" cy="32" r="8.8" stroke={secondary} strokeWidth="1.35" strokeOpacity={isLight ? 0.45 : 0.36} />
      <circle cx="32" cy="32" r="4.55" stroke={isLight ? '#003B5C' : '#005587'} strokeWidth="2" />
      <path d="M25.9 32H38.1" stroke="#FFD100" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 25.9V38.1" stroke={isLight ? '#9DCBE3' : '#B8DDF2'} strokeWidth="1.45" strokeLinecap="round" />
      <circle cx="32" cy="32" r="1.65" fill={isLight ? '#003B5C' : '#005587'} />
      <circle cx="23.2" cy="23.1" r="1.3" fill="#FFD100" />
      <circle cx="40.8" cy="40.9" r="1.3" fill="#FFD100" />
    </svg>
  );
}
