/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js, html}",
    "./main.js",
        "./quiz.html",
    "./LearnPages/Learn.{js,html}",
        "./Dictionary/dictionary.{js,html}",
    "./QuizPages/Quiz.{js,html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
