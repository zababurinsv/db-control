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
        input: './src/database/ipfs/dist/index.min.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ipfs/dist/esm/index.min.js',
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

gulp.task('sync--cids-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/cids/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/cids/dist/index.js',
    });
});

gulp.task('sync--multihashes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/multihashes/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/multihashes/dist/index.js',
    });
});

gulp.task('sync--multibase-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/multibase/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/multibase/dist/index.js',
    });
});

gulp.task('sync--multicodec-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/multicodec/dist/index.min.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/multicodec/dist/esm/index.min.js',
    });
});

gulp.task('sync--orbit-db-identity-provider-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-identity-provider/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-identity-provider/dist/index.js',
    });
});

gulp.task('sync--orbit-db-keystore-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-keystore/src/keystore.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-keystore/dist/esm/orbit-db-keystore.min.js',
    });
});

gulp.task('sync--orbit-db-storage-adapter-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-storage-adapter/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-storage-adapter/dist/index.js',
    });
});

gulp.task('sync--orbit-db-store-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-store/src/Store.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-store/dist/Store.js',
    });
});

gulp.task('sync--level-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/level/browser.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level/dist/browser.js',
    });
});

gulp.task('sync--levelup-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/levelup/lib/levelup.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/levelup/dist/levelup.js',
    });
});

gulp.task('sync--object.assign-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/object.assign/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/object.assign/dist/index.js',
    });
});

gulp.task('sync--object-keys-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/object-keys/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/object-keys/dist/index.js',
    });
});


gulp.task('sync--assert-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/assert/assert.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/assert/dist/assert.js',
    });
});

gulp.task('sync--util-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/util/util.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/util/dist/index.js',
    });
});

gulp.task('sync--deferred-leveldown-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/deferred-leveldown/deferred-leveldown.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/deferred-leveldown/dist/index.js',
    });
});

gulp.task('sync--level-js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/level-js/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level-js/dist/index.js',
    });
});

gulp.task('sync--ltgt-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/ltgt/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ltgt/dist/index.js',
    });
});

gulp.task('sync--level-packager-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/level-packager/level-packager.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level-packager/dist/level-packager.js',
    });
});

gulp.task('sync--encoding-down-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/encoding-down/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/encoding-down/dist/index.js',
    });
});

gulp.task('sync--level-codec-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/level-codec/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level-codec/dist/index.js',
    });
});

gulp.task('sync--libp2p-crypto-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/libp2p-crypto/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/libp2p-crypto/dist/index.js',
    });
});

gulp.task('sync--node-forge-all-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/forge.all.esm.js',
    });
});


gulp.task('sync--protobufjs-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/protobufjs/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/protobufjs/dist/index.js',
    });
});


gulp.task('sync--uint8arrays-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/index.js',
    });
});


gulp.task('sync--iso-random-stream-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/iso-random-stream/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/iso-random-stream/dist/index.js',
    });
});


gulp.task('sync--pem-jwk-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/pem-jwk/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/pem-jwk/dist/pem-jwk.js',
    });
});

gulp.task('sync--asn1.js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/asn1.js/lib/asn1.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/asn1.js/dist/asn1.js',
    });
});

gulp.task('sync--multihashing-async-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/multihashing-async/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/multihashing-async/dist/index.js',
    });
});

gulp.task('sync--js-sha3-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/js-sha3/src/sha3.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/js-sha3/dist/index.js',
    });
});

gulp.task('sync--murmurhash3js-revisited-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/murmurhash3js-revisited/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/murmurhash3js-revisited/dist/index.js',
    });
});

gulp.task('sync--blakejs-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/blakejs/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/blakejs/dist/index.js',
    });
});


gulp.task('sync--orbit-db-access-controllers-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-access-controllers/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-access-controllers/dist/index.js',
    });
});

gulp.task('sync--readable-stream-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/readable-stream/readable.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/readable-stream/dist/index.js',
    });
});

gulp.task('sync--core-util-is-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/core-util-is/lib/util.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/core-util-is/dist/index.js',
    });
});

