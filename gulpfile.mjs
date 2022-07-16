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
        file: './src/database/ipfs/dist/index.js',
    });
});

gulp.task('sync--libp2p-crypto--build-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/libp2p-crypto/dist/index.min.js',
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

gulp.task('sync--secp256k1-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/secp256k1/elliptic.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/secp256k1/dist/index.js',
    });
});

gulp.task('sync--elliptic-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/elliptic/lib/elliptic.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/elliptic/dist/index.js',
    });
});

gulp.task('sync--node-gyp-build-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-gyp-build/index.js',
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
        file: './src/database/node-gyp-build/dist/tmp/index.js',
    });
});

gulp.task('sync--node-gyp-build-final-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-gyp-build/dist/tmp/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-gyp-build/dist/index.js',
    });
});

gulp.task('sync--bn.js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/bn.js/lib/bn.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/bn.js/dist/index.js',
    });
});

gulp.task('sync--hash.js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/hash.js/lib/hash.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/hash.js/dist/index.js',
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
        file: './src/database/multicodec/dist/index.js',
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
        file: './src/database/orbit-db-keystore/dist/index.js',
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
        file: './src/database/orbit-db-store/dist/index.js',
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
        file: './src/database/level/dist/index.js',
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
        file: './src/database/levelup/dist/index.js',
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
        file: './src/database/level-packager/dist/index.js',
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
        file: './src/database/pem-jwk/dist/index.js',
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
        file: './src/database/asn1.js/dist/index.js',
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
        file: './src/database/orbit-db-cache/dist/index.js',
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
        file: './src/database/orbit-db/dist/index.js',
    });
});

gulp.task('sync--orbit-db-eventstore-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-eventstore/src/EventStore.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-eventstore/dist/index.js',
    });
});

gulp.task('sync--orbit-db-feedstore-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-feedstore/src/FeedStore.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-feedstore/dist/index.js',
    });
});

gulp.task('sync--lru-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/lru/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/lru/dist/index.js',
    });
});

gulp.task('sync--events-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/events/events.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/events/dist/index.js',
    });
});

gulp.task('sync--inherits-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/inherits/inherits_browser.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/inherits/dist/index.js',
    });
});

gulp.task('sync--orbit-db-io-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-io/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-io/dist/index.js',
    });
});

gulp.task('sync--ipld-dag-pb-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/ipld-dag-pb/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ipld-dag-pb/dist/index.js',
    });
});

gulp.task('sync--orbit-db-kvstore-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-kvstore/src/KeyValueStore.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-kvstore/dist/index.js',
    });
});

gulp.task('sync--orbit-db-counterstore-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-counterstore/src/CounterStore.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-counterstore/dist/index.js',
    });
});

gulp.task('sync--is-arguments-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-arguments/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-arguments/dist/index.js',
    });
});

gulp.task('sync--call-bind-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/call-bind/callBound.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/call-bind/dist/index.js',
    });
});

gulp.task('sync--get-intrinsic-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/get-intrinsic/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/get-intrinsic/dist/index.js',
    });
});

gulp.task('sync--has-symbols-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/has-symbols/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/has-symbols/dist/index.js',
    });
});

gulp.task('sync--function-bind-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/function-bind/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/function-bind/dist/index.js',
    });
});

gulp.task('sync--has-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/has/src/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/has/dist/index.js',
    });
});


gulp.task('sync--is-generator-function-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-generator-function/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-generator-function/dist/index.js',
    });
});

gulp.task('sync--which-typed-array-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/which-typed-array/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/which-typed-array/dist/index.js',
    });
});


gulp.task('sync--is-typed-array-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-typed-array/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-typed-array/dist/index.js',
    });
});


gulp.task('sync--foreach-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/foreach/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/foreach/dist/index.js',
    });
});


gulp.task('sync--available-typed-arrays-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/available-typed-arrays/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/available-typed-arrays/dist/index.js',
    });
});


gulp.task('sync--es-abstract-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/es-abstract/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/es-abstract/dist/index.js',
    });
});


gulp.task('sync--is-callable-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-callable/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-callable/dist/index.js',
    });
});


gulp.task('sync--es-to-primitive-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/es-to-primitive/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/es-to-primitive/dist/index.js',
    });
});


gulp.task('sync--is-date-object-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-date-object/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-date-object/dist/index.js',
    });
});


gulp.task('sync--is-symbol-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-symbol/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-symbol/dist/index.js',
    });
});


gulp.task('sync--orbit-db-docstore-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-docstore/src/DocumentStore.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-docstore/dist/index.js',
    });
});


gulp.task('sync--p-map-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-map/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-map/dist/index.js'
    });
});

gulp.task('sync--aggregate-error-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/aggregate-error/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/aggregate-error/dist/index.js'
    });
});

gulp.task('sync--indent-string-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/indent-string/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/indent-string/dist/index.js'
    });
});

gulp.task('sync--clean-stack-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/clean-stack/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/clean-stack/dist/index.js'
    });
});

gulp.task('sync--orbit-db-pubsub-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/orbit-db-pubsub/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/orbit-db-pubsub/dist/index.js'
    });
});

gulp.task('sync--p-series-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-series/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-series/dist/index.js'
    });
});

gulp.task('sync--p-reduce-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-reduce/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-reduce/dist/index.js'
    });
});

gulp.task('sync--@sindresorhus-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@sindresorhus/is/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@sindresorhus/dist/index.js'
    });
});

gulp.task('sync--url-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/url/url.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/url/dist/index.js'
    });
});

gulp.task('sync--punycode-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/punycode/punycode.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/punycode/dist/index.js'
    });
});

