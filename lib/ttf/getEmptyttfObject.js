"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getEmpty;
var _lang = require("../common/lang");
var _empty = _interopRequireDefault(require("./data/empty"));
var _default = _interopRequireDefault(require("./data/default"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 获取空的ttf对象
 * @author mengke01(kekee000@gmail.com)
 */

function getEmpty() {
  var ttf = (0, _lang.clone)(_empty.default);
  Object.assign(ttf.name, _default.default.name);
  ttf.head.created = ttf.head.modified = Date.now();
  return ttf;
}