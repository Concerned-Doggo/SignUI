import Inspect from 'vite-plugin-inspect'
import { resolve } from 'path'

export default {
    plugins: [Inspect()],
    build:{
        rollupOptions: {
            input: {
                main: resolve(__dirname + '/index.html'),
                learn: resolve(__dirname + '/learn.html'),
                aboutus: resolve(__dirname + '/aboutus.html'),
                attributions: resolve(__dirname + '/attributions.html'),
                feedback: resolve(__dirname + '/feedback.html'),
                workInProgress: resolve(__dirname + '/workInProgress.html'),
                
                // learn pages
                alphabet: resolve(__dirname + '/LearnPages/alphabet.html'),
                number: resolve(__dirname + '/LearnPages/numbers.html'),
                learnPages1 : resolve(__dirname + '/LearnPages/A-F.html'),
                learnPages2 : resolve(__dirname + '/LearnPages/G-L.html'),
                learnPages3 : resolve(__dirname + '/LearnPages/M-R.html'),
                learnPages4 : resolve(__dirname + '/LearnPages/S-Z.html'),

                // quiz
                quiz: resolve(__dirname + '/Quiz/quiz.html'),
                quizPage1: resolve(__dirname + '/Quiz/A-F.html'),
                quizPage2: resolve(__dirname + '/Quiz/G-L.html'),
                quizPage3: resolve(__dirname + '/Quiz/M-R.html'),
                quizPage4: resolve(__dirname + '/Quiz/S-Z.html'),

                //dictionary
                dictionary: resolve(__dirname + '/Dictionary/dictionary.html'),

                
            }
        },
        watch: {
            include: './**'
        }

    }
}