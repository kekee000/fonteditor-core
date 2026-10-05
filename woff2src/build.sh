 #!/bin/bash
cd $(dirname $0);
# 编译失败即中止，避免 build.js 处理到旧产物
set -e

# woff2 build options

# 源文件（CJS / ESM 两种产物共用）
SRCS=(
  "woff2.cpp"
  "woff2/src/woff2_dec.cc"
  "woff2/src/variable_length.cc"
  "woff2/src/woff2_common.cc"
  "woff2/src/woff2_out.cc"
  "woff2/src/table_tags.cc"
  "woff2/brotli/c/dec/huffman.c"
  "woff2/brotli/c/dec/bit_reader.c"
  "woff2/brotli/c/dec/decode.c"
  "woff2/brotli/c/dec/state.c"
  "woff2/brotli/c/common/dictionary.c"
  "woff2/brotli/c/common/transform.c"
  "woff2/src/woff2_enc.cc"
  "woff2/src/font.cc"
  "woff2/src/glyph.cc"
  "woff2/src/normalize.cc"
  "woff2/src/transform.cc"
  "woff2/brotli/c/enc/dictionary_hash.c"
  "woff2/brotli/c/enc/backward_references.c"
  "woff2/brotli/c/enc/memory.c"
  "woff2/brotli/c/enc/entropy_encode.c"
  "woff2/brotli/c/enc/compress_fragment_two_pass.c"
  "woff2/brotli/c/enc/block_splitter.c"
  "woff2/brotli/c/enc/histogram.c"
  "woff2/brotli/c/enc/backward_references_hq.c"
  "woff2/brotli/c/enc/bit_cost.c"
  "woff2/brotli/c/enc/static_dict.c"
  "woff2/brotli/c/enc/literal_cost.c"
  "woff2/brotli/c/enc/brotli_bit_stream.c"
  "woff2/brotli/c/enc/compress_fragment.c"
  "woff2/brotli/c/enc/encoder_dict.c"
  "woff2/brotli/c/enc/cluster.c"
  "woff2/brotli/c/enc/metablock.c"
  "woff2/brotli/c/enc/utf8_util.c"
  "woff2/brotli/c/enc/encode.c"
)

INCLUDES=(-I./woff2/include/ -I./woff2/brotli/c/include/)

# 公共编译参数（数组形式，保证含空格/引号的参数不被 shell 拆分）
# DEFAULT_TO_CXX=1：源码含 C++(embind)，链接时带上 C++ 运行时；
# 但仍用 emcc 驱动，按扩展名把 brotli 的 .c 当 C 编译（避免 C++ 严格性报错）
COMMON_FLAGS=(
  -Os -s STRICT=1 -s ALLOW_MEMORY_GROWTH=1 -s MALLOC=emmalloc
  -s MODULARIZE=1 -s ASSERTIONS=1 -s DEFAULT_TO_CXX=1
  --no-entry
  -s "EXPORTED_RUNTIME_METHODS=[\"ccall\",\"cwrap\",\"stringToUTF8\"]"
  -s ERROR_ON_UNDEFINED_SYMBOLS=0
)

mkdir -p cjs
# ① CommonJS 产物：woff2.js（module.exports = Module）
emcc --bind "${SRCS[@]}" "${INCLUDES[@]}" -o cjs/woff2.js "${COMMON_FLAGS[@]}"

npx esbuild cjs/woff2.js \
  --target=es2018 \
  --format=cjs \
  --outfile=cjs/woff2.cjs

rm -f cjs/woff2.js

mkdir -p mjs
# ② ESM 产物：woff2.mjs（export default Module；wasm 经 import.meta.url 定位）
#    如需自包含单文件（浏览器原生 ESM 免传 wasmUrl），再加 -s SINGLE_FILE=1
emcc --bind "${SRCS[@]}" "${INCLUDES[@]}" -o mjs/woff2.mjs "${COMMON_FLAGS[@]}" -s EXPORT_ES6=1

