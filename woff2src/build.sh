 #!/bin/bash
# woff2 build options

OUTPUT="$(emcc --bind  "woff2.cpp" \
  "woff2/src/woff2_dec.cc" \
  "woff2/src/variable_length.cc" \
  "woff2/src/woff2_common.cc" \
  "woff2/src/woff2_out.cc" \
  "woff2/src/table_tags.cc" \
  "woff2/brotli/c/dec/huffman.c" \
  "woff2/brotli/c/dec/bit_reader.c" \
  "woff2/brotli/c/dec/decode.c" \
  "woff2/brotli/c/dec/state.c" \
  "woff2/brotli/c/common/dictionary.c" \
  "woff2/brotli/c/common/transform.c" \
  "woff2/src/woff2_enc.cc" \
  "woff2/src/font.cc" \
  "woff2/src/glyph.cc" \
  "woff2/src/normalize.cc" \
  "woff2/src/transform.cc" \
  "woff2/brotli/c/enc/dictionary_hash.c" \
  "woff2/brotli/c/enc/backward_references.c" \
  "woff2/brotli/c/enc/memory.c" \
  "woff2/brotli/c/enc/entropy_encode.c" \
  "woff2/brotli/c/enc/compress_fragment_two_pass.c" \
  "woff2/brotli/c/enc/block_splitter.c" \
  "woff2/brotli/c/enc/histogram.c" \
  "woff2/brotli/c/enc/backward_references_hq.c" \
  "woff2/brotli/c/enc/bit_cost.c" \
  "woff2/brotli/c/enc/static_dict.c" \
  "woff2/brotli/c/enc/literal_cost.c" \
  "woff2/brotli/c/enc/brotli_bit_stream.c" \
  "woff2/brotli/c/enc/compress_fragment.c" \
  "woff2/brotli/c/enc/encoder_dict.c" \
  "woff2/brotli/c/enc/cluster.c" \
  "woff2/brotli/c/enc/metablock.c" \
  "woff2/brotli/c/enc/utf8_util.c" \
  "woff2/brotli/c/enc/encode.c" \
  -I./woff2/include/ \
  -I./woff2/brotli/c/include/  \
  -o woff2.js  -Os -s STRICT=1 -s ALLOW_MEMORY_GROWTH=1  -s MALLOC=emmalloc \
  -s MODULARIZE=1  -s ASSERTIONS=1 -s DEMANGLE_SUPPORT=1 \
  -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap","stringToUTF8"]' -s ERROR_ON_UNDEFINED_SYMBOLS=0)"
echo "${OUTPUT}"
