"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ttf2svg;
var _string = _interopRequireDefault(require("../common/string"));
var _string2 = _interopRequireDefault(require("./util/string"));
var _ttfreader = _interopRequireDefault(require("./ttfreader"));
var _contours2svg = _interopRequireDefault(require("./util/contours2svg"));
var _unicode2xml = _interopRequireDefault(require("./util/unicode2xml"));
var _error = _interopRequireDefault(require("./error"));
var _default = _interopRequireDefault(require("./data/default"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file ttf转svg
 * @author mengke01(kekee000@gmail.com)
 *
 * references:
 * http://www.w3.org/TR/SVG11/fonts.html
 */

// svg font id
var SVG_FONT_ID = _default.default.fontId;

// xml 模板
/* eslint-disable no-multi-spaces */
var XML_TPL = '' + '<?xml version="1.0" standalone="no"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >' + '<svg xmlns="http://www.w3.org/2000/svg">' + '<metadata>${metadata}</metadata>' + '<defs><font id="${id}" horiz-adv-x="${advanceWidth}">' + '<font-face font-family="${fontFamily}" font-weight="${fontWeight}" font-stretch="normal"' + ' units-per-em="${unitsPerEm}" panose-1="${panose}" ascent="${ascent}" descent="${descent}"' + ' x-height="${xHeight}" bbox="${bbox}" underline-thickness="${underlineThickness}"' + ' underline-position="${underlinePosition}" unicode-range="${unicodeRange}" />' + '<missing-glyph horiz-adv-x="${missing.advanceWidth}" ${missing.d} />' + '${glyphList}' + '</font></defs>' + '</svg>';
/* eslint-enable no-multi-spaces */
// glyph 模板
var GLYPH_TPL = '<glyph glyph-name="${name}" unicode="${unicode}" d="${d}" />';

/**
 * ttf数据结构转svg
 *
 * @param {ttfObject} ttf ttfObject对象
 * @param {Object} options 选项
 * @param {string} options.metadata 字体相关的信息
 * @return {string} svg字符串
 */
function ttfobject2svg(ttf, options) {
  var OS2 = ttf['OS/2'];

  // 用来填充xml的数据
  var xmlObject = {
    id: ttf.name.uniqueSubFamily || SVG_FONT_ID,
    metadata: _string.default.encodeHTML(options.metadata || ''),
    advanceWidth: ttf.hhea.advanceWidthMax,
    fontFamily: ttf.name.fontFamily,
    fontWeight: OS2.usWeightClass,
    unitsPerEm: ttf.head.unitsPerEm,
    panose: [OS2.bFamilyType, OS2.bSerifStyle, OS2.bWeight, OS2.bProportion, OS2.bContrast, OS2.bStrokeVariation, OS2.bArmStyle, OS2.bLetterform, OS2.bMidline, OS2.bXHeight].join(' '),
    ascent: ttf.hhea.ascent,
    descent: ttf.hhea.descent,
    xHeight: OS2.bXHeight,
    bbox: [ttf.head.xMin, ttf.head.yMin, ttf.head.xMax, ttf.head.yMax].join(' '),
    underlineThickness: ttf.post.underlineThickness,
    underlinePosition: ttf.post.underlinePosition,
    unicodeRange: 'U+' + _string.default.pad(OS2.usFirstCharIndex.toString(16), 4) + '-' + _string.default.pad(OS2.usLastCharIndex.toString(16), 4)
  };

  // glyf 第一个为missing glyph
  xmlObject.missing = {};
  xmlObject.missing.advanceWidth = ttf.glyf[0].advanceWidth || 0;
  xmlObject.missing.d = ttf.glyf[0].contours && ttf.glyf[0].contours.length ? 'd="' + (0, _contours2svg.default)(ttf.glyf[0].contours) + '"' : '';

  // glyf 信息
  var glyphList = '';
  for (var i = 1, l = ttf.glyf.length; i < l; i++) {
    var glyf = ttf.glyf[i];

    // 筛选简单字形，并且有轮廓，有编码
    if (!glyf.compound && glyf.contours && glyf.unicode && glyf.unicode.length) {
      var glyfObject = {
        name: _string2.default.escape(glyf.name),
        unicode: (0, _unicode2xml.default)(glyf.unicode),
        d: (0, _contours2svg.default)(glyf.contours)
      };
      glyphList += _string.default.format(GLYPH_TPL, glyfObject);
    }
  }
  xmlObject.glyphList = glyphList;
  return _string.default.format(XML_TPL, xmlObject);
}

/**
 * ttf格式转换成svg字体格式
 *
 * @param {ArrayBuffer|ttfObject} ttfBuffer ttf缓冲数组或者ttfObject对象
 * @param {Object} options 选项
 * @param {Object} options.metadata 字体相关的信息
 *
 * @return {string} svg字符串
 */
function ttf2svg(ttfBuffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // 读取ttf二进制流
  if (ttfBuffer instanceof ArrayBuffer) {
    var reader = new _ttfreader.default();
    var ttfObject = reader.read(ttfBuffer);
    reader.dispose();
    return ttfobject2svg(ttfObject, options);
  }
  // 读取ttfObject
  else if (ttfBuffer.version && ttfBuffer.glyf) {
    return ttfobject2svg(ttfBuffer, options);
  }
  _error.default.raise(10109);
}