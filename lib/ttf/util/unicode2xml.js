"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unicode2xml;
var _string = _interopRequireDefault(require("../../common/string"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file unicode字符转xml字符编码
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * unicode 转xml编码格式
 *
 * @param {Array.<number>} unicodeList unicode字符列表
 * @return {string} xml编码格式
 */
function unicode2xml(unicodeList) {
  if (typeof unicodeList === 'number') {
    unicodeList = [unicodeList];
  }
  return unicodeList.map(function (u) {
    if (u < 0x20) {
      return '';
    }
    return u >= 0x20 && u <= 255 ? _string.default.encodeHTML(String.fromCharCode(u)) : '&#x' + u.toString(16) + ';';
  }).join('');
}