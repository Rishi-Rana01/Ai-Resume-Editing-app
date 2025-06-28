module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      colors: {
        primary: '#1e293b',
        accent: '#38bdf8',
      },
    },
  },
  plugins: [],
}
