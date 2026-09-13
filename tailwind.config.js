/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monster Gym ColorHunt Apple Light Theme Palette
        mg: {
          sage: '#8B9A6E',        // Primary olive sage accent
          cream: '#F7F2EB',       // Primary warm canvas background
          almond: '#EAE2D6',      // Almond card border and warm surface
          gray: '#EEEEEE',        // Light gray controls and subtle fills
          card: '#FFFFFF',        // Pristine Apple card surface
          dark: '#1C221D',        // Deep forest charcoal primary text
          muted: '#5B675E',       // Muted slate taupe secondary text
          subtle: '#8E9A90',      // Soft tertiary text and placeholders
          border: '#EAE2D6',      // Hairline 1px border
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
        'apple-card': '0 2px 10px -2px rgba(28, 34, 29, 0.05), 0 1px 2px rgba(28, 34, 29, 0.03)',
        'apple-modal': '0 24px 48px -12px rgba(28, 34, 29, 0.14), 0 1px 4px rgba(28, 34, 29, 0.04)',
        'apple-nav': '0 -4px 24px 0 rgba(28, 34, 29, 0.06)',
        'glow-sage': '0 4px 16px -2px rgba(139, 154, 110, 0.35)',
      },
      aspectRatio: {
        'card': '1.586',
      },
    },
  },
  plugins: [],
}
