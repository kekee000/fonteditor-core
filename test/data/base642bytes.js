/**
 * @file file
 * @author mengke01(kekee000@gmail.com)
 */

module.exports = function base642bytes(base64) {
    let buffer = typeof base64 === 'string'
        ? Buffer.from(base64, 'base64')
        : Buffer.from(base64);
    let length = buffer.length;
    let view = new DataView(new ArrayBuffer(length), 0, length);
    for (let i = 0, l = length; i < l; i++) {
        view.setUint8(i, buffer[i], false);
    }
    return view.buffer;
};
