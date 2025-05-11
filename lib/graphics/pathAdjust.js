"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pathAdjust;
/**
 * @file 调整路径缩放和平移
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 对path坐标进行调整
 *
 * @param {Object} contour 坐标点
 * @param {number} scaleX x缩放比例
 * @param {number} scaleY y缩放比例
 * @param {number} offsetX x偏移
 * @param {number} offsetY y偏移
 *
 * @return {Object} contour 坐标点
 */
function pathAdjust(contour, scaleX, scaleY, offsetX, offsetY) {
  scaleX = scaleX === undefined ? 1 : scaleX;
  scaleY = scaleY === undefined ? 1 : scaleY;
  var x = offsetX || 0;
  var y = offsetY || 0;
  var p;
  for (var i = 0, l = contour.length; i < l; i++) {
    p = contour[i];
    p.x = scaleX * (p.x + x);
    p.y = scaleY * (p.y + y);
  }
  return contour;
}