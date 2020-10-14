/**
 * @file woff2 wasm build of google woff2
 * thanks to woff2-asm
 * https://github.com/alimilhim/woff2-wasm
 * @author mengke01(kekee000@gmail.com)
 */

function convertFromVecToUint8Array(vector) {
    const arr = [];
    for (let i = 0, l = vector.size(); i < l; i++) {
        arr.push(vector.get(i));
    }
    return new Uint8Array(arr);
}


// eslint-disable-next-line import/no-commonjs
module.exports = {

    woff2Module: null,

    /**
     * 是否已经加载完毕
     *
     * @return {boolean}
     */
    isInited() {
        return this.woff2Module
            && this.woff2Module.woff2Enc
            && this.woff2Module.woff2Dec;
    },

    /**
     * 初始化 woff 模块
     *
     * @param {string|ArrayBuffer} wasmUrl woff2.wasm file url
     * @return {Promise}
     */
    init(wasmUrl) {
        return new Promise(resolve => {
            if (this.woff2Module) {
                resolve(this);
                return;
            }

            // for browser
            const moduleLoader = require('./woff2');
            let moduleLoaderConfig = null;
            if (typeof window !== 'undefined') {
                moduleLoaderConfig = {
                    locateFile(path) {
                        if (path.endsWith('.wasm')) {
                            return wasmUrl;
                        }
                        return path;
                    }
                };
            }
            // for nodejs
            else {
                moduleLoaderConfig = {
                    wasmBinaryFile: __dirname + '/woff2.wasm'
                };
            }
            const woff2Module = moduleLoader(moduleLoaderConfig);
            woff2Module.onRuntimeInitialized = () => {
                this.woff2Module = woff2Module;
                resolve(this);
            };
        });
    },

    /**
     * 将ttf buffer 转换成 woff2 buffer
     *
     * @param {ArrayBuffer|Buffer|Array} ttfBuffer ttf buffer
     * @return {Uint8Array} uint8 array
     */
    encode(ttfBuffer) {
        const buffer = new Uint8Array(ttfBuffer);
        const woffbuff = this.woff2Module.woff2Enc(buffer, buffer.byteLength);
        return convertFromVecToUint8Array(woffbuff);
    },

    /**
     * 将woff2 buffer 转换成 ttf buffer
     *
     * @param {ArrayBuffer|Buffer|Array} woff2Buffer woff2 buffer
     * @return {Uint8Array} uint8 array
     */
    decode(woff2Buffer) {
        const buffer = new Uint8Array(woff2Buffer);
        const ttfbuff = this.woff2Module.woff2Dec(buffer, buffer.byteLength);
        return convertFromVecToUint8Array(ttfbuff);
    }
};