gulp.task('sync--querystring-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/querystring/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/querystring/dist/index.js'
    });
});

gulp.task('sync--ipfs-pubsub-peer-monitor-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/ipfs-pubsub-peer-monitor/src/ipfs-pubsub-peer-monitor.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ipfs-pubsub-peer-monitor/dist/index.js'
    });
});

gulp.task('sync--ipfs-pubsub-1on1-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/ipfs-pubsub-1on1/src/direct-channel.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ipfs-pubsub-1on1/dist/index.js'
    });
});

gulp.task('sync--safe-buffer-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/safe-buffer/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/safe-buffer/dist/index.js'
    });
});

gulp.task('sync--ipfs-log-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/ipfs-log/src/log.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ipfs-log/dist/index.js'
    });
});

gulp.task('sync--safer-buffer-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/safer-buffer/safer.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/safer-buffer/dist/index.js'
    });
});

gulp.task('sync--buffer-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/buffer/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/buffer/dist/index.js'
    });
});

gulp.task('sync--base64-js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/base64-js/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/base64-js/dist/index.js'
    });
});

gulp.task('sync--p-map-series-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-map-series/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-map-series/dist/index.js'
    });
});

gulp.task('sync--ieee754-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/ieee754/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ieee754/dist/index.js'
    });
});

gulp.task('sync--json-stringify-deterministic-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/json-stringify-deterministic/lib/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/json-stringify-deterministic/dist/index.js'
    });
});

gulp.task('sync--p-do-whilst-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-do-whilst/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-do-whilst/dist/index.js'
    });
});


gulp.task('sync--crypto-browserify-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crypto-browserify/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crypto-browserify/dist/index.js'
    });
});

gulp.task('sync--randombytes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/randombytes/browser.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/randombytes/dist/index.js'
    });
});

gulp.task('sync--create-hash-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/create-hash/browser.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/create-hash/dist/index.js'
    });
});

gulp.task('sync--create-hmac-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/create-hmac/browser.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/create-hmac/dist/index.js'
    });
});

gulp.task('sync--browserify-sign-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/browserify-sign/browser/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/browserify-sign/dist/index.js'
    });
});

gulp.task('sync--browserify-rsa-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/browserify-rsa/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/browserify-rsa/dist/index.js'
    });
});

gulp.task('sync--minimalistic-assert-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/minimalistic-assert/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/minimalistic-assert/dist/index.js'
    });
});

gulp.task('sync--minimalistic-crypto-utils-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/minimalistic-crypto-utils/lib/utils.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/minimalistic-crypto-utils/dist/index.js'
    });
});

gulp.task('sync--brorand-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/brorand/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/brorand/dist/index.js'
    });
});

gulp.task('sync--hmac-drbg-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/hmac-drbg/lib/hmac-drbg.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/hmac-drbg/dist/index.js'
    });
});

gulp.task('sync--parse-asn1-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/parse-asn1/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/parse-asn1/dist/index.js'
    });
});

gulp.task('sync--evp_bytestokey-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/evp_bytestokey/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/evp_bytestokey/dist/index.js'
    });
});

gulp.task('sync--md5.js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/md5.js/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/md5.js/dist/index.js'
    });
});

gulp.task('sync--hash-base-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/hash-base/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/hash-base/dist/index.js'
    });
});

gulp.task('sync--browserify-aes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/browserify-aes/browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/browserify-aes/dist/index.js'
    });
});

gulp.task('sync--pbkdf2-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/pbkdf2/browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/pbkdf2/dist/index.js'
    });
});

gulp.task('sync--browserify-cipher-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/browserify-cipher/browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/browserify-cipher/dist/index.js'
    });
});

gulp.task('sync--browserify-aes/modes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/browserify-aes/modes/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/browserify-aes/dist/modes.js'
    });
});

gulp.task('sync--browserify-des-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/browserify-des/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/browserify-des/dist/index.js'
    });
});

gulp.task('sync--browserify-des/modes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/browserify-des/modes.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/browserify-des/dist/modes.js'
    });
});

gulp.task('sync--cipher-base-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/cipher-base/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/cipher-base/dist/index.js'
    });
});

gulp.task('sync--stream-browserify-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/stream-browserify/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/stream-browserify/dist/index.js'
    });
});

gulp.task('sync--process-nextick-args-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/process-nextick-args/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/process-nextick-args/dist/index.js'
    });
});

gulp.task('sync--string_decoder-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/string_decoder/lib/string_decoder.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/string_decoder/dist/index.js'
    });
});

gulp.task('sync--des.js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/des.js/lib/des.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/des.js/dist/index.js'
    });
});

gulp.task('sync--isarray-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/isarray/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/isarray/dist/index.js'
    });
});

gulp.task('sync--util-deprecate-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/util-deprecate/browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/util-deprecate/dist/index.js'
    });
});

gulp.task('sync--define-properties-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/define-properties/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/define-properties/dist/index.js'
    });
});

gulp.task('sync--is-regex-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-regex/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-regex/dist/index.js'
    });
});

gulp.task('sync--object-inspect-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/object-inspect/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/object-inspect/dist/index.js'
    });
});

gulp.task('sync--is-string-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-string/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-string/dist/index.js'
    });
});

gulp.task('sync--is-negative-zero-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-negative-zero/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-negative-zero/dist/index.js'
    });
});

gulp.task('sync--unbox-primitive-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/unbox-primitive/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/unbox-primitive/dist/index.js'
    });
});

gulp.task('sync--which-boxed-primitive-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/which-boxed-primitive/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/which-boxed-primitive/dist/index.js'
    });
});

gulp.task('sync--is-number-object-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-number-object/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-number-object/dist/index.js'
    });
});

