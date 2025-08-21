import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // These map to CSS custom properties defined in globals.css
        background: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        primary: 'oklch(var(--primary) / <alpha-value>)',
        secondary: 'oklch(var(--secondary) / <alpha-value>)',
        accent: 'oklch(var(--accent) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'var(--radius-4)',
        DEFAULT: 'var(--radius-8)',
        md: 'var(--radius-12)',
        lg: 'var(--radius-16)',
        full: '9999px',
      },
      boxShadow: {
        subtle: '0 1px 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)',
        soft: '0 4px 10px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)',
        glass: '0 10px 30px rgba(0,0,0,0.08)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        magnetic: {
          '0%': { transform: 'translate(0,0)' },
          '100%': { transform: 'translate(var(--magnet-x,0), var(--magnet-y,0))' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        float: 'float 3s ease-in-out infinite',
        magnetic: 'magnetic 150ms ease-out',
      },
      screens: {
        xs: '320px',
      },
    },
  },
  plugins: [],
} satisfies Config


