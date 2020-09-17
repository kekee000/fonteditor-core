/**
 * @file ttf to woff2
 * @author mengke01(kekee000@gmail.com)
 */
import woff2 from '../../woff2/index';

/**
 * ttf格式转换成woff2字体格式
 *
 * @param {ArrayBuffer} ttfBuffer ttf缓冲数组
 * @param {Object} options 选项
 *
 * @return {Promise.<ArrayBuffer>} woff格式byte流
 */
// eslint-disable-next-line no-unused-vars
export default function ttftowoff2(ttfBuffer, options = {}) {
    if (!woff2.isInited()) {
        throw new Error('use woff2.init() to init woff2 module!');
    }

    const result = woff2.encode(ttfBuffer);
    return result.buffer;
}


/**
 * ttf格式转换成woff2字体格式
 *
 * @param {ArrayBuffer} ttfBuffer ttf缓冲数组
 * @param {Object} options 选项
 *
 * @return {Promise.<ArrayBuffer>} woff格式byte流
 */
export function ttftowoff2async(ttfBuffer, options = {}) {
    return woff2.init(options.wasmUrl).then(() => {
        const result = woff2.encode(ttfBuffer);
        return result.buffer;
    });
}
