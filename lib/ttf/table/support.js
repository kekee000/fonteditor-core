"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _head = _interopRequireDefault(require("./head"));
var _maxp = _interopRequireDefault(require("./maxp"));
var _loca = _interopRequireDefault(require("./loca"));
var _cmap = _interopRequireDefault(require("./cmap"));
var _glyf = _interopRequireDefault(require("./glyf"));
var _name = _interopRequireDefault(require("./name"));
var _hhea = _interopRequireDefault(require("./hhea"));
var _hmtx = _interopRequireDefault(require("./hmtx"));
var _post = _interopRequireDefault(require("./post"));
var _OS = _interopRequireDefault(require("./OS2"));
var _fpgm = _interopRequireDefault(require("./fpgm"));
var _cvt = _interopRequireDefault(require("./cvt"));
var _prep = _interopRequireDefault(require("./prep"));
var _gasp = _interopRequireDefault(require("./gasp"));
var _GPOS = _interopRequireDefault(require("./GPOS"));
var _kern = _interopRequireDefault(require("./kern"));
var _kerx = _interopRequireDefault(require("./kerx"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file ttf读取和写入支持的表
 * @author mengke01(kekee000@gmail.com)
 */
var _default = exports.default = {
  head: _head.default,
  maxp: _maxp.default,
  loca: _loca.default,
  cmap: _cmap.default,
  glyf: _glyf.default,
  name: _name.default,
  hhea: _hhea.default,
  hmtx: _hmtx.default,
  post: _post.default,
  'OS/2': _OS.default,
  fpgm: _fpgm.default,
  cvt: _cvt.default,
  prep: _prep.default,
  gasp: _gasp.default,
  GPOS: _GPOS.default,
  kern: _kern.default,
  kerx: _kerx.default
};