gulp.task('sync--is-boolean-object-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-boolean-object/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-boolean-object/dist/index.js'
    });
});

gulp.task('sync--is-bigint-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-bigint/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-bigint/dist/index.js'
    });
});

gulp.task('sync--string.prototype.trimstart-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/string.prototype.trimstart/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/string.prototype.trimstart/dist/index.js'
    });
});

gulp.task('sync--string.prototype.trimend-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/string.prototype.trimend/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/string.prototype.trimend/dist/index.js'
    });
});

gulp.task('sync--has-bigints-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/has-bigints/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/has-bigints/dist/index.js'
    });
});

gulp.task('sync--getOwnPropertyDescriptor-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/es-abstract/helpers/getOwnPropertyDescriptor.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/es-abstract/dist/getOwnPropertyDescriptor.js'
    });
});

gulp.task('sync--level-supports-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/level-supports/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level-supports/dist/index.js'
    });
});

gulp.task('sync--is-buffer-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-buffer/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-buffer/dist/index.js'
    });
});

gulp.task('sync--queue-microtask-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/queue-microtask/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/queue-microtask/dist/index.js'
    });
});

gulp.task('sync--level-iterator-stream-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/level-iterator-stream/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level-iterator-stream/dist/index.js'
    });
});

gulp.task('sync--level-errors-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/level-errors/errors.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level-errors/dist/index.js'
    });
});

gulp.task('sync--errno-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/errno/errno.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/errno/dist/index.js'
    });
});

gulp.task('sync--prr-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/prr/prr.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/prr/dist/index.js'
    });
});

gulp.task('sync--catering-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/catering/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/catering/dist/index.js'
    });
});

gulp.task('sync--assert-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/assert/assert.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/assert/dist/index.js'
    });
});


gulp.task('sync--object-assign-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/object-assign/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/object-assign/dist/index.js'
    });
});

gulp.task('sync--readable-stream/readable-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/readable-stream/readable-browser.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/readable-stream/dist/readable.js',
    });
});

gulp.task('sync--readable-stream/writable-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/readable-stream/writable-browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/readable-stream/dist/writable.js'
    });
});

gulp.task('sync--readable-stream/duplex-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/readable-stream/duplex-browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/readable-stream/dist/duplex.js'
    });
});

gulp.task('sync--passthrough-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/readable-stream/passthrough.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/readable-stream/dist/passthrough.js'
    });
});

gulp.task('sync--transform-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/readable-stream/transform.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/readable-stream/dist/transform.js'
    });
});

gulp.task('sync--uint8arrays/concat-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/concat.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/concat.js'
    });
});

gulp.task('sync--uint8arrays/to-string-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/to-string.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/to-string.js'
    });
});

gulp.task('sync--uint8arrays/equals-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/equals.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/equals.js'
    });
});

gulp.task('sync--uint8arrays/compare-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/compare.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/compare.js'
    });
});

gulp.task('sync--uint8arrays/xor-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/xor.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/xor.js'
    });
});

gulp.task('sync--uint8arrays/from-string-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/from-string.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/from-string.js'
    });
});

gulp.task('sync--uint8arrays/index-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/index.js'
    });
});

gulp.task('sync--@multiformats/base-x-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@multiformats/base-x/src/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@multiformats/dist/base-x.js'
    });
});

gulp.task('sync--varint-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/varint/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/varint/dist/index.js'
    });
});

gulp.task('sync--uint8arrays/from-string-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/uint8arrays/from-string.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/uint8arrays/dist/from-string.js'
    });
});

gulp.task('sync--ipld-dag-cbor-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/ipld-dag-cbor/src/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ipld-dag-cbor/dist/index.js'
    });
});

gulp.task('sync--@protobufjs/aspromise-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/aspromise/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/aspromise.js'
    });
});

gulp.task('sync--@protobufjs/base64-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/base64/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/base64.js'
    });
});

gulp.task('sync--@protobufjs/codegen-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/codegen/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/codegen.js'
    });
});

gulp.task('sync--@protobufjs/eventemitter-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/eventemitter/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/eventemitter.js'
    });
});

gulp.task('sync--@protobufjs/fetch-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/fetch/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/fetch.js'
    });
});

gulp.task('sync--@protobufjs/float-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/float/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/float.js'
    });
});

gulp.task('sync--@protobufjs/inquire-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/inquire/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/inquire.js'
    });
});

gulp.task('sync--@protobufjs/path-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/path/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/path.js'
    });
});

gulp.task('sync--@protobufjs/pool-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/pool/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/pool.js'
    });
});

gulp.task('sync--@protobufjs/utf8-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/@protobufjs/utf8/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/@protobufjs/dist/utf8.js'
    });
});

gulp.task('sync--protobufjs/minimal-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/protobufjs/minimal.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/protobufjs/dist/minimal.js',
    });
});


gulp.task('sync--stable-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/stable/stable.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/stable/dist/index.js',
    });
});

gulp.task('sync--err-code-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/err-code/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/err-code/dist/index.js',
    });
});

gulp.task('sync--keypair-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/keypair/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/keypair/dist/index.js',
    });
});

gulp.task('sync--node-forge/lib/index-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/index.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/index.js',
    });
});

gulp.task('sync--node-forge/lib/asn1-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/asn1.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/asn1.js',
    });
});

gulp.task('sync--node-forge/lib/pbe-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/pbe.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/pbe.js',
    });
});

gulp.task('sync--node-forge/lib/forge-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/forge.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/forge.js',
    });
});

gulp.task('sync--node-forge/lib/sha512-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/sha512.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/sha512.js',
    });
});

gulp.task('sync--node-forge/lib/ed25519-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/ed25519.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/ed25519.js',
    });
});

