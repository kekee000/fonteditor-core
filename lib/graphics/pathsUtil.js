"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _computeBoundingBox = require("./computeBoundingBox");
var _pathAdjust = _interopRequireDefault(require("./pathAdjust"));
var _pathRotate = _interopRequireDefault(require("./pathRotate"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } /**
 * @file 路径组变化函数
 * @author mengke01(kekee000@gmail.com)
 */
/**
 * 翻转路径
 *
 * @param {Array} paths 路径数组
 * @param {number} xScale x翻转
 * @param {number} yScale y翻转
 * @return {Array} 变换后的路径
 */
function mirrorPaths(paths, xScale, yScale) {
  var _computePath = _computeBoundingBox.computePath.apply(void 0, _toConsumableArray(paths)),
    x = _computePath.x,
    y = _computePath.y,
    width = _computePath.width,
    height = _computePath.height;
  if (xScale === -1) {
    paths.forEach(function (p) {
      (0, _pathAdjust.default)(p, -1, 1, -x, 0);
      (0, _pathAdjust.default)(p, 1, 1, x + width, 0);
      p.reverse();
    });
  }
  if (yScale === -1) {
    paths.forEach(function (p) {
      (0, _pathAdjust.default)(p, 1, -1, 0, -y);
      (0, _pathAdjust.default)(p, 1, 1, 0, y + height);
      p.reverse();
    });
  }
  return paths;
}
var _default = exports.default = {
  /**
   * 旋转路径
   *
   * @param {Array} paths 路径数组
   * @param {number} angle 弧度
   * @return {Array} 变换后的路径
   */
  rotate: function rotate(paths, angle) {
    if (!angle) {
      return paths;
    }
    var bound = _computeBoundingBox.computePath.apply(void 0, _toConsumableArray(paths));
    var cx = bound.x + bound.width / 2;
    var cy = bound.y + bound.height / 2;
    paths.forEach(function (p) {
      (0, _pathRotate.default)(p, angle, cx, cy);
    });
    return paths;
  },
  /**
   * 路径组变换
   *
   * @param {Array} paths 路径数组
   * @param {number} x x 方向缩放
   * @param {number} y y 方向缩放
   * @return {Array} 变换后的路径
   */
  move: function move(paths, x, y) {
    var bound = _computeBoundingBox.computePath.apply(void 0, _toConsumableArray(paths));
    paths.forEach(function (path) {
      (0, _pathAdjust.default)(path, 1, 1, x - bound.x, y - bound.y);
    });
    return paths;
  },
  mirror: function mirror(paths) {
    return mirrorPaths(paths, -1, 1);
  },
  flip: function flip(paths) {
    return mirrorPaths(paths, 1, -1);
  }
};