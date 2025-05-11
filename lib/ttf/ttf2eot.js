"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ttf2eot;
var _reader = _interopRequireDefault(require("./reader"));
var _writer = _interopRequireDefault(require("./writer"));
var _string = _interopRequireDefault(require("./util/string"));
var _error = _interopRequireDefault(require("./error"));
var _table = _interopRequireDefault(require("./table/table"));
var _struct = _interopRequireDefault(require("./table/struct"));
var _name = _interopRequireDefault(require("./table/name"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file ttf转eot
 * @author mengke01(kekee000@gmail.com)
 *
 * reference:
 * http://www.w3.org/Submission/EOT/
 * https://github.com/fontello/ttf2eot/blob/master/index.js
 */

var EotHead = _table.default.create('head', [['EOTSize', _struct.default.Uint32], ['FontDataSize', _struct.default.Uint32], ['Version', _struct.default.Uint32], ['Flags', _struct.default.Uint32], ['PANOSE', _struct.default.Bytes, 10], ['Charset', _struct.default.Uint8], ['Italic', _struct.default.Uint8], ['Weight', _struct.default.Uint32], ['fsType', _struct.default.Uint16], ['MagicNumber', _struct.default.Uint16], ['UnicodeRange', _struct.default.Bytes, 16], ['CodePageRange', _struct.default.Bytes, 8], ['CheckSumAdjustment', _struct.default.Uint32], ['Reserved', _struct.default.Bytes, 16], ['Padding1', _struct.default.Uint16]]);

/**
 * ttf格式转换成eot字体格式
 *
 * @param {ArrayBuffer} ttfBuffer ttf缓冲数组
 * @param {Object} options 选项
 * @return {ArrayBuffer} eot格式byte流
 */
// eslint-disable-next-line no-unused-vars
function ttf2eot(ttfBuffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // 构造eot头部
  var eotHead = new EotHead();
  var eotHeaderSize = eotHead.size();
  var eot = {};
  eot.head = eotHead.read(new _reader.default(new ArrayBuffer(eotHeaderSize)));

  // set fields
  eot.head.FontDataSize = ttfBuffer.byteLength || ttfBuffer.length;
  eot.head.Version = 0x20001;
  eot.head.Flags = 0;
  eot.head.Charset = 0x1;
  eot.head.MagicNumber = 0x504C;
  eot.head.Padding1 = 0;
  var ttfReader = new _reader.default(ttfBuffer);
  // 读取ttf表个数
  var numTables = ttfReader.readUint16(4);
  if (numTables <= 0 || numTables > 100) {
    _error.default.raise(10101);
  }

  // 读取ttf表索引信息
  ttfReader.seek(12);
  // 需要读取3个表内容，设置3个byte
  var tblReaded = 0;
  for (var i = 0; i < numTables && tblReaded !== 0x7; ++i) {
    var tableEntry = {
      tag: ttfReader.readString(ttfReader.offset, 4),
      checkSum: ttfReader.readUint32(),
      offset: ttfReader.readUint32(),
      length: ttfReader.readUint32()
    };
    var entryOffset = ttfReader.offset;
    if (tableEntry.tag === 'head') {
      eot.head.CheckSumAdjustment = ttfReader.readUint32(tableEntry.offset + 8);
      tblReaded += 0x1;
    } else if (tableEntry.tag === 'OS/2') {
      eot.head.PANOSE = ttfReader.readBytes(tableEntry.offset + 32, 10);
      eot.head.Italic = ttfReader.readUint16(tableEntry.offset + 62);
      eot.head.Weight = ttfReader.readUint16(tableEntry.offset + 4);
      eot.head.fsType = ttfReader.readUint16(tableEntry.offset + 8);
      eot.head.UnicodeRange = ttfReader.readBytes(tableEntry.offset + 42, 16);
      eot.head.CodePageRange = ttfReader.readBytes(tableEntry.offset + 78, 8);
      tblReaded += 0x2;
    }

    // 设置名字信息
    else if (tableEntry.tag === 'name') {
      var names = new _name.default(tableEntry.offset).read(ttfReader);
      eot.FamilyName = _string.default.toUCS2Bytes(names.fontFamily || '');
      eot.FamilyNameSize = eot.FamilyName.length;
      eot.StyleName = _string.default.toUCS2Bytes(names.fontStyle || '');
      eot.StyleNameSize = eot.StyleName.length;
      eot.VersionName = _string.default.toUCS2Bytes(names.version || '');
      eot.VersionNameSize = eot.VersionName.length;
      eot.FullName = _string.default.toUCS2Bytes(names.fullName || '');
      eot.FullNameSize = eot.FullName.length;
      tblReaded += 0x3;
    }
    ttfReader.seek(entryOffset);
  }

  // 计算size
  eot.head.EOTSize = eotHeaderSize + 4 + eot.FamilyNameSize + 4 + eot.StyleNameSize + 4 + eot.VersionNameSize + 4 + eot.FullNameSize + 2 + eot.head.FontDataSize;

  // 这里用小尾方式写入
  var eotWriter = new _writer.default(new ArrayBuffer(eot.head.EOTSize), 0, eot.head.EOTSize, true);

  // write head
  eotHead.write(eotWriter, eot);

  // write names
  eotWriter.writeUint16(eot.FamilyNameSize);
  eotWriter.writeBytes(eot.FamilyName, eot.FamilyNameSize);
  eotWriter.writeUint16(0);
  eotWriter.writeUint16(eot.StyleNameSize);
  eotWriter.writeBytes(eot.StyleName, eot.StyleNameSize);
  eotWriter.writeUint16(0);
  eotWriter.writeUint16(eot.VersionNameSize);
  eotWriter.writeBytes(eot.VersionName, eot.VersionNameSize);
  eotWriter.writeUint16(0);
  eotWriter.writeUint16(eot.FullNameSize);
  eotWriter.writeBytes(eot.FullName, eot.FullNameSize);
  eotWriter.writeUint16(0);

  // write rootstring
  eotWriter.writeUint16(0);
  eotWriter.writeBytes(ttfBuffer, eot.head.FontDataSize);
  return eotWriter.getBuffer();
}