/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1e',
          800: '#0d1526',
          700: '#111d36',
          600: '#162244',
        },
        slate: {
          panel: '#1a2744',
          border: '#2a3a5c',
        },
        cyan: {
          accent: '#00d4ff',
          dim: '#0ea5c5',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
