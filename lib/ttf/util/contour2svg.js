"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contour2svg;
/**
 * @file 将ttf路径转换为svg路径`d`
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 将路径转换为svg路径
 *
 * @param {Array} contour 轮廓序列
 * @param {number} precision 精确度
 * @return {string} 路径
 */
function contour2svg(contour) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  if (!contour.length) {
    return '';
  }
  var ceil = function ceil(number) {
    return +number.toFixed(precision);
  };
  var pathArr = [];
  var curPoint;
  var prevPoint;
  var nextPoint;
  var x; // x相对坐标
  var y; // y相对坐标
  for (var i = 0, l = contour.length; i < l; i++) {
    curPoint = contour[i];
    prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
    nextPoint = i === l - 1 ? contour[0] : contour[i + 1];

    // 起始坐标
    if (i === 0) {
      if (curPoint.onCurve) {
        x = curPoint.x;
        y = curPoint.y;
        pathArr.push('M' + ceil(x) + ' ' + ceil(y));
      } else if (prevPoint.onCurve) {
        x = prevPoint.x;
        y = prevPoint.y;
        pathArr.push('M' + ceil(x) + ' ' + ceil(y));
      } else {
        x = (prevPoint.x + curPoint.x) / 2;
        y = (prevPoint.y + curPoint.y) / 2;
        pathArr.push('M' + ceil(x) + ' ' + ceil(y));
      }
    }

    // 直线
    if (curPoint.onCurve && nextPoint.onCurve) {
      pathArr.push('l' + ceil(nextPoint.x - x) + ' ' + ceil(nextPoint.y - y));
      x = nextPoint.x;
      y = nextPoint.y;
    } else if (!curPoint.onCurve) {
      if (nextPoint.onCurve) {
        pathArr.push('q' + ceil(curPoint.x - x) + ' ' + ceil(curPoint.y - y) + ' ' + ceil(nextPoint.x - x) + ' ' + ceil(nextPoint.y - y));
        x = nextPoint.x;
        y = nextPoint.y;
      } else {
        var x1 = (curPoint.x + nextPoint.x) / 2;
        var y1 = (curPoint.y + nextPoint.y) / 2;
        pathArr.push('q' + ceil(curPoint.x - x) + ' ' + ceil(curPoint.y - y) + ' ' + ceil(x1 - x) + ' ' + ceil(y1 - y));
        x = x1;
        y = y1;
      }
    }
  }
  pathArr.push('Z');
  return pathArr.join(' ');
}