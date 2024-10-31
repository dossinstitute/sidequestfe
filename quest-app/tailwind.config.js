/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Include the src/app directory
    './pages/**/*.{js,ts,jsx,tsx}',   // (if you add any files in ./pages)
    './components/**/*.{js,ts,jsx,tsx}', // (if you add any files in ./components)
  ],
  theme: {
    extend: {
      colors: {
        customBackground: '#0B3D4D',  // The dark teal color in your mockup
      },
    },
  },
  plugins: [],
}

