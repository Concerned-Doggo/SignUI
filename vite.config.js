import Inspect from 'vite-plugin-inspect'
import { resolve } from 'path'

export default {
    plugins: [Inspect()],
    build:{
        rollupOptions: {
            input: {
                main: resolve(__dirname + '/index.html'),
                learn : resolve(__dirname + '/LearnPages/A-F.html'),
            }
        }
    }
}
