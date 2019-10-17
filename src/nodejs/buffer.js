/**
 * @file Buffer和ArrayBuffer转换
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable no-undef */
export default {

    /**
     * Buffer转换成ArrayBuffer
     *
     * @param {Buffer} buffer 缓冲数组
     * @return {ArrayBuffer}
     */
    toArrayBuffer(buffer) {
        let length = buffer.length;
        let view = new DataView(new ArrayBuffer(length), 0, length);
        for (let i = 0, l = length; i < l; i++) {
            view.setUint8(i, buffer[i], false);
        }
        return view.buffer;
    },

    /**
     * ArrayBuffer转换成Buffer
     *
     * @param {ArrayBuffer} arrayBuffer 缓冲数组
     * @return {Buffer}
     */
    toBuffer(arrayBuffer) {
        if (Array.isArray(arrayBuffer)) {
            return Buffer.from(arrayBuffer);
        }

        let length = arrayBuffer.byteLength;
        let view = new DataView(arrayBuffer, 0, length);
        let buffer = Buffer.alloc(length);
        for (let i = 0, l = length; i < l; i++) {
            buffer[i] = view.getUint8(i, false);
        }
        return buffer;
    }
};
