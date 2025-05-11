"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _struct = _interopRequireDefault(require("./struct"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file maxp 表
 * @author mengke01(kekee000@gmail.com)
 */
var _default = exports.default = _table.default.create('maxp', [['version', _struct.default.Fixed], ['numGlyphs', _struct.default.Uint16], ['maxPoints', _struct.default.Uint16], ['maxContours', _struct.default.Uint16], ['maxCompositePoints', _struct.default.Uint16], ['maxCompositeContours', _struct.default.Uint16], ['maxZones', _struct.default.Uint16], ['maxTwilightPoints', _struct.default.Uint16], ['maxStorage', _struct.default.Uint16], ['maxFunctionDefs', _struct.default.Uint16], ['maxInstructionDefs', _struct.default.Uint16], ['maxStackElements', _struct.default.Uint16], ['maxSizeOfInstructions', _struct.default.Uint16], ['maxComponentElements', _struct.default.Uint16], ['maxComponentDepth', _struct.default.Int16]], {
  write: function write(writer, ttf) {
    _table.default.write.call(this, writer, ttf.support);
    return writer;
  },
  size: function size() {
    return 32;
  }
});