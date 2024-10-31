export default config;

// For CommonJS (postcss.config.js):
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// For ES Modules (postcss.config.mjs):
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

