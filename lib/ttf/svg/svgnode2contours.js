"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = svgnode2contours;
var _path2contours = _interopRequireDefault(require("./path2contours"));
var _oval2contour = _interopRequireDefault(require("./oval2contour"));
var _polygon2contour = _interopRequireDefault(require("./polygon2contour"));
var _rect2contour = _interopRequireDefault(require("./rect2contour"));
var _parseTransform = _interopRequireDefault(require("./parseTransform"));
var _contoursTransform = _interopRequireDefault(require("./contoursTransform"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file svg节点转字形轮廓
 * @author mengke01(kekee000@gmail.com)
 */

// 支持的解析器集合
var support = {
  path: {
    parse: _path2contours.default,
    // 解析器
    params: ['d'],
    // 参数列表
    contours: true // 是否是多个轮廓
  },
  circle: {
    parse: _oval2contour.default,
    params: ['cx', 'cy', 'r']
  },
  ellipse: {
    parse: _oval2contour.default,
    params: ['cx', 'cy', 'rx', 'ry']
  },
  rect: {
    parse: _rect2contour.default,
    params: ['x', 'y', 'width', 'height']
  },
  polygon: {
    parse: _polygon2contour.default,
    params: ['points']
  },
  polyline: {
    parse: _polygon2contour.default,
    params: ['points']
  }
};

/**
 * svg节点转字形轮廓
 *
 * @param {Array} xmlNodes xml节点集合
 * @return {Array|false} 轮廓数组
 */
function svgnode2contours(xmlNodes) {
  var i;
  var length;
  var j;
  var jlength;
  var segment; // 当前指令
  var parsedSegments = []; // 解析后的指令

  if (xmlNodes.length) {
    var _loop = function _loop() {
      var node = xmlNodes[i];
      var name = node.tagName;
      if (support[name]) {
        var supportParams = support[name].params;
        var params = [];
        for (j = 0, jlength = supportParams.length; j < jlength; j++) {
          params.push(node.getAttribute(supportParams[j]));
        }
        segment = {
          name: name,
          params: params,
          transform: (0, _parseTransform.default)(node.getAttribute('transform'))
        };
        if (node.parentNode) {
          var curNode = node.parentNode;
          var transforms = segment.transform || [];
          var transAttr;
          var iterator = function iterator(t) {
            transforms.unshift(t);
          };
          while (curNode !== null && curNode.tagName !== 'svg') {
            transAttr = curNode.getAttribute('transform');
            if (transAttr) {
              (0, _parseTransform.default)(transAttr).reverse().forEach(iterator);
            }
            curNode = curNode.parentNode;
          }
          segment.transform = transforms.length ? transforms : null;
        }
        parsedSegments.push(segment);
      }
    };
    for (i = 0, length = xmlNodes.length; i < length; i++) {
      _loop();
    }
  }
  if (parsedSegments.length) {
    var result = [];
    for (i = 0, length = parsedSegments.length; i < length; i++) {
      segment = parsedSegments[i];
      var parser = support[segment.name];
      var contour = parser.parse.apply(null, segment.params);
      if (contour && contour.length) {
        var contours = parser.contours ? contour : [contour];

        // 如果有变换则应用变换规则
        if (segment.transform) {
          contours = (0, _contoursTransform.default)(contours, segment.transform);
        }
        for (j = 0, jlength = contours.length; j < jlength; j++) {
          result.push(contours[j]);
        }
      }
    }
    return result;
  }
  return false;
}