import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import async from 'rollup-plugin-async';

export default {
    input: 'public/cms/src/index.js',
    output: {
        sourcemap: true,
        file: 'public/cms/bundle.js',
        format: 'iife',
        name: 'cms'        
    },
    plugins: [
        async(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
}