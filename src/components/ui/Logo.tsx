interface Props {
  size?: number;
  variant?: 'navy' | 'white';
}

export function Logo({ size = 36, variant = 'navy' }: Props) {
  const outer = variant === 'white' ? '#3A86C2' : '#2774AE';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sports Medicine X-Ray Academy logo"
      className="block"
    >
      <path
        d="M60 8 L102 22 L102 64 C102 88 84 104 60 114 C36 104 18 88 18 64 L18 22 Z"
        fill={outer}
      />
      <path
        d="M60 18 L94 28 L94 64 C94 84 80 96 60 104 C40 96 26 84 26 64 L26 28 Z"
        fill="#003B5C"
      />
      <g fill="#F4EFE6">
        <rect x="50" y="30" width="20" height="10" rx="3" />
        <rect x="48" y="44" width="24" height="10" rx="3" />
        <rect x="46" y="58" width="28" height="10" rx="3" />
        <rect x="48" y="72" width="24" height="10" rx="3" />
        <rect x="50" y="86" width="20" height="10" rx="3" />
      </g>
    </svg>
  );
}
