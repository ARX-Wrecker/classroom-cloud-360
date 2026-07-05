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
        // Gris perla — sistema cromático principal
        primary: {
          DEFAULT: '#4A6FA5',
          50:  '#F5F7FA',
          100: '#EAF0F8',
          200: '#C8D8EE',
          300: '#A3BDE1',
          400: '#7BA0D0',
          500: '#5583BE',
          600: '#4A6FA5',
          700: '#3A5580',
          800: '#2A3E5E',
          900: '#1C2A40',
        },
        secondary: {
          DEFAULT: '#6B9E8A',
          50:  '#F2F8F5',
          100: '#E0F0EA',
          500: '#6B9E8A',
          600: '#537A6C',
          700: '#3E5C52',
        },
        // Gris perla — superficies UI
        surface: {
          50:  '#FAFAF8',
          100: '#F4F4F0',
          200: '#EAEAE4',
          300: '#D8D8D0',
          400: '#B8B8AE',
          500: '#94948C',
          600: '#6C6C64',
          700: '#484840',
          800: '#2E2E28',
          900: '#1A1A16',
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
