/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./App/Components/**/*.{js,jsx,ts,tsx}",
    "./App/Screens/**/*.{js,jsx,ts,tsx}",
    "./App/Navigation/**/*.{js,jsx,ts,tsx}",
    "./App/Navigation/CustomBottomTabBar.{js,jsx,ts,tsx}",
    "./App/Navigation/TabNavigation.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
