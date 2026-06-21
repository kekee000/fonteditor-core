/**
 * @file 二进制byte流转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 二进制byte流转base64编码
 *
 * @param buffer ArrayBuffer对象
 * @return base64编码
 */
export default function bytes2base64(buffer: ArrayBuffer | ArrayLike<number>) {
    let str = '';
    // ArrayBuffer
    if (buffer instanceof ArrayBuffer) {
        const length = buffer.byteLength;
        const view = new DataView(buffer, 0, length);
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode(view.getUint8(i));
        }
    }
    // Array
    else if ((buffer as number[]).length) {
        const length = (buffer as number[]).length;
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode((buffer as number[])[i]);
        }
    }

    if (!str) {
        return '';
    }
    return typeof btoa !== 'undefined'
        ? btoa(str)
        : Buffer.from(str, 'binary').toString('base64');
}
