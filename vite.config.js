import Inspect from 'vite-plugin-inspect'
import { resolve } from 'path'

export default {
    plugins: [Inspect()],
    build:{
        rollupOptions: {
            input: {
                main: resolve(__dirname + '/index.html'),
                learn: resolve(__dirname + '/learn.html'),
                quiz: resolve(__dirname + '/quiz.html'),
                aboutus: resolve(__dirname + '/aboutus.html'),
                attributions: resolve(__dirname + '/attributions.html'),
                feedback: resolve(__dirname + '/feedback.html'),
                workInProgress: resolve(__dirname + '/workInProgress.html'),
                
                // learn pages
                learnPage: resolve(__dirname + '/LearnPages/Learn.html'),

                // quiz
                quizPage: resolve(__dirname + '/QuizPages/Quiz.html'),

                //dictionary
                dictionary: resolve(__dirname + '/Dictionary/dictionary.html'),

            }
        },
        watch: {
            include: './Assets/**/*',
        }

    }
}
