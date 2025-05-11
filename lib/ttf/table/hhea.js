"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _struct = _interopRequireDefault(require("./struct"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file hhea 表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hhea.html
 */
var _default = exports.default = _table.default.create('hhea', [['version', _struct.default.Fixed], ['ascent', _struct.default.Int16], ['descent', _struct.default.Int16], ['lineGap', _struct.default.Int16], ['advanceWidthMax', _struct.default.Uint16], ['minLeftSideBearing', _struct.default.Int16], ['minRightSideBearing', _struct.default.Int16], ['xMaxExtent', _struct.default.Int16], ['caretSlopeRise', _struct.default.Int16], ['caretSlopeRun', _struct.default.Int16], ['caretOffset', _struct.default.Int16], ['reserved0', _struct.default.Int16], ['reserved1', _struct.default.Int16], ['reserved2', _struct.default.Int16], ['reserved3', _struct.default.Int16], ['metricDataFormat', _struct.default.Int16], ['numOfLongHorMetrics', _struct.default.Uint16]]);