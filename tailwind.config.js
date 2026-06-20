/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#08080A',
        surface: {
          DEFAULT: '#111115',
          2: '#18181D',
          3: '#222228',
        },
        accent: '#818CF8',
        'accent-hover': '#6366F1',
        'accent-dim': 'rgba(129,140,248,0.12)',
        positive: '#34D399',
        danger: '#F87171',
        warn: '#FBBF24',
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
      },
      keyframes: {
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.96)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
      },
    },
  },
  plugins: [],
}
