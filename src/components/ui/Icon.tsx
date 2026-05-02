import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export type IconName =
  | 'check'
  | 'check-circle'
  | 'circle'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'arrow-right'
  | 'play'
  | 'youtube'
  | 'search'
  | 'sparkles'
  | 'shield'
  | 'flag'
  | 'alert'
  | 'pediatric'
  | 'bone'
  | 'eye'
  | 'clipboard'
  | 'menu'
  | 'logout'
  | 'user'
  | 'image'
  | 'star'
  | 'lightning'
  | 'graduation'
  | 'lock'
  | 'book-open'
  | 'printer'
  | 'maximize'
  | 'x'
  | 'bar-chart'
  | 'clock';

const paths: Record<IconName, string> = {
  check: 'M5 12.5l4 4 10-10',
  'check-circle':
    'M9 12.5l2.4 2.4L15.5 11M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  circle: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  'chevron-right': 'm9 6 6 6-6 6',
  'chevron-left': 'm15 6-6 6 6 6',
  'chevron-down': 'm6 9 6 6 6-6',
  'arrow-right': 'M5 12h14m0 0-5-5m5 5-5 5',
  play: 'M8 5.5v13l11-6.5-11-6.5Z',
  youtube:
    'M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.5 12 4.5 12 4.5s-5.6 0-7.5.6A3 3 0 0 0 2.4 7.2C1.8 9.1 1.8 12 1.8 12s0 2.9.6 4.8a3 3 0 0 0 2.1 2.1c1.9.6 7.5.6 7.5.6s5.6 0 7.5-.6a3 3 0 0 0 2.1-2.1c.6-1.9.6-4.8.6-4.8s0-2.9-.6-4.8ZM10 15.3V8.7l5.7 3.3L10 15.3Z',
  search: 'M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z',
  sparkles:
    'M5 5v4M3 7h4M19 13v4m-2-2h4M12 3l1.7 4.6L18.3 9 13.7 10.7 12 15.3 10.3 10.7 5.7 9 10.3 7.6 12 3Z',
  shield:
    'M12 3 4 6v6c0 4.5 3.4 8.7 8 9 4.6-.3 8-4.5 8-9V6l-8-3Z',
  flag: 'M5 3v18m0-18 14 4-3 3 3 3-14 0',
  alert:
    'M12 9v4m0 4h.01M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z',
  pediatric:
    'M9 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-3 13c0-3.3 2.7-6 6-6s6 2.7 6 6',
  bone:
    'M7 10a3 3 0 1 1 0-3 3 3 0 0 1-1 1l8 8a3 3 0 1 1-1 1 3 3 0 0 1-1-1l-8-8a3 3 0 0 1 3 2Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  clipboard:
    'M9 4h6a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2V5a1 1 0 0 1 1-1Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  logout: 'M15 12H4m0 0 4-4m-4 4 4 4M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5',
  user:
    'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4 13a8 8 0 1 0-16 0',
  image:
    'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 13 5-5 4 4 3-3 5 4M9 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z',
  star: 'M12 3.5l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 17l-5.5 3.1 1.4-6.1-4.7-4.2 6.2-.6L12 3.5Z',
  lightning: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  graduation: 'M3 9l9-4 9 4-9 4-9-4Zm4 2v6c2 1.5 8 1.5 10 0v-6',
  lock:
    'M8 11V8a4 4 0 1 1 8 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z',
  'book-open':
    'M4 5.5c2.5 0 4.5.5 6 1.7V20c-1.5-1.2-3.5-1.7-6-1.7V5.5Zm16 0c-2.5 0-4.5.5-6 1.7V20c1.5-1.2 3.5-1.7 6-1.7V5.5ZM12 7.2V20',
  printer:
    'M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7v-7Z',
  maximize:
    'M8 3H3v5m13-5h5v5M8 21H3v-5m18 0v5h-5',
  x: 'M6 6l12 12M18 6 6 18',
  'bar-chart': 'M4 20V10m5 10V4m5 16v-7m5 7V8',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-5v5l3 2',
};

export function Icon({ name, size = 18, ...rest }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
