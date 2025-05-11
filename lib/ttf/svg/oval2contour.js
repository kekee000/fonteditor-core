"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = oval2contour;
var _computeBoundingBox = require("../../graphics/computeBoundingBox");
var _pathAdjust = _interopRequireDefault(require("../../graphics/pathAdjust"));
var _circle = _interopRequireDefault(require("../../graphics/path/circle"));
var _lang = require("../../common/lang");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 椭圆转换成轮廓
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 椭圆转换成轮廓
 *
 * @param {number} cx 椭圆中心点x
 * @param {number} cy 椭圆中心点y
 * @param {number} rx 椭圆x轴半径
 * @param {number} ry 椭圆y周半径
 * @return {Array} 轮廓数组
 */
function oval2contour(cx, cy, rx, ry) {
  if (undefined === ry) {
    ry = rx;
  }
  var bound = (0, _computeBoundingBox.computePath)(_circle.default);
  var scaleX = +rx * 2 / bound.width;
  var scaleY = +ry * 2 / bound.height;
  var centerX = bound.width * scaleX / 2;
  var centerY = bound.height * scaleY / 2;
  var contour = (0, _lang.clone)(_circle.default);
  (0, _pathAdjust.default)(contour, scaleX, scaleY);
  (0, _pathAdjust.default)(contour, 1, 1, +cx - centerX, +cy - centerY);
  return contour;
}