/** @type {import('tailwindcss').Config} */
// Brand tokens from "InnerVisio – Violet Keynote" guidelines. Plum family only, no indigo/blue/green/red accents.
export default {
  content: ['./index.html', './index.tsx', './App.tsx', './constants.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050308',          // Void Black
        primary: '#431F4D',             // Logo Plum
        secondary: '#A24DB8',           // Orchid Plum: main accent, buttons, glow
        plum: {
          black: '#1F0F29',             // cards, layers, dark gradients
          800: '#2A1434',               // glass interiors, panels
          dark: '#34193C',              // logo gradient start
          DEFAULT: '#431F4D',
          light: '#5B2769',             // logo gradient end
          500: '#7A3589',               // glow, outlines, hover surfaces
        },
        orchid: {
          DEFAULT: '#CF8CE8',
          plum: '#A24DB8',
          soft: '#C48BE0',              // highlighted text, icons, badges, links
          pink: '#D98BEA',              // link hover, gradient middle
          pale: '#F0D4F4',              // light highlight, glass top edge
        },
        magenta: '#E055F0',             // sporadic accent: dots, notifications
        rose: '#F2A6E8',
        ink: {
          DEFAULT: '#F1E6F2',           // primary text (Plum White)
          2: '#C4B2C8',                 // secondary text
          3: '#968499',                 // tertiary text, notes
        },
        glass: 'rgba(255, 255, 255, 0.06)',
        'glass-border': 'rgba(255, 255, 255, 0.16)',
        'glass-hover': 'rgba(162, 77, 184, 0.16)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      borderRadius: {
        card: '28px',
        'card-lg': '36px',
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift-slow': 'iv-drift 22s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
