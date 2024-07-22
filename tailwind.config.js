/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.html",
    "./main.js",
    "./LearnPages/Learn.{js,html}",
    "./QuizPages/Quiz.{js,html}",
    "./src/**/*.{js,html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
