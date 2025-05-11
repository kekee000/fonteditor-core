"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _struct = _interopRequireDefault(require("./struct"));
var _string = _interopRequireDefault(require("../util/string"));
var _unicodeName = _interopRequireDefault(require("../enum/unicodeName"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file post 表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6post.html
 */

var Posthead = _table.default.create('posthead', [['format', _struct.default.Fixed], ['italicAngle', _struct.default.Fixed], ['underlinePosition', _struct.default.Int16], ['underlineThickness', _struct.default.Int16], ['isFixedPitch', _struct.default.Uint32], ['minMemType42', _struct.default.Uint32], ['maxMemType42', _struct.default.Uint32], ['minMemType1', _struct.default.Uint32], ['maxMemType1', _struct.default.Uint32]]);
var _default = exports.default = _table.default.create('post', [], {
  read: function read(reader, ttf) {
    var format = reader.readFixed(this.offset);
    // 读取表头
    var tbl = new Posthead(this.offset).read(reader, ttf);

    // format2
    if (format === 2) {
      var numberOfGlyphs = reader.readUint16();
      var glyphNameIndex = [];
      for (var i = 0; i < numberOfGlyphs; ++i) {
        glyphNameIndex.push(reader.readUint16());
      }
      var pascalStringOffset = reader.offset;
      var pascalStringLength = ttf.tables.post.length - (pascalStringOffset - this.offset);
      var pascalStringBytes = reader.readBytes(reader.offset, pascalStringLength);
      tbl.nameIndex = glyphNameIndex; // 设置glyf名字索引
      tbl.names = _string.default.getPascalString(pascalStringBytes); // glyf名字数组
    }
    // deprecated
    else if (format === 2.5) {
      tbl.format = 3;
    }
    return tbl;
  },
  write: function write(writer, ttf) {
    var post = ttf.post || {
      format: 3
    };

    // write header
    writer.writeFixed(post.format); // format
    writer.writeFixed(post.italicAngle || 0); // italicAngle
    writer.writeInt16(post.underlinePosition || 0); // underlinePosition
    writer.writeInt16(post.underlineThickness || 0); // underlineThickness
    writer.writeUint32(post.isFixedPitch || 0); // isFixedPitch
    writer.writeUint32(post.minMemType42 || 0); // minMemType42
    writer.writeUint32(post.maxMemType42 || 0); // maxMemType42
    writer.writeUint32(post.minMemType1 || 0); // minMemType1
    writer.writeUint32(post.maxMemType1 || 0); // maxMemType1

    // version 3 不设置post信息
    if (post.format === 2) {
      var numberOfGlyphs = ttf.glyf.length;
      writer.writeUint16(numberOfGlyphs); // numberOfGlyphs
      // write glyphNameIndex
      var nameIndex = ttf.support.post.nameIndex;
      for (var i = 0, l = nameIndex.length; i < l; i++) {
        writer.writeUint16(nameIndex[i]);
      }

      // write names
      ttf.support.post.names.forEach(function (name) {
        writer.writeBytes(name);
      });
    }
  },
  size: function size(ttf) {
    var numberOfGlyphs = ttf.glyf.length;
    ttf.post = ttf.post || {};
    ttf.post.format = ttf.post.format || 3;
    ttf.post.maxMemType1 = numberOfGlyphs;

    // version 3 不设置post信息
    if (ttf.post.format === 3 || ttf.post.format === 1) {
      return 32;
    }

    // version 2
    var size = 34 + numberOfGlyphs * 2; // header + numberOfGlyphs + numberOfGlyphs * 2
    var glyphNames = [];
    var nameIndexArr = [];
    var nameIndex = 0;

    // 获取 name的大小
    for (var i = 0; i < numberOfGlyphs; i++) {
      // .notdef
      if (i === 0) {
        nameIndexArr.push(0);
      } else {
        var glyf = ttf.glyf[i];
        var unicode = glyf.unicode ? glyf.unicode[0] : 0;
        var unicodeNameIndex = _unicodeName.default[unicode];
        if (undefined !== unicodeNameIndex) {
          nameIndexArr.push(unicodeNameIndex);
        } else {
          // 这里需要注意，"" 有可能是"\3" length不为0，但是是空字符串
          var name = glyf.name;
          if (!name || name.charCodeAt(0) < 32) {
            nameIndexArr.push(258 + nameIndex++);
            glyphNames.push([0]);
            size++;
          } else {
            nameIndexArr.push(258 + nameIndex++);
            var bytes = _string.default.toPascalStringBytes(name); // pascal string bytes
            glyphNames.push(bytes);
            size += bytes.length;
          }
        }
      }
    }
    ttf.support.post = {
      nameIndex: nameIndexArr,
      names: glyphNames
    };
    return size;
  }
});