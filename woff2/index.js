/**
 * @file woff2 wasm build of google woff2
 * thanks to woff2-asm
 * https://github.com/alimilhim/woff2-wasm
 * @author mengke01(kekee000@gmail.com)
 */

// Require the woff2 module
const woff2ModuleLoader = require('./woff2');

const CSP_ERROR_RE = /unsafe-eval|Refused to evaluate a string as JavaScript|Content Security Policy|CSP/i;
const CSP_ERROR_HINT = 'WOFF2 runtime failed under Content Security Policy restrictions. Use a CSP-safe woff2.js build (without eval/new Function) or process WOFF2 outside the restricted environment.';

function normalizeWoff2Error(error) {
    if (error instanceof Error) {
        return error;
    }

    return new Error(error == null ? 'Unknown WOFF2 initialization error' : String(error));
}

function enhanceWoff2Error(error) {
    const normalizedError = normalizeWoff2Error(error);

    if (CSP_ERROR_RE.test(normalizedError.message)
        && normalizedError.message.indexOf(CSP_ERROR_HINT) === -1
    ) {
        normalizedError.message += '\n' + CSP_ERROR_HINT;
    }

    return normalizedError;
}

function convertFromVecToUint8Array(vector) {
    const arr = [];
    for (let i = 0, l = vector.size(); i < l; i++) {
        arr.push(vector.get(i));
    }
    return new Uint8Array(arr);
}

// Define as a named object that can be exported with CommonJS
const woff2Module = {
    woff2Module: null,

    /**
     * 是否已经加载完毕
     *
     * @return {boolean}
     */
    isInited() {
        return (
            this.woff2Module && this.woff2Module.woff2Enc && this.woff2Module.woff2Dec
        );
    },

    /**
     * 初始化 woff 模块
     *
     * @param {string|ArrayBuffer} wasmUrl woff2.wasm file url
     * @return {Promise}
     */
    init(wasmUrl) {
        return new Promise((resolve, reject) => {
            if (this.woff2Module) {
                resolve(this);
                return;
            }

            let moduleLoaderConfig = null;
            if (typeof window !== 'undefined') {
                moduleLoaderConfig = {
                    locateFile(path) {
                        if (path.endsWith('.wasm')) {
                            return wasmUrl;
                        }
                        return path;
                    },
                };
            }
            // for nodejs
            else {
                // Use path resolution that works in both ESM and CommonJS
                let wasmPath = './woff2.wasm';
                // If running in Node.js with __dirname available (CommonJS)
                if (typeof __dirname !== 'undefined') {
                    wasmPath = __dirname + '/woff2.wasm';
                }

                moduleLoaderConfig = {
                    wasmBinaryFile: wasmPath,
                };
            }

            const fail = (reason) => {
                reject(enhanceWoff2Error(reason));
            };

            moduleLoaderConfig.onAbort = fail;

            try {
                const woffModule = woff2ModuleLoader(moduleLoaderConfig);
                woffModule.onAbort = fail;
                woffModule.onRuntimeInitialized = () => {
                    this.woff2Module = woffModule;
                    resolve(this);
                };
            }
            catch (e) {
                fail(e);
            }
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
    },
};

// Export for CommonJS
module.exports = woff2Module;
