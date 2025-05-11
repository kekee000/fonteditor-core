"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * @file 轮廓标记位
 * @author mengke01(kekee000@gmail.com)
 *
 * see:
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html
 */
var _default = exports.default = {
  ONCURVE: 0x01,
  // on curve ,off curve
  XSHORT: 0x02,
  // x-Short Vector
  YSHORT: 0x04,
  // y-Short Vector
  REPEAT: 0x08,
  // next byte is flag repeat count
  XSAME: 0x10,
  // This x is same (Positive x-Short vector)
  YSAME: 0x20,
  // This y is same (Positive y-Short vector)
  Reserved1: 0x40,
  Reserved2: 0x80
};