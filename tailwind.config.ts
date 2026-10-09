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
        // Coffee earthtones: latte cream backgrounds, espresso text, roasted-brown actions.
        // Text/background pairs are checked for >= 4.5:1 contrast.
        cream: '#F7F0E6', // page background (latte foam)
        surface: '#FFFCF7', // cards (warm white)
        sand: '#EDE1D0', // subtle fills, skeletons (oat milk)
        line: '#DCCBB5', // borders (parchment)
        ink: {
          DEFAULT: '#2A1D14', // primary text (espresso)
          muted: '#65574A', // secondary text (mocha)
        },
        brand: {
          DEFAULT: '#6B4A33', // coffee brown: primary buttons (white text on it)
          dark: '#472F1F', // hover / pressed, brand text (dark roast)
          soft: '#EADBC7', // tinted backgrounds (latte)
        },
        accent: {
          DEFAULT: '#C89A62', // caramel: highlights (dark text on it)
          soft: '#F3E3C9', // cream and honey
        },
        success: '#4C6B34', // olive
        danger: '#A33B2C', // terracotta
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
        // Body text: clean sans-serif for legibility.
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        // Headings: Fraunces (soft axis), a rounded, warm serif with a cafe-menu feel.
        display: ['"Fraunces Variable"', '"Fraunces"', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
      },
      fontSize: {
        // Type scale: [size, { lineHeight, fontWeight? }]
        caption: ['0.8125rem', { lineHeight: '1.15rem' }],
        body: ['1rem', { lineHeight: '1.5rem' }],
        lead: ['1.125rem', { lineHeight: '1.6rem' }],
        title: ['1.5rem', { lineHeight: '1.9rem', fontWeight: '600' }],
        display: ['2rem', { lineHeight: '2.4rem', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 2px 12px rgba(71, 47, 31, 0.10)',
        nav: '0 -2px 16px rgba(71, 47, 31, 0.10)',
      },
      ringColor: {
        focus: '#2B5C8A',
      },
    },
  },
  plugins: [],
}

export default config
