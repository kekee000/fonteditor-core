"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eot2ttf;
var _reader = _interopRequireDefault(require("./reader"));
var _writer = _interopRequireDefault(require("./writer"));
var _error = _interopRequireDefault(require("./error"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file eot转ttf
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * eot格式转换成ttf字体格式
 *
 * @param {ArrayBuffer} eotBuffer eot缓冲数组
 * @param {Object} options 选项
 *
 * @return {ArrayBuffer} ttf格式byte流
 */
// eslint-disable-next-line no-unused-vars
function eot2ttf(eotBuffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // 这里用小尾方式读取
  var eotReader = new _reader.default(eotBuffer, 0, eotBuffer.byteLength, true);

  // check magic number
  var magicNumber = eotReader.readUint16(34);
  if (magicNumber !== 0x504C) {
    _error.default.raise(10110);
  }

  // check version
  var version = eotReader.readUint32(8);
  if (version !== 0x20001 && version !== 0x10000 && version !== 0x20002) {
    _error.default.raise(10110);
  }
  var eotSize = eotBuffer.byteLength || eotBuffer.length;
  var fontSize = eotReader.readUint32(4);
  var fontOffset = 82;
  var familyNameSize = eotReader.readUint16(fontOffset);
  fontOffset += 4 + familyNameSize;
  var styleNameSize = eotReader.readUint16(fontOffset);
  fontOffset += 4 + styleNameSize;
  var versionNameSize = eotReader.readUint16(fontOffset);
  fontOffset += 4 + versionNameSize;
  var fullNameSize = eotReader.readUint16(fontOffset);
  fontOffset += 2 + fullNameSize;

  // version 0x20001
  if (version === 0x20001 || version === 0x20002) {
    var rootStringSize = eotReader.readUint16(fontOffset + 2);
    fontOffset += 4 + rootStringSize;
  }

  // version 0x20002
  if (version === 0x20002) {
    fontOffset += 10;
    var signatureSize = eotReader.readUint16(fontOffset);
    fontOffset += 2 + signatureSize;
    fontOffset += 4;
    var eudcFontSize = eotReader.readUint32(fontOffset);
    fontOffset += 4 + eudcFontSize;
  }
  if (fontOffset + fontSize > eotSize) {
    _error.default.raise(10001);
  }

  // support slice
  if (eotBuffer.slice) {
    return eotBuffer.slice(fontOffset, fontOffset + fontSize);
  }

  // not support ArrayBuffer.slice eg. IE10
  var bytes = eotReader.readBytes(fontOffset, fontSize);
  return new _writer.default(new ArrayBuffer(fontSize)).writeBytes(bytes).getBuffer();
}