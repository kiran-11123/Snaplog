const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', ...defaultTheme.fontFamily.sans],
        geist : ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        inter: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        geistMono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],

      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
