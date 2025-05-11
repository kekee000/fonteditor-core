"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compound2simpleglyf;
var _transformGlyfContours = _interopRequireDefault(require("./transformGlyfContours"));
var _compound2simple = _interopRequireDefault(require("./compound2simple"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file ttf复合字形转简单字形
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * ttf复合字形转简单字形
 *
 * @param  {Object|number} glyf glyf对象或者glyf索引
 * @param  {Object} ttf ttfObject对象
 * @param  {boolean} recrusive 是否递归的进行转换，如果复合字形为嵌套字形，则转换每一个复合字形
 * @return {Object} 转换后的对象
 */
function compound2simpleglyf(glyf, ttf, recrusive) {
  var glyfIndex;
  // 兼容索引和对象传入
  if (typeof glyf === 'number') {
    glyfIndex = glyf;
    glyf = ttf.glyf[glyfIndex];
  } else {
    glyfIndex = ttf.glyf.indexOf(glyf);
    if (-1 === glyfIndex) {
      return glyf;
    }
  }
  if (!glyf.compound || !glyf.glyfs) {
    return glyf;
  }
  var contoursList = {};
  (0, _transformGlyfContours.default)(glyf, ttf, contoursList, glyfIndex);
  if (recrusive) {
    Object.keys(contoursList).forEach(function (index) {
      (0, _compound2simple.default)(ttf.glyf[index], contoursList[index]);
    });
  } else {
    (0, _compound2simple.default)(glyf, contoursList[glyfIndex]);
  }
  return glyf;
}