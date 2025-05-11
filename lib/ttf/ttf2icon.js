"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ttf2icon;
var _ttfreader = _interopRequireDefault(require("./ttfreader"));
var _error = _interopRequireDefault(require("./error"));
var _default = _interopRequireDefault(require("./data/default"));
var _ttf2symbol = require("./ttf2symbol");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file ttf转icon
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * listUnicode
 *
 * @param  {Array} unicode unicode
 * @return {string}         unicode string
 */
function listUnicode(unicode) {
  return unicode.map(function (u) {
    return '\\' + u.toString(16);
  }).join(',');
}

/**
 * ttf数据结构转icon数据结构
 *
 * @param {ttfObject} ttf ttfObject对象
 * @param {Object} options 选项
 * @param {Object} options.metadata 字体相关的信息
 * @param {Object} options.iconPrefix icon 前缀
 * @return {Object} icon obj
 */
function ttfobject2icon(ttf) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var glyfList = [];

  // glyf 信息
  var filtered = ttf.glyf.filter(function (g) {
    return g.name !== '.notdef' && g.name !== '.null' && g.name !== 'nonmarkingreturn' && g.unicode && g.unicode.length;
  });
  filtered.forEach(function (g, i) {
    glyfList.push({
      code: '&#x' + g.unicode[0].toString(16) + ';',
      codeName: listUnicode(g.unicode),
      name: g.name,
      id: (0, _ttf2symbol.getSymbolId)(g, i)
    });
  });
  return {
    fontFamily: ttf.name.fontFamily || _default.default.name.fontFamily,
    iconPrefix: options.iconPrefix || 'icon',
    glyfList: glyfList
  };
}

/**
 * ttf格式转换成icon
 *
 * @param {ArrayBuffer|ttfObject} ttfBuffer ttf缓冲数组或者ttfObject对象
 * @param {Object} options 选项
 * @param {Object} options.metadata 字体相关的信息
 *
 * @return {Object} icon object
 */
function ttf2icon(ttfBuffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // 读取ttf二进制流
  if (ttfBuffer instanceof ArrayBuffer) {
    var reader = new _ttfreader.default();
    var ttfObject = reader.read(ttfBuffer);
    reader.dispose();
    return ttfobject2icon(ttfObject, options);
  }
  // 读取ttfObject
  else if (ttfBuffer.version && ttfBuffer.glyf) {
    return ttfobject2icon(ttfBuffer, options);
  }
  _error.default.raise(10101);
}