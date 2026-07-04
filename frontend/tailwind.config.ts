import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Corporate: slate-based light gray system
        primary: {
          DEFAULT: '#1a56db',
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1a56db',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#0ea5e9',
          50:  '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        // UI surfaces — light gray corporate
        surface: {
          50:  '#f8f9fb',
          100: '#f1f3f6',
          200: '#e8ebf0',
          300: '#d5d9e0',
          400: '#b0b7c3',
          500: '#8892a4',
          600: '#636c7e',
          700: '#434b5c',
          800: '#2d3444',
          900: '#1a2030',
        },
        success: '#059669',
        warning: '#d97706',
        danger:  '#dc2626',
        info:    '#0284c7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 16px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        panel:      '0 0 0 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.07)',
      },
      animation: {
        'fade-in':   'fadeIn 0.25s ease-in-out',
        'slide-up':  'slideUp 0.25s ease-out',
        'slide-in':  'slideIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideIn: { '0%': { transform: 'translateX(-8px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
