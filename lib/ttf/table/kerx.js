"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file kerx
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6kerx.html
 */
var _default = exports.default = _table.default.create('kerx', [], {
  read: function read(reader, ttf) {
    var length = ttf.tables.kerx.length;
    return reader.readBytes(this.offset, length);
  },
  write: function write(writer, ttf) {
    if (ttf.kerx) {
      writer.writeBytes(ttf.kerx, ttf.kerx.length);
    }
  },
  size: function size(ttf) {
    return ttf.kerx ? ttf.kerx.length : 0;
  }
});