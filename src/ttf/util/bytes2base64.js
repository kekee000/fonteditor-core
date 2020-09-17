/**
 * @file 二进制byte流转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 二进制byte流转base64编码
 *
 * @param {ArrayBuffer|Array} buffer ArrayBuffer对象
 * @return {string} base64编码
 */
export default function bytes2base64(buffer) {
    let str = '';
    let length;
    let i;
    // ArrayBuffer
    if (buffer instanceof ArrayBuffer) {
        length = buffer.byteLength;
        const view = new DataView(buffer, 0, length);
        for (i = 0; i < length; i++) {
            str += String.fromCharCode(view.getUint8(i, false));
        }
    }
    // Array
    else if (buffer.length) {
        length = buffer.length;
        for (i = 0; i < length; i++) {
            str += String.fromCharCode(buffer[i]);
        }
    }

    if (!str) {
        return '';
    }
    return typeof btoa !== 'undefined'
        ? btoa(str)
        : Buffer.from(str, 'binary').toString('base64');
}