gulp.task('sync--fetch-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/fetch/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/fetch/dist/index.js',
    });
});

gulp.task('sync--abstract-leveldown-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/abstract-leveldown/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/abstract-leveldown/dist/index.js',
    });
});

gulp.task('sync--orbit-db-cache-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-cache/src/Cache.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-cache/dist/Cache.js',
    });
});

gulp.task('sync--orbit-db-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db/src/OrbitDB.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db/dist/OrbitDB.js',
    });
});

gulp.task('watch',  () => {
    gulp.watch([`.${pkg.config.gulp.scope}/**/*.scss`], gulp.series('scss'))
    gulp.watch([`.${pkg.config.gulp.scope}/**/*`], gulp.series('build'))
});

gulp.task('default', gulp.series('scss','build',  'watch'))
gulp.task('ipfs', gulp.series('sync--ipfs--build-module'))
gulp.task('libp2p-crypto', gulp.series('sync--libp2p-crypto--build-module'))
gulp.task('level', gulp.series('sync--level-module'))
gulp.task('levelup', gulp.series('sync--levelup-module'))
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

gulp.task('cids', gulp.series('sync--cids-module'))

gulp.task('ethers', gulp.series('sync--ethers-module'))

gulp.task('multihashes', gulp.series('sync--multihashes-module'))

gulp.task('multibase', gulp.series('sync--multibase-module'))

gulp.task('multicodec', gulp.series('sync--multicodec-module'))

gulp.task('orbit-db-identity-provider', gulp.series('sync--orbit-db-identity-provider-module'))

gulp.task('orbit-db-keystore', gulp.series('sync--orbit-db-keystore-module'))

gulp.task('orbit-db-storage-adapter', gulp.series('sync--orbit-db-storage-adapter-module'))

gulp.task('orbit-db-store', gulp.series('sync--orbit-db-store-module'))


gulp.task('object-keys', gulp.series('sync--object-keys-module'))

gulp.task('object.assign', gulp.series('sync--object.assign-module'))

gulp.task('assert', gulp.series('sync--assert-module'))

gulp.task('util', gulp.series('sync--util-module'))


gulp.task('deferred-leveldown', gulp.series('sync--deferred-leveldown-module'))

gulp.task('level-js', gulp.series('sync--level-js-module'))

gulp.task('ltgt', gulp.series('sync--ltgt-module'))

gulp.task('level-packager', gulp.series('sync--level-packager-module'))
gulp.task('encoding-down', gulp.series('sync--encoding-down-module'))

gulp.task('level-codec', gulp.series('sync--level-codec-module'))

gulp.task('libp2p-crypto', gulp.series('sync--libp2p-crypto-module'))
gulp.task('node-forge-all', gulp.series('sync--node-forge-all-module'))

gulp.task('protobufjs', gulp.series('sync--protobufjs-module'))

gulp.task('uint8arrays', gulp.series('sync--uint8arrays-module'))

gulp.task('iso-random-stream', gulp.series('sync--iso-random-stream-module'))


gulp.task('pem-jwk', gulp.series('sync--pem-jwk-module'))

gulp.task('asn1.js', gulp.series('sync--asn1.js-module'))

gulp.task('multihashing-async', gulp.series('sync--multihashing-async-module'))

gulp.task('js-sha3', gulp.series('sync--js-sha3-module'))

gulp.task('murmurhash3js-revisited', gulp.series('sync--murmurhash3js-revisited-module'))
gulp.task('blakejs', gulp.series('sync--blakejs-module'))
gulp.task('orbit-db-access-controllers', gulp.series('sync--orbit-db-access-controllers-module'))
gulp.task('readable-stream', gulp.series('sync--readable-stream-module'))
gulp.task('core-util-is', gulp.series('sync--core-util-is-module'))
gulp.task('fetch', gulp.series('sync--fetch-module'))
gulp.task('abstract-leveldown', gulp.series('sync--abstract-leveldown-module'))
gulp.task('orbit-db-cache', gulp.series('sync--orbit-db-cache-module'))
