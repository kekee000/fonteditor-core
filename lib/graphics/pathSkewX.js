"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pathSkewX;
var _computeBoundingBox = require("./computeBoundingBox");
/**
 * @file 按X轴平移变换, 变换中心为图像中心点
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * path倾斜变换
 *
 * @param {Object} contour 坐标点
 * @param {number} angle 角度
 *
 * @return {Object} contour 坐标点
 */
function pathSkewX(contour, angle) {
  angle = angle === undefined ? 0 : angle;
  var y = (0, _computeBoundingBox.computePath)(contour).y;
  var tan = Math.tan(angle);
  var p;
  // x 平移
  for (var i = 0, l = contour.length; i < l; i++) {
    p = contour[i];
    p.x += tan * (p.y - y);
  }
  return contour;
}