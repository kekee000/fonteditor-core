"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = svg2base64;
/**
 * @file svg字符串转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * svg字符串转base64编码
 *
 * @param {string} svg svg对象
 * @param {string} scheme  头部
 * @return {string} base64编码
 */
function svg2base64(svg) {
  var scheme = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'font/svg';
  if (typeof btoa === 'undefined') {
    return 'data:' + scheme + ';charset=utf-8;base64,' + Buffer.from(svg, 'binary').toString('base64');
  }
  return 'data:' + scheme + ';charset=utf-8;base64,' + btoa(svg);
}