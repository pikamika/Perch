import type { Config } from 'tailwindcss'

/**
 * DESIGN TOKENS: tweak the look of the whole app from this one file.
 * Colors, radii, spacing, type scale and shadows are all defined here.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, food-friendly palette. Text pairs below are checked for >= 4.5:1 contrast.
        cream: '#FFF8F0', // page background
        surface: '#FFFFFF', // cards
        sand: '#F6EBDD', // subtle fills, skeletons
        line: '#E8D9C7', // borders
        ink: {
          DEFAULT: '#2B1A12', // primary text (espresso)
          muted: '#6B5448', // secondary text
        },
        brand: {
          DEFAULT: '#C8452B', // tomato: primary buttons (white text on it)
          dark: '#A53520', // hover / pressed
          soft: '#FBE3DB', // tinted backgrounds
        },
        accent: {
          DEFAULT: '#F2A93B', // saffron: highlights (dark text on it)
          soft: '#FDEFD2',
        },
        success: '#2F6B3F',
        danger: '#B3261E',
      },
      borderRadius: {
        chip: '0.75rem',
        card: '1.5rem',
        photo: '1.25rem',
      },
      spacing: {
        // Minimum touch target (44px)
        touch: '2.75rem',
        gutter: '1rem',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
      },
      fontSize: {
        // Type scale: [size, { lineHeight, fontWeight? }]
        caption: ['0.8125rem', { lineHeight: '1.15rem' }],
        body: ['1rem', { lineHeight: '1.5rem' }],
        lead: ['1.125rem', { lineHeight: '1.6rem' }],
        title: ['1.5rem', { lineHeight: '1.9rem', fontWeight: '700' }],
        display: ['2rem', { lineHeight: '2.4rem', fontWeight: '700' }],
      },
      boxShadow: {
        card: '0 2px 12px rgba(43, 26, 18, 0.08)',
        nav: '0 -2px 16px rgba(43, 26, 18, 0.08)',
      },
      ringColor: {
        focus: '#1F5FBF',
      },
    },
  },
  plugins: [],
}

export default config
