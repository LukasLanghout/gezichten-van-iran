import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Warm paper tones
        background: '#F8F5F0',
        paper: '#FDFBF7',
        sand: '#EFE7DA',
        clay: '#E3D5C3',
        // Ink
        charcoal: '#1C1C1C',
        ink: '#2A2A28',
        // Accents
        terracotta: '#C0503A',
        'terracotta-dark': '#A23E2B',
        'terracotta-light': '#D9745F',
        saffron: '#D89B4A',
        pine: '#3C5A4E',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,28,28,0.04), 0 8px 24px -12px rgba(28,28,28,0.18)',
        'card-hover': '0 4px 8px rgba(28,28,28,0.06), 0 20px 40px -16px rgba(28,28,28,0.28)',
        soft: '0 10px 40px -20px rgba(28,28,28,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}
export default config
