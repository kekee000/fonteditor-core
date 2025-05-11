"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contoursTransform;
var _matrix = require("../../graphics/matrix");
var _pathTransform = _interopRequireDefault(require("../../graphics/pathTransform"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 根据transform参数变换轮廓
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 根据transform参数变换轮廓
 *
 * @param {Array} contours 轮廓集合
 * @param {Array} transforms 变换指令集合
 *     transforms = [{
 *         name: 'scale'
 *         params: [3,4]
 *     }]
 *
 * @return {Array} 变换后的轮廓数组
 */
function contoursTransform(contours, transforms) {
  if (!contours || !contours.length || !transforms || !transforms.length) {
    return contours;
  }
  var matrix = [1, 0, 0, 1, 0, 0];
  for (var i = 0, l = transforms.length; i < l; i++) {
    var transform = transforms[i];
    var params = transform.params;
    var radian = null;
    switch (transform.name) {
      case 'translate':
        matrix = (0, _matrix.mul)(matrix, [1, 0, 0, 1, params[0], params[1]]);
        break;
      case 'scale':
        matrix = (0, _matrix.mul)(matrix, [params[0], 0, 0, params[1], 0, 0]);
        break;
      case 'matrix':
        matrix = (0, _matrix.mul)(matrix, [params[0], params[1], params[2], params[3], params[4], params[5]]);
        break;
      case 'rotate':
        radian = params[0] * Math.PI / 180;
        if (params.length > 1) {
          matrix = (0, _matrix.multiply)(matrix, [1, 0, 0, 1, -params[1], -params[2]], [Math.cos(radian), Math.sin(radian), -Math.sin(radian), Math.cos(radian), 0, 0], [1, 0, 0, 1, params[1], params[2]]);
        } else {
          matrix = (0, _matrix.mul)(matrix, [Math.cos(radian), Math.sin(radian), -Math.sin(radian), Math.cos(radian), 0, 0]);
        }
        break;
      case 'skewX':
        matrix = (0, _matrix.mul)(matrix, [1, 0, Math.tan(params[0] * Math.PI / 180), 1, 0, 0]);
        break;
      case 'skewY':
        matrix = (0, _matrix.mul)(matrix, [1, Math.tan(params[0] * Math.PI / 180), 0, 1, 0, 0]);
        break;
    }
  }
  contours.forEach(function (p) {
    (0, _pathTransform.default)(p, matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
  });
  return contours;
}