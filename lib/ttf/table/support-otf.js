"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _head = _interopRequireDefault(require("./head"));
var _maxp = _interopRequireDefault(require("./maxp"));
var _cmap = _interopRequireDefault(require("./cmap"));
var _name = _interopRequireDefault(require("./name"));
var _hhea = _interopRequireDefault(require("./hhea"));
var _hmtx = _interopRequireDefault(require("./hmtx"));
var _post = _interopRequireDefault(require("./post"));
var _OS = _interopRequireDefault(require("./OS2"));
var _CFF = _interopRequireDefault(require("./CFF"));
var _GPOS = _interopRequireDefault(require("./GPOS"));
var _kern = _interopRequireDefault(require("./kern"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file otf字体格式支持的表
 * @author mengke01(kekee000@gmail.com)
 */
var _default = exports.default = {
  head: _head.default,
  maxp: _maxp.default,
  cmap: _cmap.default,
  name: _name.default,
  hhea: _hhea.default,
  hmtx: _hmtx.default,
  post: _post.default,
  'OS/2': _OS.default,
  CFF: _CFF.default,
  GPOS: _GPOS.default,
  kern: _kern.default
};