gulp.task('sync--node-forge/lib/rsa-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/rsa.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/rsa.js',
    });
});


gulp.task('sync--node-forge/lib/jsbn-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/jsbn.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/jsbn.js',
    });
});

gulp.task('sync--node-forge/lib/pbkdf2-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/pbkdf2.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/pbkdf2.js',
    });
});

gulp.task('sync--node-forge/lib/util-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/util.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/util.js',
    });
});

gulp.task('sync--node-forge/lib/asn1-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/asn1.js',
        plugins: [
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/asn1.js',
    });
});

gulp.task('sync--diffie-hellman-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/diffie-hellman/browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/diffie-hellman/dist/index.js',
    });
});

gulp.task('sync--miller-rabin-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/miller-rabin/lib/mr.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/miller-rabin/dist/index.js',
    });
});

gulp.task('sync--create-ecdh-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/create-ecdh/browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/create-ecdh/dist/index.js',
    });
});

gulp.task('sync--public-encrypt-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/public-encrypt/browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/public-encrypt/dist/index.js',
    });
});

gulp.task('sync--randomfill-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/randomfill/browser.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/randomfill/dist/index.js',
    });
});

gulp.task('sync--ripemd160-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/ripemd160/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/ripemd160/dist/index.js',
    });
});

gulp.task('sync--sha.js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/sha.js/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/sha.js/dist/index.js',
    });
});

gulp.task('sync--create-hash/md5-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/create-hash/md5.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/create-hash/dist/md5.js',
    });
});

gulp.task('sync--buffer-xor-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/buffer-xor/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/buffer-xor/dist/index.js',
    });
});

gulp.task('sync--node-forge/lib/aes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/node-forge/lib/aes.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/node-forge/dist/aes.js',
    });
});

gulp.task('sync--p-each-series-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-each-series/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-each-series/dist/index.js',
    });
});

gulp.task('sync--p-queue-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-queue/src/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-queue/dist/index.js',
    });
});

gulp.task('sync--eventemitter3-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/eventemitter3/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/eventemitter3/dist/index.js',
    });
});

gulp.task('sync--p-timeout-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-timeout/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-timeout/dist/index.js',
    });
});

gulp.task('sync--p-finally-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-finally/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-finally/dist/index.js',
    });
});

gulp.task('sync--p-finally-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/p-finally/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/p-finally/dist/index.js',
    });
});

gulp.task('sync--crdts/src/LWW-Set-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crdts/src/LWW-Set.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crdts/dist/LWW-Set.js',
    });
});

gulp.task('sync--crdts/src/OR-Set-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crdts/src/OR-Set.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crdts/dist/OR-Set.js',
    });
});

gulp.task('sync--crdts/src/2P-Set-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crdts/src/2P-Set.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crdts/dist/2P-Set.js',
    });
});

gulp.task('sync--crdts/src/G-Counter-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crdts/src/G-Counter.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crdts/dist/G-Counter.js',
    });
});

gulp.task('sync--crdts/src/G-Counter-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crdts/src/G-Counter.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crdts/dist/G-Counter.js',
    });
});

gulp.task('sync--crdts/src/G-Set-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crdts/src/G-Set.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crdts/dist/G-Set.js',
    });
});

gulp.task('sync--crdts/src/PN-Counter-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crdts/src/PN-Counter.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crdts/dist/PN-Counter.js',
    });
});

gulp.task('sync--crdts/src/CmRDT-Set-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/crdts/src/CmRDT-Set.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/crdts/dist/CmRDT-Set.js',
    });
});

gulp.task('sync--iso-random-stream/src/randomBytes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/iso-random-stream/src/random.browser.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/iso-random-stream/dist/randomBytes.js',
    });
});

gulp.task('sync--libp2p-crypto/src/hmac-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/libp2p-crypto/src/hmac/index-browser.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/libp2p-crypto/dist/hmac.js',
    });
});

gulp.task('sync--libp2p-crypto/src/aes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/libp2p-crypto/src/aes/index.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/libp2p-crypto/dist/aes.js',
    });
});

gulp.task('sync--libp2p-crypto/src/keys-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/libp2p-crypto/src/keys/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/libp2p-crypto/dist/keys.js',
    });
});

gulp.task('sync--libp2p-crypto/src/random-bytes-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/libp2p-crypto/src/random-bytes.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/libp2p-crypto/dist/random-bytes.js',
    });
});

gulp.task('sync--libp2p-crypto/src/pbkdf2-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/libp2p-crypto/src/pbkdf2.js',
        plugins: [
            nodeResolve(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/libp2p-crypto/dist/pbkdf2.js',
    });
});

gulp.task('sync--libp2p-crypto-secp256k1-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/libp2p-crypto-secp256k1/src/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/libp2p-crypto-secp256k1/dist/index.js',
    });
});

gulp.task('sync--bs58-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/bs58/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/bs58/dist/index.js',
    });
});

gulp.task('sync--base-x-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/base-x/src/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/base-x/dist/index.js',
    });
});

gulp.task('sync--async/setImmediate-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/async/setImmediate.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/async/dist/setImmediate.js',
    });
});

gulp.task('sync--murmurhash3js-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/murmurhash3js/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/murmurhash3js/dist/index.js',
    });
});

gulp.task('sync--nodeify-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/nodeify/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/nodeify/dist/index.js',
    });
});

gulp.task('sync--is-promise-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-promise/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-promise/dist/index.js',
    });
});

gulp.task('sync--promise-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/promise/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/promise/dist/index.js',
    });
});

gulp.task('sync--asap/asap-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/asap/asap.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/asap/dist/asap.js',
    });
});

