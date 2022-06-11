import gulp from 'gulp';
const require = createRequire(import.meta.url);
const pkg = require("./package.json");
import { createRequire } from "module";

import { exec } from 'child_process'
import autoprefixer from "gulp-autoprefixer";
import sass from "sass";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import * as rollup from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';

gulp.task('scss', function () {
    return gulp.src([`.${pkg.config.gulp.scope}/**/*.scss`])
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest(`.${pkg.config.gulp.scope}`));
});

gulp.task('build', (cb) => {
    exec('yarn parcel:module', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task('sync--ipfs--build-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/ipfs/dist/index.min.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/ipfs/index.mjs',
    });
});

gulp.task('sync--libp2p-crypto--build-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/libp2p-crypto/dist/index.min.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/libp2p-crypto/index.js',
    });
});

gulp.task('sync--browser-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/browser-level/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level/index.js',
    });
});

gulp.task('sync--level-transcoder-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/level-transcoder/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level-transcoder/index.js',
    });
});

gulp.task('sync--abstract-iterator-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/abstract-iterator/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/abstract-iterator/index.js',
    });
});

gulp.task('sync--abstract-error-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/abstract-error/lib/abstract-error.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/abstract-error/index.js',
    });
});

gulp.task('sync--inherits-ex-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/inherits-ex/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/inherits-ex/index.js',
    });
});

gulp.task('sync--abstract-level-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/abstract-level/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/abstract-level/index.js',
    });
});

gulp.task('sync--secp256k1-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/secp256k1/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/secp256k1/index.js',
    });
});

gulp.task('sync--elliptic-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/elliptic/lib/elliptic.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/elliptic/index.js',
    });
});

gulp.task('sync--node-gyp-build-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/node-gyp-build/index.js',
        plugins: [
            nodePolyfills(),
            nodeResolve({ preferBuiltins: true }),
            commonjs({
                transformMixedEsModules: true,
            }),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-gyp-build/index.js',
    });
});

gulp.task('sync--node-gyp-build-final-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-gyp-build/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-gyp-build/index_module.js',
    });
});

gulp.task('sync--bn.js-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/bn.js/lib/bn.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/bn.js/index.js',
    });
});

gulp.task('sync--hash.js-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/hash.js/lib/hash.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/hash.js/index.js',
    });
});


gulp.task('sync--ethers-module', async () => {
    const bundle = await rollup.rollup({
        input: './node_modules/hash.js/lib/hash.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ethers/index.js',
    });
});

gulp.task('watch',  () => {
    gulp.watch([`.${pkg.config.gulp.scope}/**/*.scss`], gulp.series('scss'))
    gulp.watch([`.${pkg.config.gulp.scope}/**/*`], gulp.series('build'))
});

gulp.task('default', gulp.series('scss','build',  'watch'))
gulp.task('ipfs', gulp.series('sync--ipfs--build-module'))
gulp.task('libp2p-crypto', gulp.series('sync--libp2p-crypto--build-module'))
gulp.task('level', gulp.series('sync--browser-module'))
gulp.task('level-transcoder', gulp.series('sync--level-transcoder-module'))
gulp.task('abstract-iterator', gulp.series('sync--abstract-iterator-module'))
gulp.task('abstract-error', gulp.series('sync--abstract-error-module'))
gulp.task('inherits-ex', gulp.series('sync--inherits-ex-module'))
gulp.task('abstract-level', gulp.series('sync--abstract-level-module'))
gulp.task('secp256k1', gulp.series('sync--secp256k1-module'))
gulp.task('elliptic', gulp.series('sync--elliptic-module'))
gulp.task('node-gyp-build', gulp.series('sync--node-gyp-build-module'))
gulp.task('node-gyp-build-f', gulp.series('sync--node-gyp-build-final-module'))
gulp.task('bn.js', gulp.series('sync--bn.js-module'))

gulp.task('hash.js', gulp.series('sync--hash.js-module'))


gulp.task('ethers', gulp.series('sync--ethers-module'))
