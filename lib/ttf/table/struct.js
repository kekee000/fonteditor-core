"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * @file ttf基本数据结构
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6.html
 */

var struct = {
  Int8: 1,
  Uint8: 2,
  Int16: 3,
  Uint16: 4,
  Int32: 5,
  Uint32: 6,
  Fixed: 7,
  // 32-bit signed fixed-point number (16.16)
  FUnit: 8,
  // Smallest measurable distance in the em space
  // 16-bit signed fixed number with the low 14 bits of fraction
  F2Dot14: 11,
  // The long internal format of a date in seconds since 12:00 midnight,
  // January 1, 1904. It is represented as a signed 64-bit integer.
  LongDateTime: 12,
  // extend data type
  Char: 13,
  String: 14,
  Bytes: 15,
  Uint24: 20
};

// 反转名字查找
var names = {};
Object.keys(struct).forEach(function (key) {
  names[struct[key]] = key;
});
struct.names = names;
var _default = exports.default = struct;