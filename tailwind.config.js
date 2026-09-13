/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monster Gym Modern Fintech Reference Palette
        mg: {
          blue: '#1A3EEA',        // Vibrant royal electric blue (image accent)
          blueHover: '#1534D8',   // Deeper royal blue for hover/active states
          sky: '#EBF1FF',         // Soft sky blue for badges and active pills
          canvas: '#F4F6F9',      // Clean off-white background canvas
          card: '#FFFFFF',        // Pure white elevated card surface
          dark: '#0F172A',        // Deep dark slate/charcoal primary text
          muted: '#64748B',       // Muted slate gray secondary text
          subtle: '#94A3B8',      // Subtle placeholders, captions, light borders
          border: '#E9ECEF',      // Crisp 1px card divider border
          black: '#111827',       // Circular action buttons and dark badges
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      boxShadow: {
        'apple-card': '0 2px 12px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03)',
        'apple-modal': '0 24px 48px -12px rgba(15, 23, 42, 0.14)',
        'apple-nav': '0 -4px 20px 0 rgba(15, 23, 42, 0.04)',
        'glow-blue': '0 4px 20px -2px rgba(26, 62, 234, 0.35)',
      },
      aspectRatio: {
        'card': '1.586',
      },
    },
  },
  plugins: [],
}
