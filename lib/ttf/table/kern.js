"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file kern
 * @author fr33z00(https://github.com/fr33z00)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6kern.html
 */
var _default = exports.default = _table.default.create('kern', [], {
  read: function read(reader, ttf) {
    var length = ttf.tables.kern.length;
    return reader.readBytes(this.offset, length);
  },
  write: function write(writer, ttf) {
    if (ttf.kern) {
      writer.writeBytes(ttf.kern, ttf.kern.length);
    }
  },
  size: function size(ttf) {
    return ttf.kern ? ttf.kern.length : 0;
  }
});