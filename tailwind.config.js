/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ucla: {
          // UCLA Health-inspired blue palette
          50: '#EEF4F9',
          100: '#D8E5EF',
          200: '#A8C2D7',
          300: '#7AA0BE',
          400: '#4F7FA5',
          500: '#2A5D85',
          600: '#1A4A6F',
          700: '#0E3855',
          800: '#003B5C', // primary navy
          900: '#002438',
          950: '#001825',
        },
        gold: {
          // Subtle UCLA gold accent
          50: '#FFFAEB',
          100: '#FFF1C2',
          200: '#FFE38A',
          300: '#FFD24F',
          400: '#FFC72C',
          500: '#FFD100', // primary gold
          600: '#D4AC00',
          700: '#A88800',
          800: '#7A6400',
          900: '#564800',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        card: '0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
        elevated: '0 12px 32px -8px rgba(15, 23, 42, 0.18), 0 4px 12px -4px rgba(15, 23, 42, 0.08)',
        focus: '0 0 0 3px rgba(255, 209, 0, 0.45)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      maxWidth: {
        prose: '68ch',
      },
      animation: {
        'fade-in': 'fadeIn 240ms ease-out',
        'slide-up': 'slideUp 280ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
