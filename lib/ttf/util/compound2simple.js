"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compound2simple;
/**
 * @file 复合字形设置轮廓，转化为简单字形
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 复合字形转简单字形
 *
 * @param  {Object} glyf glyf对象
 * @param  {Array} contours 轮廓数组
 * @return {Object} 转换后对象
 */
function compound2simple(glyf, contours) {
  glyf.contours = contours;
  delete glyf.compound;
  delete glyf.glyfs;
  // 这里hinting信息会失效，删除hinting信息
  delete glyf.instructions;
  return glyf;
}