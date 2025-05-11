"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = woff2tottf;
exports.woff2tottfasync = woff2tottfasync;
var _index = _interopRequireDefault(require("../../woff2/index"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file woff2 to ttf
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * ttf格式转换成woff2字体格式
 *
 * @param {ArrayBuffer} woff2Buffer ttf缓冲数组
 * @param {Object} options 选项
 *
 * @return {ArrayBuffer} woff格式byte流
 */
// eslint-disable-next-line no-unused-vars
function woff2tottf(woff2Buffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!_index.default.isInited()) {
    throw new Error('use woff2.init() to init woff2 module!');
  }
  var result = _index.default.decode(woff2Buffer);
  return result.buffer;
}

/**
 * ttf格式转换成woff2字体格式
 *
 * @param {ArrayBuffer} woff2Buffer ttf缓冲数组
 * @param {Object} options 选项
 *
 * @return {Promise.<ArrayBuffer>} woff格式byte流
 */
function woff2tottfasync(woff2Buffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.init(options.wasmUrl).then(function () {
    var result = _index.default.decode(woff2Buffer);
    return result.buffer;
  });
}