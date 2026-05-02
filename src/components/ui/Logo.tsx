interface Props {
  size?: number;
  variant?: 'navy' | 'white';
}

export function Logo({ size = 36, variant = 'navy' }: Props) {
  const fg = variant === 'white' ? '#FFFFFF' : '#003B5C';
  const accent = '#FFD100';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sports Medicine X-Ray Academy logo"
    >
      <rect width="64" height="64" rx="14" fill={fg} />
      <path d="M16 18h32v3H16zM16 43h32v3H16z" fill={accent} />
      <rect x="22" y="24" width="20" height="16" rx="2" stroke="#FFFFFF" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="3.4" fill="#FFFFFF" />
      <path d="M28 30l8 4M28 34l8-4" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}
