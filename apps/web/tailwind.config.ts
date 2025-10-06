import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // Primary Colors
        'sunset-orange': {
          DEFAULT: '#FA8B47',
          50: '#FFF4ED',
          100: '#FFE5D6',
          200: '#FFCFAD',
          300: '#FFB07A',
          400: '#FA8B47',
          500: '#F77020',
          600: '#E85A16',
          700: '#C04515',
          800: '#973819',
          900: '#7A3118',
        },
        'warm-cream': '#FEF5EC',
        'chocolate-brown': {
          DEFAULT: '#3D2817',
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#E7DFD1',
          300: '#CFC1A8',
          400: '#A8937A',
          500: '#78665A',
          600: '#57534E',
          700: '#3D2817',
          800: '#2E1F14',
          900: '#1C1208',
        },
        'coral-peach': '#FA9F6E',
        'light-peach': '#FFD7C4',

        // Warm Grays
        'warm-gray': {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },

        // Semantic Colors
        success: {
          light: '#D4F4DD',
          DEFAULT: '#4CAF50',
          dark: '#2E7D32',
        },
        warning: {
          light: '#FFF4E5',
          DEFAULT: '#FF9800',
          dark: '#E65100',
        },
        error: {
          light: '#FFEBEE',
          DEFAULT: '#F44336',
          dark: '#C62828',
        },
        info: {
          light: '#E3F2FD',
          DEFAULT: '#2196F3',
          dark: '#1565C0',
        },

        // Weather-Specific Colors
        'temp-cold': '#5B9BD5',
        'temp-cool': '#70AD47',
        'temp-ideal': '#FFC000',
        'temp-warm': '#FA8B47',
        'temp-hot': '#C00000',

        // Shadcn compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25' }],
        sm: ['0.875rem', { lineHeight: '1.375' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.375' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1.25' }],
        '6xl': ['3.75rem', { lineHeight: '1.25' }],
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px 0 rgba(61, 40, 23, 0.1), 0 1px 2px -1px rgba(61, 40, 23, 0.1)',
        'DEFAULT': '0 4px 6px -1px rgba(61, 40, 23, 0.1), 0 2px 4px -2px rgba(61, 40, 23, 0.1)',
        'md': '0 10px 15px -3px rgba(61, 40, 23, 0.1), 0 4px 6px -4px rgba(61, 40, 23, 0.1)',
        'lg': '0 20px 25px -5px rgba(61, 40, 23, 0.1), 0 8px 10px -6px rgba(61, 40, 23, 0.1)',
        'focus': '0 0 0 3px rgba(250, 139, 71, 0.5)',
      },
      transitionDuration: {
        'fast': '150ms',
        'DEFAULT': '200ms',
        'medium': '300ms',
        'slow': '500ms',
        'slower': '700ms',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        fadeOut: {
          from: {
            opacity: '1',
            transform: 'scale(1)',
          },
          to: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
        },
        spin: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
