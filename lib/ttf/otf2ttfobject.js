"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = otf2ttfobject;
var _error = _interopRequireDefault(require("./error"));
var _otfreader = _interopRequireDefault(require("./otfreader"));
var _otfContours2ttfContours = _interopRequireDefault(require("./util/otfContours2ttfContours"));
var _computeBoundingBox = require("../graphics/computeBoundingBox");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } /**
 * @file otf格式转ttf格式对象
 * @author mengke01(kekee000@gmail.com)
 */
/**
 * otf格式转ttf格式对象
 *
 * @param  {ArrayBuffer|otfObject} otfBuffer 原始数据或者解析后的otf数据
 * @param  {Object} options   参数
 * @return {Object}          ttfObject对象
 */
function otf2ttfobject(otfBuffer, options) {
  var otfObject;
  if (otfBuffer instanceof ArrayBuffer) {
    var otfReader = new _otfreader.default(options);
    otfObject = otfReader.read(otfBuffer);
    otfReader.dispose();
  } else if (otfBuffer.head && otfBuffer.glyf && otfBuffer.cmap) {
    otfObject = otfBuffer;
  } else {
    _error.default.raise(10111);
  }

  // 转换otf轮廓
  otfObject.glyf.forEach(function (g) {
    g.contours = (0, _otfContours2ttfContours.default)(g.contours);
    var box = _computeBoundingBox.computePathBox.apply(void 0, _toConsumableArray(g.contours));
    if (box) {
      g.xMin = box.x;
      g.xMax = box.x + box.width;
      g.yMin = box.y;
      g.yMax = box.y + box.height;
      g.leftSideBearing = g.xMin;
    } else {
      g.xMin = 0;
      g.xMax = 0;
      g.yMin = 0;
      g.yMax = 0;
      g.leftSideBearing = 0;
    }
  });
  otfObject.version = 0x1;

  // 修改maxp相关配置
  otfObject.maxp.version = 1.0;
  otfObject.maxp.maxZones = otfObject.maxp.maxTwilightPoints ? 2 : 1;
  delete otfObject.CFF;
  delete otfObject.VORG;
  return otfObject;
}