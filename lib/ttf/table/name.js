"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _nameId = _interopRequireDefault(require("../enum/nameId"));
var _string = _interopRequireDefault(require("../util/string"));
var _platform = _interopRequireDefault(require("../enum/platform"));
var _encoding = require("../enum/encoding");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file name表
 * @author mengke01(kekee000@gmail.com)
 */
var _default = exports.default = _table.default.create('name', [], {
  read: function read(reader) {
    var offset = this.offset;
    reader.seek(offset);
    var nameTbl = {};
    nameTbl.format = reader.readUint16();
    nameTbl.count = reader.readUint16();
    nameTbl.stringOffset = reader.readUint16();
    var nameRecordTbl = [];
    var count = nameTbl.count;
    var i;
    var nameRecord;
    for (i = 0; i < count; ++i) {
      nameRecord = {};
      nameRecord.platform = reader.readUint16();
      nameRecord.encoding = reader.readUint16();
      nameRecord.language = reader.readUint16();
      nameRecord.nameId = reader.readUint16();
      nameRecord.length = reader.readUint16();
      nameRecord.offset = reader.readUint16();
      nameRecordTbl.push(nameRecord);
    }
    offset += nameTbl.stringOffset;

    // 读取字符名字
    for (i = 0; i < count; ++i) {
      nameRecord = nameRecordTbl[i];
      nameRecord.name = reader.readBytes(offset + nameRecord.offset, nameRecord.length);
    }
    var names = {};

    // mac 下的english name
    var platform = _platform.default.Macintosh;
    var encoding = _encoding.mac.Default;
    var language = 0;

    // 如果有windows 下的 english，则用windows下的 name
    if (nameRecordTbl.some(function (record) {
      return record.platform === _platform.default.Microsoft && record.encoding === _encoding.win.UCS2 && record.language === 1033;
    })) {
      platform = _platform.default.Microsoft;
      encoding = _encoding.win.UCS2;
      language = 1033;
    }
    for (i = 0; i < count; ++i) {
      nameRecord = nameRecordTbl[i];
      if (nameRecord.platform === platform && nameRecord.encoding === encoding && nameRecord.language === language && _nameId.default[nameRecord.nameId]) {
        names[_nameId.default[nameRecord.nameId]] = language === 0 ? _string.default.getUTF8String(nameRecord.name) : _string.default.getUCS2String(nameRecord.name);
      }
    }
    return names;
  },
  write: function write(writer, ttf) {
    var nameRecordTbl = ttf.support.name;
    writer.writeUint16(0); // format
    writer.writeUint16(nameRecordTbl.length); // count
    writer.writeUint16(6 + nameRecordTbl.length * 12); // string offset

    // write name tbl header
    var offset = 0;
    nameRecordTbl.forEach(function (nameRecord) {
      writer.writeUint16(nameRecord.platform);
      writer.writeUint16(nameRecord.encoding);
      writer.writeUint16(nameRecord.language);
      writer.writeUint16(nameRecord.nameId);
      writer.writeUint16(nameRecord.name.length);
      writer.writeUint16(offset); // offset
      offset += nameRecord.name.length;
    });

    // write name tbl strings
    nameRecordTbl.forEach(function (nameRecord) {
      writer.writeBytes(nameRecord.name);
    });
    return writer;
  },
  size: function size(ttf) {
    var names = ttf.name;
    var nameRecordTbl = [];

    // 写入name信息
    // 这里为了简化书写，仅支持英文编码字符，
    // 中文编码字符将被转化成url encode
    var size = 6;
    Object.keys(names).forEach(function (name) {
      var id = _nameId.default.names[name];
      var utf8Bytes = _string.default.toUTF8Bytes(names[name]);
      var usc2Bytes = _string.default.toUCS2Bytes(names[name]);
      if (undefined !== id) {
        // mac
        nameRecordTbl.push({
          nameId: id,
          platform: 1,
          encoding: 0,
          language: 0,
          name: utf8Bytes
        });

        // windows
        nameRecordTbl.push({
          nameId: id,
          platform: 3,
          encoding: 1,
          language: 1033,
          name: usc2Bytes
        });

        // 子表大小
        size += 12 * 2 + utf8Bytes.length + usc2Bytes.length;
      }
    });
    var namingOrder = ['platform', 'encoding', 'language', 'nameId'];
    nameRecordTbl = nameRecordTbl.sort(function (a, b) {
      var l = 0;
      namingOrder.some(function (name) {
        var o = a[name] - b[name];
        if (o) {
          l = o;
          return true;
        }
        return false;
      });
      return l;
    });

    // 保存预处理信息
    ttf.support.name = nameRecordTbl;
    return size;
  }
});