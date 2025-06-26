/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Solo Leveling inspired color palette
        solo: {
          dark: '#0f0f23',
          darker: '#1a1a2e',
          navy: '#16213e',
          slate: '#1e293b',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          teal: '#06b6d4',
          gold: '#fbbf24',
          orange: '#f97316',
        },
        // Legacy cyberpunk colors (keeping for compatibility)
        cyberpunk: {
          primary: '#00ffff',
          secondary: '#ff00ff',
          accent: '#ffff00',
          dark: '#0a0a0a',
          gray: '#1a1a1a',
          light: '#2a2a2a',
        },
        // Quest rarity colors
        rarity: {
          common: '#6b7280',
          rare: '#3b82f6',
          epic: '#8b5cf6',
          legendary: '#fbbf24',
        },
        shadow: {
          aura: '#00ffff80',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyberpunk-grid': 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
        'solo-gradient': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        'neon-gradient': 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
        'power-gradient': 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
        'mesh-gradient': `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
        `,
      },
      fontFamily: {
        'fantasy': ['Orbitron', 'Rajdhani', 'sans-serif'],
        'ui': ['Rajdhani', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'level-up-burst': 'levelUpBurst 1.5s ease-out',
        'grid-move': 'gridMove 20s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'level-up': 'levelUp 0.8s ease-out',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(180deg)',
            opacity: '1'
          },
        },
        pulseGlow: {
          '0%, 100%': { 
            'box-shadow': '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)',
          },
          '50%': { 
            'box-shadow': '0 0 15px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.5)',
          },
        },
        levelUpBurst: {
          '0%': { 
            transform: 'scale(1) rotate(0deg)', 
            opacity: '1' 
          },
          '50%': { 
            transform: 'scale(1.5) rotate(180deg)', 
            opacity: '0.8' 
          },
          '100%': { 
            transform: 'scale(2) rotate(360deg)', 
            opacity: '0' 
          },
        },
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff' },
          '100%': { boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.1)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        }
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(147, 51, 234, 0.5)',
        'glow-teal': '0 0 20px rgba(6, 182, 212, 0.5)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'panel': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(59, 130, 246, 0.1)',
      },
    },
  },
  plugins: [],
} 