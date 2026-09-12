/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monster Gym Strict Custom Palette
        mg: {
          sage: '#6c7674',
          mint: '#7fb6ac',
          slate: '#67758d',
          steel: '#9ba9c2',
          base: '#0c1012',
          surface: '#13191b',
          card: '#182023',
          elevated: '#1f282c',
          border: '#2a3639',
          borderLight: '#37464a',
        },
        crm: {
          base: '#0c1012',
          surface: '#13191b',
          card: '#182023',
          elevated: '#1f282c',
          border: '#2a3639',
          borderLight: '#37464a',
          emerald: '#7fb6ac',
          'emerald-glow': 'rgba(127, 182, 172, 0.25)',
          amber: '#9ba9c2',
          'amber-glow': 'rgba(155, 169, 194, 0.25)',
          crimson: '#67758d',
          'crimson-glow': 'rgba(103, 117, 141, 0.25)',
          text: '#9ba9c2',
          textMuted: '#67758d',
          textSubtle: '#6c7674',
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
        'glow-mint': '0 0 20px -3px rgba(127, 182, 172, 0.35)',
        'glow-steel': '0 0 20px -3px rgba(155, 169, 194, 0.35)',
        'glow-slate': '0 0 20px -3px rgba(103, 117, 141, 0.35)',
        'floating-nav': '0 -8px 32px 0 rgba(0, 0, 0, 0.55)',
      },
      aspectRatio: {
        'card': '1.586',
      },
    },
  },
  plugins: [],
}
