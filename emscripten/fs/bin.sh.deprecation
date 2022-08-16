#!/bin/bash

od \
--output-duplicates \
--address-radix=n \
--width=1 \
--format=u1 ./dist/main.wasm | tr '\n' ',' > ./dist/wasm

echo "export default [" >>./dist/wasmBinary.mjs
cat ./dist/wasm  >>./dist/wasmBinary.mjs
echo "]" >>./dist/wasmBinary.mjs
rm ./dist/wasm