gulp.task('sync--asap/raw-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/asap/raw.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/asap/dist/raw.js',
    });
});

gulp.task('sync--bip66-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/bip66/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/bip66/dist/index.js',
    });
});

gulp.task('sync--levelup/3.0.0/lib/levelup-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/levelup/3.0.0/lib/levelup.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/levelup/3.0.0/dist/index.js',
    });
});

gulp.task('sync--xtend-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/xtend/immutable.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/xtend/dist/index.js',
    });
});

gulp.task('sync--level-js/4.0.2/index-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/level-js/4.0.2/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/level-js/4.0.2/dist/index.js',
    });
});

gulp.task('sync--typedarray-to-buffer-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/typedarray-to-buffer/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/typedarray-to-buffer/dist/index.js',
    });
});

gulp.task('sync--immediate-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/immediate/lib/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/immediate/dist/index.js',
    });
});

gulp.task('sync--is-typedarray-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/is-typedarray/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/is-typedarray/dist/index.js',
    });
});

gulp.task('sync--p-map/1.1.1/index-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/p-map/1.1.1/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/p-map/1.1.1/dist/index.js',
    });
});

gulp.task('sync--ipld-dag-pb/0.20.0-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/ipld-dag-pb/0.20.0/src/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/ipld-dag-pb/0.20.0/dist/index.js',
    });
});

gulp.task('sync--class-is-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/class-is/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/class-is/dist/index.js',
    });
});


gulp.task('sync--protons-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/protons/src/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/protons/dist/index.js',
    });
});

gulp.task('sync--protocol-buffers-schema-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/protocol-buffers-schema/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/protocol-buffers-schema/dist/index.js',
    });
});

gulp.task('sync--signed-varint-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/signed-varint/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/signed-varint/dist/index.js',
    });
});

gulp.task('sync--multibase/4.0.4-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/multibase/4.0.4/src/index.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/multibase/4.0.4/dist/index.js',
    });
});

gulp.task('sync--web-encoding-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/web-encoding/src/lib.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/web-encoding/dist/index.js',
    });
});

