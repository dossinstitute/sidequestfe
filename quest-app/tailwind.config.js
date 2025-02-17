/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Include the src/app directory
    './components/**/*.{js,ts,jsx,tsx}', // (if you add any files in ./components)
  ],
  safelist: [
    'rounded-full',
    'shadow-md',
    'text-center',
    'bg-black',
  ], //PurgeCSS Removing Classes for Leaderboard Component
  theme: {
    extend: {
      colors: {
        customBackground: '#0B3D4D',  // The dark teal color in your mockup
      },
    },
  },
  plugins: [],
}

