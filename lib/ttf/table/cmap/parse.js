"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;
var _readWindowsAllCodes = _interopRequireDefault(require("../../util/readWindowsAllCodes"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 解析cmap表
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 读取cmap子表
 *
 * @param {Reader} reader Reader对象
 * @param {Object} ttf ttf对象
 * @param {Object} subTable 子表对象
 * @param {number} cmapOffset 子表的偏移
 */
function readSubTable(reader, ttf, subTable, cmapOffset) {
  var i;
  var l;
  var glyphIdArray;
  var startOffset = cmapOffset + subTable.offset;
  var glyphCount;
  subTable.format = reader.readUint16(startOffset);

  // 0～256 紧凑排列
  if (subTable.format === 0) {
    var format0 = subTable;
    // 跳过format字段
    format0.length = reader.readUint16();
    format0.language = reader.readUint16();
    glyphIdArray = [];
    for (i = 0, l = format0.length - 6; i < l; i++) {
      glyphIdArray.push(reader.readUint8());
    }
    format0.glyphIdArray = glyphIdArray;
  } else if (subTable.format === 2) {
    var format2 = subTable;
    // 跳过format字段
    format2.length = reader.readUint16();
    format2.language = reader.readUint16();
    var subHeadKeys = [];
    var maxSubHeadKey = 0; // 最大索引
    var maxPos = -1; // 最大位置
    for (var _i = 0, _l = 256; _i < _l; _i++) {
      subHeadKeys[_i] = reader.readUint16() / 8;
      if (subHeadKeys[_i] > maxSubHeadKey) {
        maxSubHeadKey = subHeadKeys[_i];
        maxPos = _i;
      }
    }
    var subHeads = [];
    for (i = 0; i <= maxSubHeadKey; i++) {
      subHeads[i] = {
        firstCode: reader.readUint16(),
        entryCount: reader.readUint16(),
        idDelta: reader.readUint16(),
        idRangeOffset: (reader.readUint16() - (maxSubHeadKey - i) * 8 - 2) / 2
      };
    }
    glyphCount = (startOffset + format2.length - reader.offset) / 2;
    var glyphs = [];
    for (i = 0; i < glyphCount; i++) {
      glyphs[i] = reader.readUint16();
    }
    format2.subHeadKeys = subHeadKeys;
    format2.maxPos = maxPos;
    format2.subHeads = subHeads;
    format2.glyphs = glyphs;
  }
  // 双字节编码，非紧凑排列
  else if (subTable.format === 4) {
    var format4 = subTable;
    // 跳过format字段
    format4.length = reader.readUint16();
    format4.language = reader.readUint16();
    format4.segCountX2 = reader.readUint16();
    format4.searchRange = reader.readUint16();
    format4.entrySelector = reader.readUint16();
    format4.rangeShift = reader.readUint16();
    var segCount = format4.segCountX2 / 2;

    // end code
    var endCode = [];
    for (i = 0; i < segCount; ++i) {
      endCode.push(reader.readUint16());
    }
    format4.endCode = endCode;
    format4.reservedPad = reader.readUint16();

    // start code
    var startCode = [];
    for (i = 0; i < segCount; ++i) {
      startCode.push(reader.readUint16());
    }
    format4.startCode = startCode;

    // idDelta
    var idDelta = [];
    for (i = 0; i < segCount; ++i) {
      idDelta.push(reader.readUint16());
    }
    format4.idDelta = idDelta;
    format4.idRangeOffsetOffset = reader.offset;

    // idRangeOffset
    var idRangeOffset = [];
    for (i = 0; i < segCount; ++i) {
      idRangeOffset.push(reader.readUint16());
    }
    format4.idRangeOffset = idRangeOffset;

    // 总长度 - glyphIdArray起始偏移/2
    glyphCount = (format4.length - (reader.offset - startOffset)) / 2;

    // 记录array offset
    format4.glyphIdArrayOffset = reader.offset;

    // glyphIdArray
    glyphIdArray = [];
    for (i = 0; i < glyphCount; ++i) {
      glyphIdArray.push(reader.readUint16());
    }
    format4.glyphIdArray = glyphIdArray;
  } else if (subTable.format === 6) {
    var format6 = subTable;
    format6.length = reader.readUint16();
    format6.language = reader.readUint16();
    format6.firstCode = reader.readUint16();
    format6.entryCount = reader.readUint16();

    // 记录array offset
    format6.glyphIdArrayOffset = reader.offset;
    var glyphIndexArray = [];
    var entryCount = format6.entryCount;
    // 读取字符分组
    for (i = 0; i < entryCount; ++i) {
      glyphIndexArray.push(reader.readUint16());
    }
    format6.glyphIdArray = glyphIndexArray;
  }
  // defines segments for sparse representation in 4-byte character space
  else if (subTable.format === 12) {
    var format12 = subTable;
    format12.reserved = reader.readUint16();
    format12.length = reader.readUint32();
    format12.language = reader.readUint32();
    format12.nGroups = reader.readUint32();
    var groups = [];
    var nGroups = format12.nGroups;
    // 读取字符分组
    for (i = 0; i < nGroups; ++i) {
      var group = {};
      group.start = reader.readUint32();
      group.end = reader.readUint32();
      group.startId = reader.readUint32();
      groups.push(group);
    }
    format12.groups = groups;
  }
  // format 14
  else if (subTable.format === 14) {
    var format14 = subTable;
    format14.length = reader.readUint32();
    var numVarSelectorRecords = reader.readUint32();
    var _groups = [];
    var offset = reader.offset;
    for (var _i2 = 0; _i2 < numVarSelectorRecords; _i2++) {
      var varSelector = reader.readUint24(offset);
      var defaultUVSOffset = reader.readUint32(offset + 3);
      var nonDefaultUVSOffset = reader.readUint32(offset + 7);
      offset += 11;
      if (defaultUVSOffset) {
        var numUnicodeValueRanges = reader.readUint32(startOffset + defaultUVSOffset);
        for (var j = 0; j < numUnicodeValueRanges; j++) {
          var startUnicode = reader.readUint24();
          var additionalCount = reader.readUint8();
          _groups.push({
            start: startUnicode,
            end: startUnicode + additionalCount,
            varSelector: varSelector
          });
        }
      }
      if (nonDefaultUVSOffset) {
        var numUVSMappings = reader.readUint32(startOffset + nonDefaultUVSOffset);
        for (var _j = 0; _j < numUVSMappings; _j++) {
          var unicode = reader.readUint24();
          var glyphId = reader.readUint16();
          _groups.push({
            unicode: unicode,
            glyphId: glyphId,
            varSelector: varSelector
          });
        }
      }
    }
    format14.groups = _groups;
  } else {
    console.warn('not support cmap format:' + subTable.format);
  }
}
function parse(reader, ttf) {
  var tcmap = {};
  // eslint-disable-next-line no-invalid-this
  var cmapOffset = this.offset;
  reader.seek(cmapOffset);
  tcmap.version = reader.readUint16(); // 编码方式
  var numberSubtables = tcmap.numberSubtables = reader.readUint16(); // 表个数

  var subTables = tcmap.tables = []; // 名字表
  var offset = reader.offset;

  // 使用offset读取，以便于查找
  for (var i = 0, l = numberSubtables; i < l; i++) {
    var subTable = {};
    subTable.platformID = reader.readUint16(offset);
    subTable.encodingID = reader.readUint16(offset + 2);
    subTable.offset = reader.readUint32(offset + 4);
    readSubTable(reader, ttf, subTable, cmapOffset);
    subTables.push(subTable);
    offset += 8;
  }
  var cmap = (0, _readWindowsAllCodes.default)(subTables, ttf);
  return cmap;
}