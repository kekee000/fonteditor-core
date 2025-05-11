"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readWindowsAllCodes;
/* eslint-disable */

/**
 * @file 读取windows支持的字符集
 * @author mengke01(kekee000@gmail.com)
 *
 * @see
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
 */

/**
 * 读取ttf中windows字符表的字符
 *
 * @param {Array} tables cmap表结构
 * @param {Object} ttf ttf对象
 * @return {Object} 字符字典索引，unicode => glyf index
 */
function readWindowsAllCodes(tables, ttf) {
  var codes = {};

  // 读取windows unicode 编码段
  var format0 = tables.find(function (item) {
    return item.format === 0;
  });

  // 读取windows unicode 编码段
  var format12 = tables.find(function (item) {
    return item.platformID === 3 && item.encodingID === 10 && item.format === 12;
  });
  var format4 = tables.find(function (item) {
    return item.platformID === 3 && item.encodingID === 1 && item.format === 4;
  });
  var format2 = tables.find(function (item) {
    return item.platformID === 3 && item.encodingID === 3 && item.format === 2;
  });
  var format14 = tables.find(function (item) {
    return item.platformID === 0 && item.encodingID === 5 && item.format === 14;
  });
  if (format0) {
    for (var i = 0, l = format0.glyphIdArray.length; i < l; i++) {
      if (format0.glyphIdArray[i]) {
        codes[i] = format0.glyphIdArray[i];
      }
    }
  }

  // format 14 support
  if (format14) {
    for (var _i = 0, _l = format14.groups.length; _i < _l; _i++) {
      var _format14$groups$_i = format14.groups[_i],
        unicode = _format14$groups$_i.unicode,
        glyphId = _format14$groups$_i.glyphId;
      if (unicode) {
        codes[unicode] = glyphId;
      }
    }
  }

  // 读取format12表
  if (format12) {
    for (var _i2 = 0, _l2 = format12.nGroups; _i2 < _l2; _i2++) {
      var group = format12.groups[_i2];
      var startId = group.startId;
      var start = group.start;
      var end = group.end;
      for (; start <= end;) {
        codes[start++] = startId++;
      }
    }
  }
  // 读取format4表
  else if (format4) {
    var segCount = format4.segCountX2 / 2;
    // graphIdArray 和idRangeOffset的偏移量
    var graphIdArrayIndexOffset = (format4.glyphIdArrayOffset - format4.idRangeOffsetOffset) / 2;
    for (var _i3 = 0; _i3 < segCount; ++_i3) {
      // 读取单个字符
      for (var _start = format4.startCode[_i3], _end = format4.endCode[_i3]; _start <= _end; ++_start) {
        // range offset = 0
        if (format4.idRangeOffset[_i3] === 0) {
          codes[_start] = (_start + format4.idDelta[_i3]) % 0x10000;
        }
        // rely on to glyphIndexArray
        else {
          var index = _i3 + format4.idRangeOffset[_i3] / 2 + (_start - format4.startCode[_i3]) - graphIdArrayIndexOffset;
          var graphId = format4.glyphIdArray[index];
          if (graphId !== 0) {
            codes[_start] = (graphId + format4.idDelta[_i3]) % 0x10000;
          } else {
            codes[_start] = 0;
          }
        }
      }
    }
    delete codes[65535];
  }
  // 读取format2表
  // see https://github.com/fontforge/fontforge/blob/master/fontforge/parsettf.c
  else if (format2) {
    var subHeadKeys = format2.subHeadKeys;
    var subHeads = format2.subHeads;
    var glyphs = format2.glyphs;
    var numGlyphs = ttf.maxp.numGlyphs;
    var _index = 0;
    for (var _i4 = 0; _i4 < 256; _i4++) {
      // 单字节编码
      if (subHeadKeys[_i4] === 0) {
        if (_i4 >= format2.maxPos) {
          _index = 0;
        } else if (_i4 < subHeads[0].firstCode || _i4 >= subHeads[0].firstCode + subHeads[0].entryCount || subHeads[0].idRangeOffset + (_i4 - subHeads[0].firstCode) >= glyphs.length) {
          _index = 0;
        } else if ((_index = glyphs[subHeads[0].idRangeOffset + (_i4 - subHeads[0].firstCode)]) !== 0) {
          _index = _index + subHeads[0].idDelta;
        }

        // 单字节解码
        if (_index !== 0 && _index < numGlyphs) {
          codes[_i4] = _index;
        }
      } else {
        var k = subHeadKeys[_i4];
        for (var j = 0, entryCount = subHeads[k].entryCount; j < entryCount; j++) {
          if (subHeads[k].idRangeOffset + j >= glyphs.length) {
            _index = 0;
          } else if ((_index = glyphs[subHeads[k].idRangeOffset + j]) !== 0) {
            _index = _index + subHeads[k].idDelta;
          }
          if (_index !== 0 && _index < numGlyphs) {
            var _unicode = (_i4 << 8 | j + subHeads[k].firstCode) % 0xffff;
            codes[_unicode] = _index;
          }
        }
      }
    }
  }
  return codes;
}