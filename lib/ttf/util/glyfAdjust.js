"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = glyfAdjust;
var _pathAdjust = _interopRequireDefault(require("../../graphics/pathAdjust"));
var _pathCeil = _interopRequireDefault(require("../../graphics/pathCeil"));
var _computeBoundingBox = require("../../graphics/computeBoundingBox");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file glyf的缩放和平移调整
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 简单字形的缩放和平移调整
 *
 * @param {Object} g glyf对象
 * @param {number} scaleX x缩放比例
 * @param {number} scaleY y缩放比例
 * @param {number} offsetX x偏移
 * @param {number} offsetY y偏移
 * @param {boolan} useCeil 是否对字形设置取整，默认取整
 *
 * @return {Object} 调整后的glyf对象
 */
function glyfAdjust(g) {
  var scaleX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var scaleY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var offsetX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var offsetY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var useCeil = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  if (g.contours && g.contours.length) {
    if (scaleX !== 1 || scaleY !== 1) {
      g.contours.forEach(function (contour) {
        (0, _pathAdjust.default)(contour, scaleX, scaleY);
      });
    }
    if (offsetX !== 0 || offsetY !== 0) {
      g.contours.forEach(function (contour) {
        (0, _pathAdjust.default)(contour, 1, 1, offsetX, offsetY);
      });
    }
    if (false !== useCeil) {
      g.contours.forEach(function (contour) {
        (0, _pathCeil.default)(contour);
      });
    }
  }

  // 重新计算xmin，xmax，ymin，ymax
  var advanceWidth = g.advanceWidth;
  if (undefined === g.xMin || undefined === g.yMax || undefined === g.leftSideBearing || undefined === g.advanceWidth) {
    // 有的字形没有形状，需要特殊处理一下
    var bound;
    if (g.contours && g.contours.length) {
      // eslint-disable-next-line no-invalid-this
      bound = _computeBoundingBox.computePathBox.apply(this, g.contours);
    } else {
      bound = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
    g.xMin = bound.x;
    g.xMax = bound.x + bound.width;
    g.yMin = bound.y;
    g.yMax = bound.y + bound.height;
    g.leftSideBearing = g.xMin;

    // 如果设置了advanceWidth就是用默认的，否则为xMax + abs(xMin)
    if (undefined !== advanceWidth) {
      g.advanceWidth = Math.round(advanceWidth * scaleX + offsetX);
    } else {
      g.advanceWidth = g.xMax + Math.abs(g.xMin);
    }
  } else {
    g.xMin = Math.round(g.xMin * scaleX + offsetX);
    g.xMax = Math.round(g.xMax * scaleX + offsetX);
    g.yMin = Math.round(g.yMin * scaleY + offsetY);
    g.yMax = Math.round(g.yMax * scaleY + offsetY);
    g.leftSideBearing = Math.round(g.leftSideBearing * scaleX + offsetX);
    g.advanceWidth = Math.round(advanceWidth * scaleX + offsetX);
  }
  return g;
}