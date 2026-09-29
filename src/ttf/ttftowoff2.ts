/**
 * @file ttf to woff2
 * @author mengke01(kekee000@gmail.com)
 */
import woff2 from '../../woff2/index';

export interface TTFToWoff2Options {
    /** woff2 wasm 模块地址 */
    wasmUrl?: string;
}

/**
 * ttf格式转换成woff2字体格式
 *
 * @param ttfBuffer ttf缓冲数组
 * @param options 选项
 *
 * @return woff2格式byte流
 */
// eslint-disable-next-line no-unused-vars
export default function ttftowoff2(ttfBuffer: ArrayBuffer, options: TTFToWoff2Options = {}) {
    if (!woff2.isInited()) {
        throw new Error('use woff2.init() to init woff2 module!');
    }

    const result = woff2.encode(ttfBuffer);
    return result.buffer;
}


/**
 * ttf格式转换成woff2字体格式
 *
 * @param ttfBuffer ttf缓冲数组
 * @param options 选项
 *
 * @return woff2格式byte流
 */
export function ttftowoff2async(ttfBuffer: ArrayBuffer, options: TTFToWoff2Options = {}) {
    return woff2.init(options.wasmUrl).then(() => {
        const result = woff2.encode(ttfBuffer);
        return result.buffer;
    });
}
