# wasm version of google woff2

modify from https://github.com/alimilhim/woff2-wasm

add woff2Enc and woff2Dec support

thanks to `woff2-wasm`

## usage

```
const woff2 = require('./index');
woff2.init().then(function (woff2) {
    woff2.woff2Enc(buffer); // encode ttf buffer to woff2 buffer
    woff2.woff2Dec(buffer); // decode woff2 buffer to ttf buffer
});
```

## build

install emsdk from https://emscripten.org/docs/getting_started/downloads.html

```
git clone --recurse-submodules https://github.com/google/woff2.git
sh build.sh
```
