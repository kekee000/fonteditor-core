/**
 * @file buffer.js
 * @author mengke01
 * @date 
 * @description
 * buffer和ArrayBuffer转换
 */


/**
 * buffer转换成ArrayBuffer
 * 
 * @param {Buffer} buffer 缓冲数组
 * @return {ArrayBuffer} 
 */
function toArrayBuffer(buffer) {
    var length = buffer.length;
    var view = new DataView(new ArrayBuffer(length), 0, length);
    for (var i = 0, l = length; i < l; i++) {
        view.setUint8(i, buffer[i], false);
    }
    return view.buffer;
}

/**
 * ArrayBuffer转换成Buffer
 * 
 * @param {ArrayBuffer} arrayBuffer 缓冲数组
 * @return {Buffer} 
 */
function toBuffer(arrayBuffer) {
    var length = arrayBuffer.byteLength;
    var view = new DataView(arrayBuffer, 0, length);
    var buffer = new Buffer(length);
    for (var i = 0, l = length; i < l; i++) {
        buffer[i] = view.getUint8(i, false);
    }
    return buffer;
}

module.exports = {
    toArrayBuffer: toArrayBuffer,
    toBuffer: toBuffer
};