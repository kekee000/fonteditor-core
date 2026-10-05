/**
 * @file 验证构建后的 CommonJS 产物 woff2.js
 * @author kekee000(kekee000@gmail.com)
 *
 * 用法：node woff2src/test.js
 */
const fs = require('fs');
const path = require('path');
const createModule = require('./cjs/woff2.cjs');

// embind vector<uint8_t> -> Uint8Array
function vecToU8(vec) {
    const arr = new Uint8Array(vec.size());
    for (let i = 0, l = arr.length; i < l; i++) {
        arr[i] = vec.get(i);
    }
    if (typeof vec.delete === 'function') {
        vec.delete();
    }
    return arr;
}

function sig(u8) {
    return String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
}

function isSfnt(u8) {
    return u8.length > 4 && (
        (u8[0] === 0 && u8[1] === 1 && u8[2] === 0 && u8[3] === 0) // 0x00010000 TrueType
        || sig(u8) === 'OTTO' || sig(u8) === 'true' || sig(u8) === 'ttcf'
    );
}

(async () => {
    // 新版 emscripten 的 MODULARIZE 工厂返回 Promise；
    // wasm 由 glue 依据自身目录自动定位（woff2.wasm 与 woff2.js 同目录），
    // STRICT 模式下不接受 locateFile 入参，故不传。
    const mod = await createModule();

    const ttf = new Uint8Array(
        fs.readFileSync(path.join(__dirname, '../test/data/baiduHealth.ttf'))
    );

    // ttf -> woff2
    const woff2 = vecToU8(mod.woff2Enc(ttf, ttf.byteLength));
    if (!woff2.length || sig(woff2) !== 'wOF2') {
        throw new Error('woff2Enc 失败，签名=' + sig(woff2));
    }

    // woff2 -> ttf
    const back = vecToU8(mod.woff2Dec(woff2, woff2.byteLength));
    if (!isSfnt(back)) {
        throw new Error('woff2Dec 失败，头部=' + Array.from(back.slice(0, 4)));
    }

    console.log('[CJS] woff2.js OK');
    console.log('  ttf   :', ttf.length, 'bytes');
    console.log('  woff2 :', woff2.length, 'bytes (wOF2)');
    console.log('  ttf<- :', back.length, 'bytes (sfnt)');
})().catch(e => {
    console.error('[CJS] FAIL:', e);
    process.exit(1);
});
