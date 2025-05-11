"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file directory 表, 读取和写入ttf表索引
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6.html
 */
var _default = exports.default = _table.default.create('directory', [], {
  read: function read(reader, ttf) {
    var tables = {};
    var numTables = ttf.numTables;
    var offset = this.offset;
    for (var i = offset, l = numTables * 16; i < l; i += 16) {
      var name = reader.readString(i, 4).trim();
      tables[name] = {
        name: name,
        checkSum: reader.readUint32(i + 4),
        offset: reader.readUint32(i + 8),
        length: reader.readUint32(i + 12)
      };
    }
    return tables;
  },
  write: function write(writer, ttf) {
    var tables = ttf.support.tables;
    for (var i = 0, l = tables.length; i < l; i++) {
      writer.writeString((tables[i].name + '    ').slice(0, 4));
      writer.writeUint32(tables[i].checkSum);
      writer.writeUint32(tables[i].offset);
      writer.writeUint32(tables[i].length);
    }
    return writer;
  },
  size: function size(ttf) {
    return ttf.numTables * 16;
  }
});