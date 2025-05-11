"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _parse = _interopRequireDefault(require("./cmap/parse"));
var _write = _interopRequireDefault(require("./cmap/write"));
var _sizeof = _interopRequireDefault(require("./cmap/sizeof"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file cmap 表
 * @author mengke01(kekee000@gmail.com)
 *
 * @see
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
 */
var _default = exports.default = _table.default.create('cmap', [], {
  write: _write.default,
  read: _parse.default,
  size: _sizeof.default
});