/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        overpass: ["'Overpass'", "sans-serif"],
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pingCustom': 'pingCustom 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        pingCustom: {
          '0%': {
            transform: 'scale(1)',
            opacity: '0.6',
          },
          '75%, 100%': {
            transform: 'scale(1.2)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
};
