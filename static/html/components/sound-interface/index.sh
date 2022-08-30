#!/bin/bash


set -e
eval $@

export OPTIMIZE="-Os"
export LDFLAGS="${OPTIMIZE}"
export CFLAGS="${OPTIMIZE}"
export CXXFLAGS="${OPTIMIZE}"

full_path=$(pwd $0)
src=${full_path}/external/wasm
dist=${full_path}/external/wasm/dist

rm -rf $dist || true
mkdir  $dist
echo "============================================="
echo "Compiling  sndfile.c "
echo "============================================="
#! /bin/sh
	emcc \
	${src}/sndfile.c \
	${src}/lib/sndfile.bc \
	-L ${src}/lib \
	-I ${src}/include \
	-s WASM=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORT_ES6=1 \
	-s MODULARIZE=1 \
	-s FORCE_FILESYSTEM=1 \
	-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" \
	-o ${dist}/sndfile.js
echo "============================================="
echo "Compiling  sndfile.c done"
echo "============================================="
#https://willowtreeapps.com/ideas/how-to-use-native-libraries-on-node-js-with-emscripten