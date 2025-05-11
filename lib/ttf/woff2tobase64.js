"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = woff2tobase64;
var _bytes2base = _interopRequireDefault(require("./util/bytes2base64"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file woff2数组转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * woff数组转base64编码
 *
 * @param {Array} arrayBuffer ArrayBuffer对象
 * @return {string} base64编码
 */
function woff2tobase64(arrayBuffer) {
  return 'data:font/woff2;charset=utf-8;base64,' + (0, _bytes2base.default)(arrayBuffer);
}