"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseCFFCharset;
var _getCFFString = _interopRequireDefault(require("./getCFFString"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 解析cff字符集
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 解析cff字形名称
 * See Adobe TN #5176 chapter 13, "Charsets".
 *
 * @param  {Reader} reader  读取器
 * @param  {number} start   起始偏移
 * @param  {number} nGlyphs 字形个数
 * @param  {Object} strings cff字符串字典
 * @return {Array}         字符集
 */
function parseCFFCharset(reader, start, nGlyphs, strings) {
  if (start) {
    reader.seek(start);
  }
  var i;
  var sid;
  var count;
  // The .notdef glyph is not included, so subtract 1.
  nGlyphs -= 1;
  var charset = ['.notdef'];
  var format = reader.readUint8();
  if (format === 0) {
    for (i = 0; i < nGlyphs; i += 1) {
      sid = reader.readUint16();
      charset.push((0, _getCFFString.default)(strings, sid));
    }
  } else if (format === 1) {
    while (charset.length <= nGlyphs) {
      sid = reader.readUint16();
      count = reader.readUint8();
      for (i = 0; i <= count; i += 1) {
        charset.push((0, _getCFFString.default)(strings, sid));
        sid += 1;
      }
    }
  } else if (format === 2) {
    while (charset.length <= nGlyphs) {
      sid = reader.readUint16();
      count = reader.readUint16();
      for (i = 0; i <= count; i += 1) {
        charset.push((0, _getCFFString.default)(strings, sid));
        sid += 1;
      }
    }
  } else {
    throw new Error('Unknown charset format ' + format);
  }
  return charset;
}