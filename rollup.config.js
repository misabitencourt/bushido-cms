import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import async from 'rollup-plugin-async';

export default {
    input: 'public/cms/src/index.js',
    output: {
        file: 'public/assets/bundle.js',
        format: 'iife',
        name: 'app'        
    },
    plugins: [
        async(),
        babel({
            exclude: 'node_modules/**'
        }),
        // uglify()
    ]
}