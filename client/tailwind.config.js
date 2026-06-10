// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // class-based dark mode (always dark in our app)
  theme: {
    extend: {
      colors: {
        // Custom brand palette
        pink: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        // Additional glassmorphism-friendly neutrals
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        // Use system fonts for performance, or custom if loaded
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(236, 72, 153, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        // Subtle gradient for hero sections
        'hero-pattern': "linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.1) 100%)",
      },
    },
  },
  plugins: [
    // Add any additional plugins (e.g., forms, typography) if needed
  ],
};