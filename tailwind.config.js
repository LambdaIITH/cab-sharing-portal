const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      "5x": "500px",
      "4.3x": "430px",
      "4x": "400px",
      "4.1x": "410px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        "primary-dark": "#1C2128",
        "secondary-dark": "#2D333B",
        "cabshare-red": "#932B77",
        "secondary-pink": "#9b59b6",
        "secondary-blue": "#4E1184",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "winter", "halloween"],
  },
};
