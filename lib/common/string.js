"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * @file 字符串相关的函数
 * @author mengke01(kekee000@gmail.com)
 */
var _default = exports.default = {
  /**
   * HTML解码字符串
   *
   * @param {string} source 源字符串
   * @return {string}
   */
  decodeHTML: function decodeHTML(source) {
    var str = String(source).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    // 处理转义的中文和实体字符
    return str.replace(/&#([\d]+);/g, function ($0, $1) {
      return String.fromCodePoint(parseInt($1, 10));
    });
  },
  /**
   * HTML编码字符串
   *
   * @param {string} source 源字符串
   * @return {string}
   */
  encodeHTML: function encodeHTML(source) {
    return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },
  /**
   * 获取string字节长度
   *
   * @param {string} source 源字符串
   * @return {number} 长度
   */
  getLength: function getLength(source) {
    // eslint-disable-next-line no-control-regex
    return String(source).replace(/[^\x00-\xff]/g, '11').length;
  },
  /**
   * 字符串格式化，支持如 ${xxx.xxx} 的语法
   *
   * @param {string} source 模板字符串
   * @param {Object} data 数据
   * @return {string} 格式化后字符串
   */
  format: function format(source, data) {
    return source.replace(/\$\{([\w.]+)\}/g, function ($0, $1) {
      var ref = $1.split('.');
      var refObject = data;
      var level;
      while (refObject != null && (level = ref.shift())) {
        refObject = refObject[level];
      }
      return refObject != null ? refObject : '';
    });
  },
  /**
   * 使用指定字符填充字符串,默认`0`
   *
   * @param {string} str 字符串
   * @param {number} size 填充到的大小
   * @param {string=} ch 填充字符
   * @return {string} 字符串
   */
  pad: function pad(str, size, ch) {
    str = String(str);
    if (str.length > size) {
      return str.slice(str.length - size);
    }
    return new Array(size - str.length + 1).join(ch || '0') + str;
  },
  /**
   * 获取字符串哈希编码
   *
   * @param {string} str 字符串
   * @return {number} 哈希值
   */
  hashcode: function hashcode(str) {
    if (!str) {
      return 0;
    }
    var hash = 0;
    for (var i = 0, l = str.length; i < l; i++) {
      hash = 0x7FFFFFFFF & hash * 31 + str.charCodeAt(i);
    }
    return hash;
  }
};