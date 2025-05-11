"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = glyf2svg;
var _contours2svg = _interopRequireDefault(require("./contours2svg"));
var _transformGlyfContours = _interopRequireDefault(require("./transformGlyfContours"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file glyf转换svg，复合字形轮廓需要ttfObject支持
 * @author mengke01(kekee000@gmail.com)
 *
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */

/**
 * glyf转换svg
 *
 * @param {Object} glyf 解析后的glyf结构
 * @param {Object} ttf ttf对象
 * @return {string} svg文本
 */
function glyf2svg(glyf, ttf) {
  if (!glyf) {
    return '';
  }
  var pathArray = [];
  if (!glyf.compound) {
    if (glyf.contours && glyf.contours.length) {
      pathArray.push((0, _contours2svg.default)(glyf.contours));
    }
  } else {
    var contours = (0, _transformGlyfContours.default)(glyf, ttf);
    if (contours && contours.length) {
      pathArray.push((0, _contours2svg.default)(contours));
    }
  }
  return pathArray.join(' ');
}