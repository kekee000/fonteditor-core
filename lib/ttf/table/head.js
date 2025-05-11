"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _struct = _interopRequireDefault(require("./struct"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file head表
 * @author mengke01(kekee000@gmail.com)
 */
var _default = exports.default = _table.default.create('head', [['version', _struct.default.Fixed], ['fontRevision', _struct.default.Fixed], ['checkSumAdjustment', _struct.default.Uint32], ['magickNumber', _struct.default.Uint32], ['flags', _struct.default.Uint16], ['unitsPerEm', _struct.default.Uint16], ['created', _struct.default.LongDateTime], ['modified', _struct.default.LongDateTime], ['xMin', _struct.default.Int16], ['yMin', _struct.default.Int16], ['xMax', _struct.default.Int16], ['yMax', _struct.default.Int16], ['macStyle', _struct.default.Uint16], ['lowestRecPPEM', _struct.default.Uint16], ['fontDirectionHint', _struct.default.Int16], ['indexToLocFormat', _struct.default.Int16], ['glyphDataFormat', _struct.default.Int16]]);