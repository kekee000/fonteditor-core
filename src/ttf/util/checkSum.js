/**
 * @file ttf table校验函数
 * @author mengke01(kekee000@gmail.com)
 */

function checkSumArrayBuffer(buffer, offset = 0, length) {
    length = length == null ? buffer.byteLength : length;

    if (offset + length > buffer.byteLength) {
        throw new Error('check sum out of bound');
    }

    const nLongs = Math.floor(length / 4);
    const view = new DataView(buffer, offset, length);
    let sum = 0;
    let i = 0;

    while (i < nLongs) {
        sum += view.getUint32(4 * i++, false);
    }

    let leftBytes = length - nLongs * 4;
    if (leftBytes) {
        offset = nLongs * 4;
        while (leftBytes > 0) {
            sum += view.getUint8(offset, false) << (leftBytes * 8);
            offset++;
            leftBytes--;
        }
    }
    return sum % 0x100000000;
}

function checkSumArray(buffer, offset = 0, length) {
    length = length || buffer.length;

    if (offset + length > buffer.length) {
        throw new Error('check sum out of bound');
    }

    const nLongs = Math.floor(length / 4);
    let sum = 0;
    let i = 0;

    while (i < nLongs) {
        sum += (buffer[i++] << 24)
            + (buffer[i++] << 16)
            + (buffer[i++] << 8)
            + buffer[i++];
    }

    let leftBytes = length - nLongs * 4;
    if (leftBytes) {
        offset = nLongs * 4;
        while (leftBytes > 0) {
            sum += buffer[offset] << (leftBytes * 8);
            offset++;
            leftBytes--;
        }
    }
    return sum % 0x100000000;
}


/**
 * table校验
 *
 * @param {ArrayBuffer|Array} buffer 表数据
 * @param {number=} offset 偏移量
 * @param {number=} length 长度
 *
 * @return {number} 校验和
 */
export default function checkSum(buffer, offset, length) {
    if (buffer instanceof ArrayBuffer) {
        return checkSumArrayBuffer(buffer, offset, length);
    }
    else if (buffer instanceof Array) {
        return checkSumArray(buffer, offset, length);
    }

    throw new Error('not support checksum buffer type');
}
