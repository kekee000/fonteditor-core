"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ttf2base64;
var _bytes2base = _interopRequireDefault(require("./util/bytes2base64"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file ttf数组转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * ttf数组转base64编码
 *
 * @param {Array} arrayBuffer ArrayBuffer对象
 * @return {string} base64编码
 */
function ttf2base64(arrayBuffer) {
  return 'data:font/ttf;charset=utf-8;base64,' + (0, _bytes2base.default)(arrayBuffer);
}