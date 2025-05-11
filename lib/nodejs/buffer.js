"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * @file Buffer和ArrayBuffer转换
 * @author mengke01(kekee000@gmail.com)
 */
/* eslint-disable no-undef */
var _default = exports.default = {
  /**
   * Buffer转换成ArrayBuffer
   *
   * @param {Buffer} buffer 缓冲数组
   * @return {ArrayBuffer}
   */
  toArrayBuffer: function toArrayBuffer(buffer) {
    var length = buffer.length;
    var view = new DataView(new ArrayBuffer(length), 0, length);
    for (var i = 0, l = length; i < l; i++) {
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
  toBuffer: function toBuffer(arrayBuffer) {
    if (Array.isArray(arrayBuffer)) {
      return Buffer.from(arrayBuffer);
    }
    var length = arrayBuffer.byteLength;
    var view = new DataView(arrayBuffer, 0, length);
    var buffer = Buffer.alloc(length);
    for (var i = 0, l = length; i < l; i++) {
      buffer[i] = view.getUint8(i, false);
    }
    return buffer;
  }
};