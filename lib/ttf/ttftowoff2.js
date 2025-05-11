"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ttftowoff2;
exports.ttftowoff2async = ttftowoff2async;
var _index = _interopRequireDefault(require("../../woff2/index"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file ttf to woff2
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * ttf格式转换成woff2字体格式
 *
 * @param {ArrayBuffer} ttfBuffer ttf缓冲数组
 * @param {Object} options 选项
 *
 * @return {Promise.<ArrayBuffer>} woff格式byte流
 */
// eslint-disable-next-line no-unused-vars
function ttftowoff2(ttfBuffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!_index.default.isInited()) {
    throw new Error('use woff2.init() to init woff2 module!');
  }
  var result = _index.default.encode(ttfBuffer);
  return result.buffer;
}

/**
 * ttf格式转换成woff2字体格式
 *
 * @param {ArrayBuffer} ttfBuffer ttf缓冲数组
 * @param {Object} options 选项
 *
 * @return {Promise.<ArrayBuffer>} woff格式byte流
 */
function ttftowoff2async(ttfBuffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.init(options.wasmUrl).then(function () {
    var result = _index.default.encode(ttfBuffer);
    return result.buffer;
  });
}