import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Professional Black Theme - Soft blacks with subtle contrast
        ink: {
          950: '#0a0a0a',  // Slightly lighter than pure black
          900: '#111111',  // Base black surface
          850: '#161616',  // Card surface variant
          800: '#1A1A1A',  // Card surface
          700: '#222222',  // Highlight stroke / borders
          600: '#2a2a2a',
          500: '#3a3a3a',
        },
        slate: {
          50: '#EDEDED',   // Text primary (soft white)
          100: '#d4d4d4',
          200: '#A1A1A1',  // Text secondary
          300: '#8a8a8a',
          400: '#6b6b6b',
        },
        blue: {
          500: '#4D7CFE',  // Accent blue
          400: '#5ea3ff',
          300: '#7cc4ff',
          200: '#badeff',
        },
        danger: '#ff6b81',
        success: '#3dd598',
      },
      fontFamily: {
        sans: ['Inter','Poppins',...defaultTheme.fontFamily.sans],
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '12px',
        lg: '18px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 6px 30px rgba(7, 11, 25, 0.55)',
        'card-hover': '0 12px 40px rgba(77, 201, 255, 0.25)',
        glow: '0 0 20px rgba(77, 201, 255, 0.45)',
      },
      transitionDuration: {
        200: '200ms',
        250: '250ms',
        300: '300ms',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px', // Ultrawide support
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2.5rem',
          xl: '3rem',
          '2xl': '4rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
};