#!/bin/bash
make  clean
mkdir ./dist
sudo docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk \
emcc -Os --bind ./main.c -o ./dist/main.mjs \
 -s FORCE_FILESYSTEM=1 \
 -lidbfs.js \
 -lworkerfs.js \
 -gsource-map \
 -s INVOKE_RUN=1 \
 -s SINGLE_FILE=1 \
 -s ASYNCIFY=1 \
 -s USE_ZLIB=1 \
 -s MODULARIZE=1 \
 -s EXPORT_ES6=1 \
 -s EXPORTED_RUNTIME_METHODS=["FS"] \
 -s ALLOW_MEMORY_GROWTH=1 \
 -s USE_ES6_IMPORT_META=0 \
 -s ASSERTIONS=1 \
 -s MAXIMUM_MEMORY=4294901760


#./bin.sh
#FLAGS="-Os -g4 \
#-s FORCE_FILESYSTEM=1 \
#-lidbfs.js \
#-s USE_ZLIB=1 \
#--source-map-base http://127.0.0.1:8887/ \
#--preload-file package.json@/package.json \
#-s ASYNCIFY=1 \
#-s NO_EXIT_RUNTIME=1 \
#-s INVOKE_RUN=0 \
#-s EXTRA_EXPORTED_RUNTIME_METHODS=['FS','callMain'] \
#"

#source map -g4 --source-map-base http://127.0.0.1:8887/ \

#emcc -Os  main.c -o index.html \
# -s FORCE_FILESYSTEM=1 \
# -lidbfs.js \
# -lworkerfs.js \
# -s INVOKE_RUN=1 \
# -s FORCE_FILESYSTEM=1 \
# --preload-file package.json@/package.json \
# --preload-file main.mjs@/index.js \
# -s ASYNCIFY=1 \
# -s USE_ZLIB=1


#FLAGS="-Os -g4 \
#-s FORCE_FILESYSTEM=1 \
#-lidbfs.js \
#-s USE_ZLIB=1 \
#--source-map-base http://127.0.0.1:8887/ \
#--preload-file package.json@/package.json \
#-s ASYNCIFY=1 \
#-s INVOKE_RUN=0 \
#-s NO_EXIT_RUNTIME=1 \
#-s EXTRA_EXPORTED_RUNTIME_METHODS=['FS','callMain'] \
#"

#emmake make \
#LDFLAGS_native="$FLAGS" \
#CC_native=emcc  \
#EXE_native=index.html \
#CFLAGS_native="$FLAGS"
