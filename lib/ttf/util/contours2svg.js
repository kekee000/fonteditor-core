"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contours2svg;
var _contour2svg = _interopRequireDefault(require("./contour2svg"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 将ttf字形转换为svg路径`d`
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * contours轮廓转svgpath
 *
 * @param {Array} contours 轮廓list
 * @param {number} precision 精确度
 * @return {string} path字符串
 */
function contours2svg(contours, precision) {
  if (!contours.length) {
    return '';
  }
  return contours.map(function (contour) {
    return (0, _contour2svg.default)(contour, precision);
  }).join('');
}