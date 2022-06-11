import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import cleaner from 'rollup-plugin-cleaner';
const extensions = ['.js','.mjs', '.ts', '.tsx'];
import { baseUrl } from 'rollup-plugin-base-url';

const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: "src/index.js",
    output: {
        file: "modules/index.mjs",
        format: "es",
        sourcemap: true,
    },
    plugins: [
        cleaner({
            targets: [
                './modules/'
            ]
        }),
        replace({
            preventAssignment: false,
            'process.env.NODE_ENV': JSON.stringify( 'development' )
        }),
        image(),
        json(),
        commonjs( {
            transformMixedEsModules: true,
            include: /node_modules/
        }),
        nodePolyfills(),
        nodeResolve({ preferBuiltins: true }),
        postcss({
            extensions: [".css"]
        }),
        babel({
            extensions,
            exclude: /node_modules/,
            babelrc: false,
            babelHelpers: 'runtime',
            presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
            ],
            plugins: [
                'react-require',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                ['@babel/plugin-proposal-object-rest-spread', {
                    useBuiltIns: true,
                }],
                ['@babel/plugin-transform-runtime', {
                    helpers: true,
                    regenerator: true,
                    useESModules: true,
                }]
            ],
        }),
    ]
};
