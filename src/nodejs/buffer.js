/**
 * @file Buffer和ArrayBuffer转换
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * Buffer转换成ArrayBuffer
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
    if (Array.isArray(arrayBuffer)) {
        return new Buffer(arrayBuffer);
    }
    else {
        var length = arrayBuffer.byteLength;
        var view = new DataView(arrayBuffer, 0, length);
        var buffer = new Buffer(length);
        for (var i = 0, l = length; i < l; i++) {
            buffer[i] = view.getUint8(i, false);
        }
    }

    return buffer;
}

if (typeof exports !== 'undefined') {
    module.exports = {
        toArrayBuffer: toArrayBuffer,
        toBuffer: toBuffer
    };
}
else {
    define(
        function (require) {
            return {
                toArrayBuffer: toArrayBuffer,
                toBuffer: toBuffer
            };
        }
    );
}


