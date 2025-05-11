"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = checkSum;
/**
 * @file ttf table校验函数
 * @author mengke01(kekee000@gmail.com)
 */

function checkSumArrayBuffer(buffer) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var length = arguments.length > 2 ? arguments[2] : undefined;
  length = length == null ? buffer.byteLength : length;
  if (offset + length > buffer.byteLength) {
    throw new Error('check sum out of bound');
  }
  var nLongs = Math.floor(length / 4);
  var view = new DataView(buffer, offset, length);
  var sum = 0;
  var i = 0;
  while (i < nLongs) {
    sum += view.getUint32(4 * i++, false);
  }
  var leftBytes = length - nLongs * 4;
  if (leftBytes) {
    offset = nLongs * 4;
    while (leftBytes > 0) {
      sum += view.getUint8(offset, false) << leftBytes * 8;
      offset++;
      leftBytes--;
    }
  }
  return sum % 0x100000000;
}
function checkSumArray(buffer) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var length = arguments.length > 2 ? arguments[2] : undefined;
  length = length || buffer.length;
  if (offset + length > buffer.length) {
    throw new Error('check sum out of bound');
  }
  var nLongs = Math.floor(length / 4);
  var sum = 0;
  var i = 0;
  while (i < nLongs) {
    sum += (buffer[i++] << 24) + (buffer[i++] << 16) + (buffer[i++] << 8) + buffer[i++];
  }
  var leftBytes = length - nLongs * 4;
  if (leftBytes) {
    offset = nLongs * 4;
    while (leftBytes > 0) {
      sum += buffer[offset] << leftBytes * 8;
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
function checkSum(buffer, offset, length) {
  if (buffer instanceof ArrayBuffer) {
    return checkSumArrayBuffer(buffer, offset, length);
  } else if (buffer instanceof Array) {
    return checkSumArray(buffer, offset, length);
  }
  throw new Error('not support checksum buffer type');
}