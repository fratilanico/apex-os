export default {
  content: ['./index.html', './*.tsx', './components/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        emerald: {
          400: '#10b981',
          500: '#059669',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '5%': { opacity: '0.95' },
          '10%': { opacity: '0.9' },
          '15%': { opacity: '0.95' },
          '20%': { opacity: '0.98' },
          '25%': { opacity: '0.95' },
          '30%': { opacity: '0.9' },
          '35%': { opacity: '0.95' },
          '40%': { opacity: '0.98' },
          '45%': { opacity: '1' },
          '50%': { opacity: '0.95' },
          '55%': { opacity: '0.98' },
          '60%': { opacity: '0.95' },
          '65%': { opacity: '0.9' },
          '70%': { opacity: '0.95' },
          '75%': { opacity: '0.98' },
          '80%': { opacity: '0.95' },
          '85%': { opacity: '1' },
          '90%': { opacity: '0.95' },
          '95%': { opacity: '0.98' },
          '100%': { opacity: '1' },
        },
        'terminal-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'text-glow': {
          '0%, 100%': { textShadow: '0 0 4px rgba(34, 211, 238, 0.4)' },
          '50%': { textShadow: '0 0 12px rgba(34, 211, 238, 0.6)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'terminal-blink': 'terminal-blink 0.8s step-end infinite',
        'text-glow': 'text-glow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
