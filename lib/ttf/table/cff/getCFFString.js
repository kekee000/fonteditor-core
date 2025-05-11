"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getCFFString;
var _cffStandardStrings = _interopRequireDefault(require("./cffStandardStrings"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 获取cff字符串
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 根据索引获取cff字符串
 *
 * @param  {Object} strings 标准cff字符串索引
 * @param  {number} index   索引号
 * @return {number}         字符串索引
 */
function getCFFString(strings, index) {
  if (index <= 390) {
    index = _cffStandardStrings.default[index];
  }
  // Strings below index 392 are standard CFF strings and are not encoded in the font.
  else {
    index = strings[index - 391];
  }
  return index;
}