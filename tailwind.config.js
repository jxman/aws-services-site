/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // AWS branding + modern dashboard aesthetics
        primary: {
          DEFAULT: '#FF9900',
          dark: '#EC7211',
          light: '#FFAC31',
        },
        // Dark mode colors
        bg: {
          primary: '#0F1419',
          secondary: '#1A1F2E',
          tertiary: '#232936',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
        },
        border: '#374151',
        // Light mode colors
        'bg-light': {
          primary: '#F9FAFB',
          secondary: '#FFFFFF',
          tertiary: '#F3F4F6',
        },
        'text-light': {
          primary: '#111827',
          secondary: '#6B7280',
        },
        'border-light': '#E5E7EB',
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'xs': '0.5rem',   // 8px
        'sm': '0.75rem',  // 12px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        '2xl': '3rem',    // 48px
      },
    },
  },
  plugins: [],
}
