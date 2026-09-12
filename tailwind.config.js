/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crm: {
          base: '#0B0E14',
          surface: '#141923',
          card: '#181F2C',
          elevated: '#1F2737',
          border: '#222B3D',
          borderLight: '#2F3B52',
          emerald: '#10B981',
          'emerald-glow': 'rgba(16, 185, 129, 0.25)',
          amber: '#F59E0B',
          'amber-glow': 'rgba(245, 158, 11, 0.25)',
          crimson: '#EF4444',
          'crimson-glow': 'rgba(239, 68, 68, 0.25)',
          text: '#F9FAFB',
          textMuted: '#9CA3AF',
          textSubtle: '#64748B',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-crimson': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'floating-nav': '0 -8px 32px 0 rgba(0, 0, 0, 0.45)',
        'gleb-card': '0 20px 40px -15px rgba(0, 0, 0, 0.65)',
        'gleb-emerald': '0 20px 40px -12px rgba(16, 185, 129, 0.3)',
        'gleb-amber': '0 20px 40px -12px rgba(245, 158, 11, 0.3)',
        'gleb-crimson': '0 20px 40px -12px rgba(239, 68, 68, 0.3)',
      },
      aspectRatio: {
        'card': '1.586',
      },
    },
  },
  plugins: [],
}