gulp.task('sync--secp256k1/3.8.0-module', async () => {
    const bundle = await rollup.rollup({
        input: './src/database/modules/secp256k1/3.8.0/elliptic.js',
        plugins: [
            json(),
            commonjs(),
        ],
    });
    return await bundle.write({
        sourcemap: false,
        format: 'es',
        file: './src/database/modules/secp256k1/3.8.0/dist/index.js',
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
gulp.task('secp256k1', gulp.series('sync--secp256k1-module'))
gulp.task('elliptic', gulp.series('sync--elliptic-module'))
gulp.task('node-gyp-build', gulp.series('sync--node-gyp-build-module'))
gulp.task('node-gyp-build-f', gulp.series('sync--node-gyp-build-final-module'))
gulp.task('bn.js', gulp.series('sync--bn.js-module'))
gulp.task('hash.js', gulp.series('sync--hash.js-module'))
gulp.task('cids', gulp.series('sync--cids-module'))
gulp.task('multihashes', gulp.series('sync--multihashes-module'))
gulp.task('multibase', gulp.series('sync--multibase-module'))
gulp.task('multicodec', gulp.series('sync--multicodec-module'))
gulp.task('orbit-db-identity-provider', gulp.series('sync--orbit-db-identity-provider-module'))
gulp.task('orbit-db-keystore', gulp.series('sync--orbit-db-keystore-module'))
gulp.task('orbit-db-storage-adapter', gulp.series('sync--orbit-db-storage-adapter-module'))
gulp.task('orbit-db-store', gulp.series('sync--orbit-db-store-module'))
gulp.task('object-keys', gulp.series('sync--object-keys-module'))
gulp.task('object.assign', gulp.series('sync--object.assign-module'))
gulp.task('util', gulp.series('sync--util-module'))
gulp.task('deferred-leveldown', gulp.series('sync--deferred-leveldown-module'))
gulp.task('level-js', gulp.series('sync--level-js-module'))
gulp.task('ltgt', gulp.series('sync--ltgt-module'))
gulp.task('level-packager', gulp.series('sync--level-packager-module'))
gulp.task('encoding-down', gulp.series('sync--encoding-down-module'))
gulp.task('level-codec', gulp.series('sync--level-codec-module'))
gulp.task('libp2p-crypto', gulp.series('sync--libp2p-crypto-module'))
gulp.task('uint8arrays', gulp.series('sync--uint8arrays-module'))
gulp.task('iso-random-stream', gulp.series('sync--iso-random-stream-module'))
gulp.task('pem-jwk', gulp.series('sync--pem-jwk-module'))
gulp.task('asn1.js', gulp.series('sync--asn1.js-module'))
gulp.task('multihashing-async', gulp.series('sync--multihashing-async-module'))
gulp.task('murmurhash3js-revisited', gulp.series('sync--murmurhash3js-revisited-module'))
gulp.task('blakejs', gulp.series('sync--blakejs-module'))
gulp.task('orbit-db-access-controllers', gulp.series('sync--orbit-db-access-controllers-module'))
gulp.task('core-util-is', gulp.series('sync--core-util-is-module'))
gulp.task('fetch', gulp.series('sync--fetch-module'))
gulp.task('abstract-leveldown', gulp.series('sync--abstract-leveldown-module'))
gulp.task('orbit-db-cache', gulp.series('sync--orbit-db-cache-module'))
gulp.task('orbit-db', gulp.series('sync--orbit-db-module'))
gulp.task('orbit-db-eventstore', gulp.series('sync--orbit-db-eventstore-module'))
gulp.task('orbit-db-feedstore', gulp.series('sync--orbit-db-feedstore-module'))
gulp.task('lru', gulp.series('sync--lru-module'))
gulp.task('events', gulp.series('sync--events-module'))
gulp.task('inherits', gulp.series('sync--inherits-module'))
gulp.task('orbit-db-io', gulp.series('sync--orbit-db-io-module'))
gulp.task('orbit-db-kvstore', gulp.series('sync--orbit-db-kvstore-module'))
gulp.task('orbit-db-counterstore', gulp.series('sync--orbit-db-counterstore-module'))
gulp.task('is-arguments', gulp.series('sync--is-arguments-module'))
gulp.task('call-bind', gulp.series('sync--call-bind-module'))
gulp.task('get-intrinsic', gulp.series('sync--get-intrinsic-module'))
gulp.task('has-symbols', gulp.series('sync--has-symbols-module'))
gulp.task('function-bind', gulp.series('sync--function-bind-module'))
gulp.task('has', gulp.series('sync--has-module'))
gulp.task('is-generator-function', gulp.series('sync--is-generator-function-module'))
gulp.task('which-typed-array', gulp.series('sync--which-typed-array-module'))
gulp.task('is-typed-array', gulp.series('sync--is-typed-array-module'))
gulp.task('foreach', gulp.series('sync--foreach-module'))
gulp.task('available-typed-arrays', gulp.series('sync--available-typed-arrays-module'))
gulp.task('es-abstract', gulp.series('sync--es-abstract-module'))
gulp.task('is-callable', gulp.series('sync--is-callable-module'))
gulp.task('es-to-primitive', gulp.series('sync--es-to-primitive-module'))
gulp.task('is-date-object', gulp.series('sync--is-date-object-module'))
gulp.task('is-symbol', gulp.series('sync--is-symbol-module'))
gulp.task('orbit-db-docstore', gulp.series('sync--orbit-db-docstore-module'))
gulp.task('p-map', gulp.series('sync--p-map-module'))
gulp.task('aggregate-error', gulp.series('sync--aggregate-error-module'))
gulp.task('clean-stack', gulp.series('sync--clean-stack-module'))
gulp.task('indent-string', gulp.series('sync--indent-string-module'))
gulp.task('orbit-db-pubsub', gulp.series('sync--orbit-db-pubsub-module'))
gulp.task('p-series', gulp.series('sync--p-series-module'))
gulp.task('p-reduce', gulp.series('sync--p-reduce-module'))
gulp.task('@sindresorhus', gulp.series('sync--@sindresorhus-module'))
gulp.task('url', gulp.series('sync--url-module'))
gulp.task('punycode', gulp.series('sync--punycode-module'))
gulp.task('querystring', gulp.series('sync--querystring-module'))
gulp.task('ipfs-pubsub-peer-monitor', gulp.series('sync--ipfs-pubsub-peer-monitor-module'))
gulp.task('ipfs-pubsub-1on1', gulp.series('sync--ipfs-pubsub-1on1-module'))
gulp.task('safe-buffer', gulp.series('sync--safe-buffer-module'))
gulp.task('ipfs-log', gulp.series('sync--ipfs-log-module'))
gulp.task('safer-buffer', gulp.series('sync--safer-buffer-module'))
gulp.task('buffer', gulp.series('sync--buffer-module'))
gulp.task('base64-js', gulp.series('sync--base64-js-module'))
gulp.task('p-map-series', gulp.series('sync--p-map-series-module'))
gulp.task('ieee754', gulp.series('sync--ieee754-module'))
gulp.task('json-stringify-deterministic', gulp.series('sync--json-stringify-deterministic-module'))
gulp.task('p-do-whilst', gulp.series('sync--p-do-whilst-module'))
gulp.task('crypto-browserify', gulp.series('sync--crypto-browserify-module'))
gulp.task('randombytes', gulp.series('sync--randombytes-module'))
gulp.task('browserify-sign', gulp.series('sync--browserify-sign-module'))
gulp.task('browserify-rsa', gulp.series('sync--browserify-rsa-module'))
gulp.task('minimalistic-assert', gulp.series('sync--minimalistic-assert-module'))
gulp.task('minimalistic-crypto-utils', gulp.series('sync--minimalistic-crypto-utils-module'))
gulp.task('brorand', gulp.series('sync--brorand-module'))
gulp.task('hmac-drbg', gulp.series('sync--hmac-drbg-module'))
gulp.task('parse-asn1', gulp.series('sync--parse-asn1-module'))
gulp.task('evp_bytestokey', gulp.series('sync--evp_bytestokey-module'))
gulp.task('md5.js', gulp.series('sync--md5.js-module'))
gulp.task('hash-base', gulp.series('sync--hash-base-module'))
gulp.task('browserify-aes', gulp.series('sync--browserify-aes-module'))
gulp.task('pbkdf2', gulp.series('sync--pbkdf2-module'))
gulp.task('browserify-cipher', gulp.series('sync--browserify-cipher-module'))
gulp.task('browserify-des', gulp.series('sync--browserify-des-module'))
gulp.task('cipher-base', gulp.series('sync--cipher-base-module'))
gulp.task('stream-browserify', gulp.series('sync--stream-browserify-module'))
gulp.task('process-nextick-args', gulp.series('sync--process-nextick-args-module'))
gulp.task('string_decoder', gulp.series('sync--string_decoder-module'))
gulp.task('des.js', gulp.series('sync--des.js-module'))
gulp.task('isarray', gulp.series('sync--isarray-module'))
gulp.task('util-deprecate', gulp.series('sync--util-deprecate-module'))
gulp.task('define-properties', gulp.series('sync--define-properties-module'))
gulp.task('is-regex', gulp.series('sync--is-regex-module'))
gulp.task('object-inspect', gulp.series('sync--object-inspect-module'))
gulp.task('is-string', gulp.series('sync--is-string-module'))
gulp.task('is-negative-zero', gulp.series('sync--is-negative-zero-module'))
gulp.task('unbox-primitive', gulp.series('sync--unbox-primitive-module'))
gulp.task('which-boxed-primitive', gulp.series('sync--which-boxed-primitive-module'))
gulp.task('is-number-object', gulp.series('sync--is-number-object-module'))
gulp.task('is-boolean-object', gulp.series('sync--is-boolean-object-module'))
gulp.task('is-bigint', gulp.series('sync--is-bigint-module'))
gulp.task('string.prototype.trimstart', gulp.series('sync--string.prototype.trimstart-module'))
gulp.task('string.prototype.trimend', gulp.series('sync--string.prototype.trimend-module'))
gulp.task('has-bigints', gulp.series('sync--has-bigints-module'))
gulp.task('getOwnPropertyDescriptor', gulp.series('sync--getOwnPropertyDescriptor-module'))
gulp.task('level-supports', gulp.series('sync--level-supports-module'))
gulp.task('is-buffer', gulp.series('sync--is-buffer-module'))
gulp.task('queue-microtask', gulp.series('sync--queue-microtask-module'))
gulp.task('level-iterator-stream', gulp.series('sync--level-iterator-stream-module'))
gulp.task('level-errors', gulp.series('sync--level-errors-module'))
gulp.task('errno', gulp.series('sync--errno-module'))
gulp.task('prr', gulp.series('sync--prr-module'))
gulp.task('catering', gulp.series('sync--catering-module'))
gulp.task('assert', gulp.series('sync--assert-module'))
gulp.task('object-assign', gulp.series('sync--object-assign-module'))
gulp.task('passthrough', gulp.series('sync--passthrough-module'))
gulp.task('transform', gulp.series('sync--transform-module'))
gulp.task('readable-stream/writable', gulp.series('sync--readable-stream/writable-module'))
gulp.task('readable-stream/readable', gulp.series('sync--readable-stream/readable-module'))
gulp.task('readable-stream/duplex', gulp.series('sync--readable-stream/duplex-module'))
gulp.task('uint8arrays/concat', gulp.series('sync--uint8arrays/concat-module'))
gulp.task('uint8arrays/to-string', gulp.series('sync--uint8arrays/to-string-module'))
gulp.task('uint8arrays/equals', gulp.series('sync--uint8arrays/equals-module'))
gulp.task('uint8arrays/compare', gulp.series('sync--uint8arrays/compare-module'))
gulp.task('uint8arrays/xor', gulp.series('sync--uint8arrays/xor-module'))
gulp.task('uint8arrays/from-string', gulp.series('sync--uint8arrays/from-string-module'))
gulp.task('uint8arrays/index', gulp.series('sync--uint8arrays/index-module'))
gulp.task('@multiformats/base-x', gulp.series('sync--@multiformats/base-x-module'))
gulp.task('varint', gulp.series('sync--varint-module'))
gulp.task('uint8arrays/from-string', gulp.series('sync--uint8arrays/from-string-module'))
gulp.task('ipld-dag-pb', gulp.series('sync--ipld-dag-pb-module'))
gulp.task('ipld-dag-cbor', gulp.series('sync--ipld-dag-cbor-module'))
gulp.task('@protobufjs/aspromise', gulp.series('sync--@protobufjs/aspromise-module'))
gulp.task('@protobufjs/eventemitter', gulp.series('sync--@protobufjs/eventemitter-module'))
gulp.task('@protobufjs/fetch', gulp.series('sync--@protobufjs/fetch-module'))
gulp.task('@protobufjs/float', gulp.series('sync--@protobufjs/float-module'))
gulp.task('@protobufjs/inquire', gulp.series('sync--@protobufjs/inquire-module'))
gulp.task('@protobufjs/path', gulp.series('sync--@protobufjs/path-module'))
gulp.task('@protobufjs/pool', gulp.series('sync--@protobufjs/pool-module'))
gulp.task('@protobufjs/utf8', gulp.series('sync--@protobufjs/utf8-module'))
gulp.task('@protobufjs/codegen', gulp.series('sync--@protobufjs/codegen-module'))
gulp.task('@protobufjs/base64', gulp.series('sync--@protobufjs/base64-module'))
gulp.task('protobufjs/minimal', gulp.series('sync--protobufjs/minimal-module'))
gulp.task('stable', gulp.series('sync--stable-module'))
gulp.task('err-code', gulp.series('sync--err-code-module'))
gulp.task('js-sha3', gulp.series('sync--js-sha3-module'))
gulp.task('keypair', gulp.series('sync--keypair-module'))
gulp.task('node-forge/lib/index', gulp.series('sync--node-forge/lib/index-module'))
gulp.task('node-forge/lib/pbe', gulp.series('sync--node-forge/lib/pbe-module'))
gulp.task('node-forge/lib/sha512', gulp.series('sync--node-forge/lib/sha512-module'))
gulp.task('node-forge/lib/jsbn', gulp.series('sync--node-forge/lib/jsbn-module'))
gulp.task('node-forge/lib/rsa', gulp.series('sync--node-forge/lib/rsa-module'))
gulp.task('node-forge/lib/ed25519', gulp.series('sync--node-forge/lib/ed25519-module'))
gulp.task('node-forge/lib/forge', gulp.series('sync--node-forge/lib/forge-module'))
gulp.task('node-forge/lib/asn1', gulp.series('sync--node-forge/lib/asn1-module'))
gulp.task('node-forge/lib/pbkdf2', gulp.series('sync--node-forge/lib/pbkdf2-module'))
gulp.task('node-forge/lib/util', gulp.series('sync--node-forge/lib/util-module'))
gulp.task('node-forge/lib/asn1', gulp.series('sync--node-forge/lib/asn1-module'))
gulp.task('diffie-hellman', gulp.series('sync--diffie-hellman-module'))
gulp.task('miller-rabin', gulp.series('sync--miller-rabin-module'))
gulp.task('create-ecdh', gulp.series('sync--create-ecdh-module'))
gulp.task('public-encrypt', gulp.series('sync--public-encrypt-module'))
gulp.task('randomfill', gulp.series('sync--randomfill-module'))
gulp.task('ripemd160', gulp.series('sync--ripemd160-module'))
gulp.task('sha.js', gulp.series('sync--sha.js-module'))
gulp.task('create-hash', gulp.series('sync--create-hash-module'))
gulp.task('create-hmac', gulp.series('sync--create-hmac-module'))
gulp.task('create-hash/md5', gulp.series('sync--create-hash/md5-module'))
gulp.task('buffer-xor', gulp.series('sync--buffer-xor-module'))
gulp.task('browserify-aes/modes', gulp.series('sync--browserify-aes/modes-module'))
gulp.task('browserify-des/modes', gulp.series('sync--browserify-des/modes-module'))
gulp.task('node-forge/lib/aes', gulp.series('sync--node-forge/lib/aes-module'))
gulp.task('p-each-series', gulp.series('sync--p-each-series-module'))
gulp.task('p-queue', gulp.series('sync--p-queue-module'))
gulp.task('eventemitter3', gulp.series('sync--eventemitter3-module'))
gulp.task('p-timeout', gulp.series('sync--p-timeout-module'))
gulp.task('p-finally', gulp.series('sync--p-finally-module'))
gulp.task('crdts/src/LWW-Set', gulp.series('sync--crdts/src/LWW-Set-module'))
gulp.task('crdts/src/OR-Set', gulp.series('sync--crdts/src/OR-Set-module'))
gulp.task('crdts/src/2P-Set', gulp.series('sync--crdts/src/2P-Set-module'))
gulp.task('crdts/src/G-Counter', gulp.series('sync--crdts/src/G-Counter-module'))
gulp.task('crdts/src/G-Set', gulp.series('sync--crdts/src/G-Set-module'))
gulp.task('crdts/src/PN-Counter', gulp.series('sync--crdts/src/PN-Counter-module'))
gulp.task('crdts/src/CmRDT-Set', gulp.series('sync--crdts/src/CmRDT-Set-module'))
gulp.task('iso-random-stream/src/randomBytes', gulp.series('sync--iso-random-stream/src/randomBytes-module'))
gulp.task('libp2p-crypto/src/hmac', gulp.series('sync--libp2p-crypto/src/hmac-module'))
gulp.task('libp2p-crypto/src/aes', gulp.series('sync--libp2p-crypto/src/aes-module'))
gulp.task('libp2p-crypto/src/pbkdf2', gulp.series('sync--libp2p-crypto/src/pbkdf2-module'))
gulp.task('libp2p-crypto/src/random-bytes', gulp.series('sync--libp2p-crypto/src/random-bytes-module'))
gulp.task('libp2p-crypto/src/keys', gulp.series('sync--libp2p-crypto/src/keys-module'))
gulp.task('libp2p-crypto-secp256k1', gulp.series('sync--libp2p-crypto-secp256k1-module'))
gulp.task('bs58', gulp.series('sync--bs58-module'))
gulp.task('base-x', gulp.series('sync--base-x-module'))
gulp.task('async/setImmediate', gulp.series('sync--async/setImmediate-module'))
gulp.task('murmurhash3js', gulp.series('sync--murmurhash3js-module'))
gulp.task('nodeify', gulp.series('sync--nodeify-module'))
gulp.task('is-promise', gulp.series('sync--is-promise-module'))
gulp.task('promise', gulp.series('sync--promise-module'))
gulp.task('asap/asap', gulp.series('sync--asap/asap-module'))
gulp.task('asap/raw', gulp.series('sync--asap/raw-module'))
gulp.task('bip66', gulp.series('sync--bip66-module'))
gulp.task('levelup/3.0.0/lib/levelup', gulp.series('sync--levelup/3.0.0/lib/levelup-module'))
gulp.task('xtend', gulp.series('sync--xtend-module'))
gulp.task('level-js/4.0.2/index', gulp.series('sync--level-js/4.0.2/index-module'))
gulp.task('typedarray-to-buffer', gulp.series('sync--typedarray-to-buffer-module'))
gulp.task('is-typedarray', gulp.series('sync--is-typedarray-module'))
gulp.task('immediate', gulp.series('sync--immediate-module'))
gulp.task('p-map/1.1.1/index', gulp.series('sync--p-map/1.1.1/index-module'))

gulp.task('ipld-dag-pb/0.20.0', gulp.series('sync--ipld-dag-pb/0.20.0-module'))

gulp.task('class-is', gulp.series('sync--class-is-module'))

gulp.task('protons', gulp.series('sync--protons-module'))

gulp.task('protocol-buffers-schema', gulp.series('sync--protocol-buffers-schema-module'))

gulp.task('signed-varint', gulp.series('sync--signed-varint-module'))

gulp.task('multibase/4.0.4', gulp.series('sync--multibase/4.0.4-module'))

gulp.task('web-encoding', gulp.series('sync--web-encoding-module'))

gulp.task('secp256k1/3.8.0', gulp.series('sync--secp256k1/3.8.0-module'))

