/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orbit: {
          bg: '#0A0F1A',
          card: '#111827',
          border: '#1F2937',
          accent: '#00D4FF',
          success: '#00FF84',
          warning: '#FACC15',
          danger: '#EF4444',
          muted: '#6B7280',
          hover: '#1E293B',
        },
      },
      fontFamily: {
        orbitron: ['Rajdhani', 'Outfit', 'Space Grotesk', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace', 'Courier New'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 212, 255, 0.25)',
        'green-glow': '0 0 15px rgba(0, 255, 132, 0.25)',
        'red-glow': '0 0 15px rgba(239, 68, 68, 0.25)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
