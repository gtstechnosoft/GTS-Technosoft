/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gts: {
          navy: '#0B1B3D',
          darkest: '#061229',
          dark: '#0F244D',
          card: '#132B5E',
          purple: '#2B1B81',
          'purple-dark': '#1C115C',
          'purple-light': '#4937B3',
          orange: '#F58220',
          'orange-dark': '#D96A0B',
          'orange-light': '#FFA34D',
          blue: '#0070AD',
          'blue-dark': '#005382',
          'blue-light': '#00A3E0',
          cyan: '#00A3E0',
          border: '#E2E8F0',
          'border-dark': '#1E3A6E',
          surface: '#F8FAFC',
          muted: '#64748B',
          text: '#0F172A',
          'text-muted': '#475569'
        },
        brand: {
          darkest: '#061229',
          darker: '#0B1B3D',
          dark: '#0F244D',
          card: '#132B5E',
          border: '#E2E8F0',
          teal: '#0070AD',
          cyan: '#00A3E0',
          neon: '#F58220',
          accent: '#2B1B81',
          emerald: '#10B981',
          warning: '#F58220',
          danger: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(11, 27, 61, 0.06), 0 2px 6px -1px rgba(11, 27, 61, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(11, 27, 61, 0.12), 0 4px 12px -2px rgba(11, 27, 61, 0.06)',
        'corporate': '0 20px 40px -15px rgba(11, 27, 61, 0.12)',
        'glow-orange': '0 0 25px -5px rgba(245, 130, 32, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(0, 112, 173, 0.35)',
        'glow-purple': '0 0 30px -5px rgba(43, 27, 129, 0.4)'
      }
    },
  },
  plugins: [],
}
