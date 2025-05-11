"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optimizettf;
var _reduceGlyf = _interopRequireDefault(require("./reduceGlyf"));
var _pathCeil = _interopRequireDefault(require("../../graphics/pathCeil"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 对ttf对象进行优化，查找错误，去除冗余点
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 对ttf对象进行优化
 *
 * @param  {Object} ttf ttf对象
 * @return {true|Object} 错误信息
 */
function optimizettf(ttf) {
  var checkUnicodeRepeat = {}; // 检查是否有重复代码点
  var repeatList = [];
  ttf.glyf.forEach(function (glyf, index) {
    if (glyf.unicode) {
      glyf.unicode = glyf.unicode.sort();

      // 将glyf的代码点按小到大排序
      glyf.unicode.sort(function (a, b) {
        return a - b;
      }).forEach(function (u) {
        if (checkUnicodeRepeat[u]) {
          repeatList.push(index);
        } else {
          checkUnicodeRepeat[u] = true;
        }
      });
    }
    if (!glyf.compound && glyf.contours) {
      // 整数化
      glyf.contours.forEach(function (contour) {
        (0, _pathCeil.default)(contour);
      });
      // 缩减glyf
      (0, _reduceGlyf.default)(glyf);
    }

    // 整数化
    glyf.xMin = Math.round(glyf.xMin || 0);
    glyf.xMax = Math.round(glyf.xMax || 0);
    glyf.yMin = Math.round(glyf.yMin || 0);
    glyf.yMax = Math.round(glyf.yMax || 0);
    glyf.leftSideBearing = Math.round(glyf.leftSideBearing || 0);
    glyf.advanceWidth = Math.round(glyf.advanceWidth || 0);
  });

  // 过滤无轮廓字体，如果存在复合字形不进行过滤
  if (!ttf.glyf.some(function (a) {
    return a.compound;
  })) {
    ttf.glyf = ttf.glyf.filter(function (glyf, index) {
      return index === 0 || glyf.contours && glyf.contours.length;
    });
  }
  if (!repeatList.length) {
    return true;
  }
  return {
    repeat: repeatList
  };
}