const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      inter: "var(--font-inter)",
      poppins: "var(--font-poppins)",
      geistSans: "var(--font-geist-sans)",
      geistMono: "var(--font-geist-mono)",
    },
    },
  },
  plugins: [],
};
