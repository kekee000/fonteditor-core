/**
 * @file woff2 to ttf
 * @author mengke01(kekee000@gmail.com)
 */
import woff2 from '../../woff2/index';


/**
 * ttf格式转换成woff2字体格式
 *
 * @param woff2Buffer ttf缓冲数组
 * @param options 选项
 *
 * @return
 */
// eslint-disable-next-line no-unused-vars
export default function woff2tottf(woff2Buffer: ArrayBuffer, options: any = {}) {
    if (!woff2.isInited()) {
        throw new Error('use woff2.init() to init woff2 module!');
    }
    const result = woff2.decode(woff2Buffer);
    return result.buffer as ArrayBuffer;
}

/**
 * ttf格式转换成woff2字体格式
 *
 * @param woff2Buffer ttf缓冲数组
 * @param options 选项
 *
 * @return {Promise.<ArrayBuffer>} woff格式byte流
 */
export function woff2tottfasync(woff2Buffer: ArrayBuffer, options: any = {}) {
    return woff2.init(options.wasmUrl).then(() => {
        const result = woff2.decode(woff2Buffer);
        return result.buffer as ArrayBuffer;
    });
}
