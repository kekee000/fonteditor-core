"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _struct = _interopRequireDefault(require("./struct"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file loca表
 * @author mengke01(kekee000@gmail.com)
 */
var _default = exports.default = _table.default.create('loca', [], {
  read: function read(reader, ttf) {
    var offset = this.offset;
    var indexToLocFormat = ttf.head.indexToLocFormat;
    // indexToLocFormat有2字节和4字节的区别
    var type = _struct.default.names[indexToLocFormat === 0 ? _struct.default.Uint16 : _struct.default.Uint32];
    var size = indexToLocFormat === 0 ? 2 : 4; // 字节大小
    var sizeRatio = indexToLocFormat === 0 ? 2 : 1; // 真实地址偏移
    var wordOffset = [];
    reader.seek(offset);
    var numGlyphs = ttf.maxp.numGlyphs;
    for (var i = 0; i < numGlyphs; ++i) {
      wordOffset.push(reader.read(type, offset, false) * sizeRatio);
      offset += size;
    }
    return wordOffset;
  },
  write: function write(writer, ttf) {
    var glyfSupport = ttf.support.glyf;
    var offset = ttf.support.glyf.offset || 0;
    var indexToLocFormat = ttf.head.indexToLocFormat;
    var sizeRatio = indexToLocFormat === 0 ? 0.5 : 1;
    var numGlyphs = ttf.glyf.length;
    for (var i = 0; i < numGlyphs; ++i) {
      if (indexToLocFormat) {
        writer.writeUint32(offset);
      } else {
        writer.writeUint16(offset);
      }
      offset += glyfSupport[i].size * sizeRatio;
    }

    // write extra
    if (indexToLocFormat) {
      writer.writeUint32(offset);
    } else {
      writer.writeUint16(offset);
    }
    return writer;
  },
  size: function size(ttf) {
    var locaCount = ttf.glyf.length + 1;
    return ttf.head.indexToLocFormat ? locaCount * 4 : locaCount * 2;
  }
});