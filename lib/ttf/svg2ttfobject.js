"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = svg2ttfObject;
var _string = _interopRequireDefault(require("../common/string"));
var _DOMParser = _interopRequireDefault(require("../common/DOMParser"));
var _path2contours = _interopRequireDefault(require("./svg/path2contours"));
var _svgnode2contours = _interopRequireDefault(require("./svg/svgnode2contours"));
var _computeBoundingBox = require("../graphics/computeBoundingBox");
var _pathsUtil = _interopRequireDefault(require("../graphics/pathsUtil"));
var _glyfAdjust = _interopRequireDefault(require("./util/glyfAdjust"));
var _error = _interopRequireDefault(require("./error"));
var _getEmptyttfObject = _interopRequireDefault(require("./getEmptyttfObject"));
var _reduceGlyf = _interopRequireDefault(require("./util/reduceGlyf"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } /**
 * @file svg格式转ttfObject格式
 * @author mengke01(kekee000@gmail.com)
 */
/**
 * 加载xml字符串
 *
 * @param {string} xml xml字符串
 * @return {Document}
 */
function loadXML(xml) {
  if (_DOMParser.default) {
    try {
      var domParser = new _DOMParser.default();
      var xmlDoc = domParser.parseFromString(xml, 'text/xml');
      return xmlDoc;
    } catch (exp) {
      _error.default.raise(10103);
    }
  }
  _error.default.raise(10004);
}

/**
 * 对xml文本进行处理
 *
 * @param  {string} svg svg文本
 * @return {string} 处理后文本
 */
function resolveSVG(svg) {
  // 去除xmlns，防止xmlns导致svg解析错误
  svg = svg.replace(/\s+xmlns(?::[\w-]+)?=("|')[^"']*\1/g, ' ').replace(/<defs[>\s][\s\S]+?\/defs>/g, function (text) {
    if (text.indexOf('</font>') >= 0) {
      return text;
    }
    return '';
  }).replace(/<use[>\s][\s\S]+?\/use>/g, '');
  return svg;
}

/**
 * 获取空的ttf格式对象
 *
 * @return {Object} ttfObject对象
 */
function getEmptyTTF() {
  var ttf = (0, _getEmptyttfObject.default)();
  ttf.head.unitsPerEm = 0; // 去除unitsPerEm以便于重新计算
  ttf.from = 'svgfont';
  return ttf;
}

/**
 * 获取空的对象，用来作为ttf的容器
 *
 * @return {Object} ttfObject对象
 */
function getEmptyObject() {
  return {
    'from': 'svg',
    'OS/2': {},
    'name': {},
    'hhea': {},
    'head': {},
    'post': {},
    'glyf': []
  };
}

/**
 * 根据边界获取unitsPerEm
 *
 * @param {number} xMin x最小值
 * @param {number} xMax x最大值
 * @param {number} yMin y最小值
 * @param {number} yMax y最大值
 * @return {number}
 */
function getUnitsPerEm(xMin, xMax, yMin, yMax) {
  var seed = Math.ceil(Math.min(yMax - yMin, xMax - xMin));
  if (!seed) {
    return 1024;
  }
  if (seed <= 128) {
    return seed;
  }

  // 获取合适的unitsPerEm
  var unitsPerEm = 128;
  while (unitsPerEm < 16384) {
    if (seed <= 1.2 * unitsPerEm) {
      return unitsPerEm;
    }
    unitsPerEm <<= 1;
  }
  return 1024;
}

/**
 * 对ttfObject进行处理，去除小数
 *
 * @param {Object} ttf ttfObject
 * @return {Object} ttfObject
 */
function resolve(ttf) {
  // 如果是svg格式字体，则去小数
  // 由于svg格式导入时候会出现字形重复问题，这里进行优化
  if (ttf.from === 'svgfont' && ttf.head.unitsPerEm > 128) {
    ttf.glyf.forEach(function (g) {
      if (g.contours) {
        (0, _glyfAdjust.default)(g);
        (0, _reduceGlyf.default)(g);
      }
    });
  }
  // 否则重新计算字形大小，缩放到1024的em
  else {
    var xMin = 16384;
    var xMax = -16384;
    var yMin = 16384;
    var yMax = -16384;
    ttf.glyf.forEach(function (g) {
      if (g.contours) {
        var bound = _computeBoundingBox.computePathBox.apply(void 0, _toConsumableArray(g.contours));
        if (bound) {
          xMin = Math.min(xMin, bound.x);
          xMax = Math.max(xMax, bound.x + bound.width);
          yMin = Math.min(yMin, bound.y);
          yMax = Math.max(yMax, bound.y + bound.height);
        }
      }
    });
    var unitsPerEm = getUnitsPerEm(xMin, xMax, yMin, yMax);
    var scale = 1024 / unitsPerEm;
    ttf.glyf.forEach(function (g) {
      (0, _glyfAdjust.default)(g, scale, scale);
      (0, _reduceGlyf.default)(g);
    });
    ttf.head.unitsPerEm = 1024;
  }
  return ttf;
}

/**
 * 解析字体信息相关节点
 *
 * @param {Document} xmlDoc XML文档对象
 * @param {Object} ttf ttf对象
 * @return {Object} ttf对象
 */
function parseFont(xmlDoc, ttf) {
  var metaNode = xmlDoc.getElementsByTagName('metadata')[0];
  var fontNode = xmlDoc.getElementsByTagName('font')[0];
  var fontFaceNode = xmlDoc.getElementsByTagName('font-face')[0];
  if (metaNode && metaNode.textContent) {
    ttf.metadata = _string.default.decodeHTML(metaNode.textContent.trim());
  }

  // 解析font，如果有font节点说明是svg格式字体文件
  if (fontNode) {
    ttf.id = fontNode.getAttribute('id') || '';
    ttf.hhea.advanceWidthMax = +(fontNode.getAttribute('horiz-adv-x') || 0);
    ttf.from = 'svgfont';
  }
  if (fontFaceNode) {
    var OS2 = ttf['OS/2'];
    ttf.name.fontFamily = fontFaceNode.getAttribute('font-family') || '';
    OS2.usWeightClass = +(fontFaceNode.getAttribute('font-weight') || 0);
    ttf.head.unitsPerEm = +(fontFaceNode.getAttribute('units-per-em') || 0);

    // 解析panose, eg: 2 0 6 3 0 0 0 0 0 0
    var panose = (fontFaceNode.getAttribute('panose-1') || '').split(' ');
    ['bFamilyType', 'bSerifStyle', 'bWeight', 'bProportion', 'bContrast', 'bStrokeVariation', 'bArmStyle', 'bLetterform', 'bMidline', 'bXHeight'].forEach(function (name, i) {
      OS2[name] = +(panose[i] || 0);
    });
    ttf.hhea.ascent = +(fontFaceNode.getAttribute('ascent') || 0);
    ttf.hhea.descent = +(fontFaceNode.getAttribute('descent') || 0);
    OS2.bXHeight = +(fontFaceNode.getAttribute('x-height') || 0);

    // 解析bounding
    var box = (fontFaceNode.getAttribute('bbox') || '').split(' ');
    ['xMin', 'yMin', 'xMax', 'yMax'].forEach(function (name, i) {
      ttf.head[name] = +(box[i] || '');
    });
    ttf.post.underlineThickness = +(fontFaceNode.getAttribute('underline-thickness') || 0);
    ttf.post.underlinePosition = +(fontFaceNode.getAttribute('underline-position') || 0);

    // unicode range
    var unicodeRange = fontFaceNode.getAttribute('unicode-range');
    if (unicodeRange) {
      unicodeRange.replace(/u\+([0-9A-Z]+)(-[0-9A-Z]+)?/i, function ($0, a, b) {
        OS2.usFirstCharIndex = Number('0x' + a);
        OS2.usLastCharIndex = b ? Number('0x' + b.slice(1)) : 0xFFFFFFFF;
      });
    }
  }
  return ttf;
}

/**
 * 解析字体信息相关节点
 *
 * @param {Document} xmlDoc XML文档对象
 * @param {Object} ttf ttf对象
 * @return {Object} ttf对象
 */
function parseGlyf(xmlDoc, ttf) {
  var missingNode = xmlDoc.getElementsByTagName('missing-glyph')[0];

  // 解析glyf
  var d;
  var unicode;
  if (missingNode) {
    var missing = {
      name: '.notdef'
    };
    if (missingNode.getAttribute('horiz-adv-x')) {
      missing.advanceWidth = +missingNode.getAttribute('horiz-adv-x');
    }
    if (d = missingNode.getAttribute('d')) {
      missing.contours = (0, _path2contours.default)(d);
    }

    // 去除默认的空字形
    if (ttf.glyf[0] && ttf.glyf[0].name === '.notdef') {
      ttf.glyf.splice(0, 1);
    }
    ttf.glyf.unshift(missing);
  }
  var glyfNodes = xmlDoc.getElementsByTagName('glyph');
  if (glyfNodes.length) {
    for (var i = 0, l = glyfNodes.length; i < l; i++) {
      var node = glyfNodes[i];
      var glyf = {
        name: node.getAttribute('glyph-name') || node.getAttribute('name') || ''
      };
      if (node.getAttribute('horiz-adv-x')) {
        glyf.advanceWidth = +node.getAttribute('horiz-adv-x');
      }
      if (unicode = node.getAttribute('unicode')) {
        var nextUnicode = [];
        var totalCodePoints = 0;
        for (var ui = 0; ui < unicode.length; ui++) {
          var ucp = unicode.codePointAt(ui);
          nextUnicode.push(ucp);
          ui = ucp > 0xffff ? ui + 1 : ui;
          totalCodePoints += 1;
        }
        if (totalCodePoints === 1) {
          // TTF can't handle ligatures
          glyf.unicode = nextUnicode;
          if (d = node.getAttribute('d')) {
            glyf.contours = (0, _path2contours.default)(d);
          }
          ttf.glyf.push(glyf);
        }
      }
    }
  }
  return ttf;
}

/**
 * 解析字体信息相关节点
 *
 * @param {Document} xmlDoc XML文档对象
 * @param {Object} ttf ttf对象
 */
function parsePath(xmlDoc, ttf) {
  // 单个path组成一个glfy字形
  var contours;
  var glyf;
  var node;
  var pathNodes = xmlDoc.getElementsByTagName('path');
  if (pathNodes.length) {
    for (var i = 0, l = pathNodes.length; i < l; i++) {
      node = pathNodes[i];
      glyf = {
        name: node.getAttribute('name') || ''
      };
      contours = (0, _svgnode2contours.default)([node]);
      glyf.contours = contours;
      ttf.glyf.push(glyf);
    }
  }

  // 其他svg指令组成一个glyf字形
  contours = (0, _svgnode2contours.default)(Array.prototype.slice.call(xmlDoc.getElementsByTagName('*')).filter(function (node) {
    return node.tagName !== 'path';
  }));
  if (contours) {
    glyf = {
      name: ''
    };
    glyf.contours = contours;
    ttf.glyf.push(glyf);
  }
}

/**
 * 解析xml文档
 *
 * @param {Document} xmlDoc XML文档对象
 * @param {Object} options 导入选项
 *
 * @return {Object} 解析后对象
 */
function parseXML(xmlDoc, options) {
  if (!xmlDoc.getElementsByTagName('svg').length) {
    _error.default.raise(10106);
  }
  var ttf;

  // 如果是svg字体格式，则解析glyf，否则解析path
  if (xmlDoc.getElementsByTagName('font')[0]) {
    ttf = getEmptyTTF();
    parseFont(xmlDoc, ttf);
    parseGlyf(xmlDoc, ttf);
  } else {
    ttf = getEmptyObject();
    parsePath(xmlDoc, ttf);
  }
  if (!ttf.glyf.length) {
    _error.default.raise(10201);
  }
  if (ttf.from === 'svg') {
    var glyf = ttf.glyf;
    var i;
    var l;
    // 合并导入的字形为单个字形
    if (options.combinePath) {
      var combined = [];
      for (i = 0, l = glyf.length; i < l; i++) {
        var contours = glyf[i].contours;
        for (var index = 0, length = contours.length; index < length; index++) {
          combined.push(contours[index]);
        }
      }
      glyf[0].contours = combined;
      glyf.splice(1);
    }

    // 对字形进行反转
    for (i = 0, l = glyf.length; i < l; i++) {
      // 这里为了使ai等工具里面的字形方便导入，对svg做了反向处理
      glyf[i].contours = _pathsUtil.default.flip(glyf[i].contours);
    }
  }
  return ttf;
}

/**
 * svg格式转ttfObject格式
 *
 * @param {string|Document} svg svg格式
 * @param {Object=} options 导入选项
 * @param {boolean} options.combinePath 是否合并成单个字形，仅限于普通svg导入
 * @return {Object} ttfObject
 */
function svg2ttfObject(svg) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    combinePath: false
  };
  var xmlDoc = svg;
  if (typeof svg === 'string') {
    svg = resolveSVG(svg);
    xmlDoc = loadXML(svg);
  }
  var ttf = parseXML(xmlDoc, options);
  return resolve(ttf);
}