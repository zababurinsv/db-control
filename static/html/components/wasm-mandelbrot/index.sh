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
echo "Compiling  mandelbrot.cpp "
echo "============================================="
	em++ \
	--bind \
	--std=c++14 \
	-s WASM=1 \
	-s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-g	${src}/index.cpp \
	-o  ${dist}/index.js
echo "============================================="
echo "Compiling  mandelbrot.cpp done"
echo "============================================="
#https://willowtreeapps.com/ideas/how-to-use-native-libraries-on-node-js-with-emscripten