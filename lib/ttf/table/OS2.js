"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _struct = _interopRequireDefault(require("./struct"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file OS/2表
 * @author mengke01(kekee000@gmail.com)
 *
 * http://www.microsoft.com/typography/otspec/os2.htm
 */
var _default = exports.default = _table.default.create('OS/2', [['version', _struct.default.Uint16], ['xAvgCharWidth', _struct.default.Int16], ['usWeightClass', _struct.default.Uint16], ['usWidthClass', _struct.default.Uint16], ['fsType', _struct.default.Uint16], ['ySubscriptXSize', _struct.default.Uint16], ['ySubscriptYSize', _struct.default.Uint16], ['ySubscriptXOffset', _struct.default.Uint16], ['ySubscriptYOffset', _struct.default.Uint16], ['ySuperscriptXSize', _struct.default.Uint16], ['ySuperscriptYSize', _struct.default.Uint16], ['ySuperscriptXOffset', _struct.default.Uint16], ['ySuperscriptYOffset', _struct.default.Uint16], ['yStrikeoutSize', _struct.default.Uint16], ['yStrikeoutPosition', _struct.default.Uint16], ['sFamilyClass', _struct.default.Uint16],
// Panose
['bFamilyType', _struct.default.Uint8], ['bSerifStyle', _struct.default.Uint8], ['bWeight', _struct.default.Uint8], ['bProportion', _struct.default.Uint8], ['bContrast', _struct.default.Uint8], ['bStrokeVariation', _struct.default.Uint8], ['bArmStyle', _struct.default.Uint8], ['bLetterform', _struct.default.Uint8], ['bMidline', _struct.default.Uint8], ['bXHeight', _struct.default.Uint8],
// unicode range
['ulUnicodeRange1', _struct.default.Uint32], ['ulUnicodeRange2', _struct.default.Uint32], ['ulUnicodeRange3', _struct.default.Uint32], ['ulUnicodeRange4', _struct.default.Uint32],
// char 4
['achVendID', _struct.default.String, 4], ['fsSelection', _struct.default.Uint16], ['usFirstCharIndex', _struct.default.Uint16], ['usLastCharIndex', _struct.default.Uint16], ['sTypoAscender', _struct.default.Int16], ['sTypoDescender', _struct.default.Int16], ['sTypoLineGap', _struct.default.Int16], ['usWinAscent', _struct.default.Uint16], ['usWinDescent', _struct.default.Uint16],
// version 0 above 39

['ulCodePageRange1', _struct.default.Uint32], ['ulCodePageRange2', _struct.default.Uint32],
// version 1 above 41

['sxHeight', _struct.default.Int16], ['sCapHeight', _struct.default.Int16], ['usDefaultChar', _struct.default.Uint16], ['usBreakChar', _struct.default.Uint16], ['usMaxContext', _struct.default.Uint16]
// version 2,3,4 above 46
], {
  read: function read(reader, ttf) {
    var format = reader.readUint16(this.offset);
    var struct = this.struct;

    // format2
    if (format === 0) {
      struct = struct.slice(0, 39);
    } else if (format === 1) {
      struct = struct.slice(0, 41);
    }
    var OS2Head = _table.default.create('os2head', struct);
    var tbl = new OS2Head(this.offset).read(reader, ttf);

    // 补齐其他version的字段
    var os2Fields = {
      ulCodePageRange1: 1,
      ulCodePageRange2: 0,
      sxHeight: 0,
      sCapHeight: 0,
      usDefaultChar: 0,
      usBreakChar: 32,
      usMaxContext: 0
    };
    return Object.assign(os2Fields, tbl);
  },
  size: function size(ttf) {
    // 更新其他表的统计信息
    // header
    var xMin = 16384;
    var yMin = 16384;
    var xMax = -16384;
    var yMax = -16384;

    // hhea
    var advanceWidthMax = -1;
    var minLeftSideBearing = 16384;
    var minRightSideBearing = 16384;
    var xMaxExtent = -16384;

    // os2 count
    var xAvgCharWidth = 0;
    var usFirstCharIndex = 0x10FFFF;
    var usLastCharIndex = -1;

    // maxp
    var maxPoints = 0;
    var maxContours = 0;
    var maxCompositePoints = 0;
    var maxCompositeContours = 0;
    var maxSizeOfInstructions = 0;
    var maxComponentElements = 0;
    var glyfNotEmpty = 0; // 非空glyf
    var hinting = ttf.writeOptions ? ttf.writeOptions.hinting : false;

    // 计算instructions和functiondefs
    if (hinting) {
      if (ttf.cvt) {
        maxSizeOfInstructions = Math.max(maxSizeOfInstructions, ttf.cvt.length);
      }
      if (ttf.prep) {
        maxSizeOfInstructions = Math.max(maxSizeOfInstructions, ttf.prep.length);
      }
      if (ttf.fpgm) {
        maxSizeOfInstructions = Math.max(maxSizeOfInstructions, ttf.fpgm.length);
      }
    }
    ttf.glyf.forEach(function (glyf) {
      // 统计control point信息
      if (glyf.compound) {
        var compositeContours = 0;
        var compositePoints = 0;
        glyf.glyfs.forEach(function (g) {
          var cglyf = ttf.glyf[g.glyphIndex];
          if (!cglyf) {
            return;
          }
          compositeContours += cglyf.contours ? cglyf.contours.length : 0;
          if (cglyf.contours && cglyf.contours.length) {
            cglyf.contours.forEach(function (contour) {
              compositePoints += contour.length;
            });
          }
        });
        maxComponentElements = Math.max(maxComponentElements, glyf.glyfs.length);
        maxCompositePoints = Math.max(maxCompositePoints, compositePoints);
        maxCompositeContours = Math.max(maxCompositeContours, compositeContours);
      }
      // 简单图元
      else if (glyf.contours && glyf.contours.length) {
        maxContours = Math.max(maxContours, glyf.contours.length);
        var points = 0;
        glyf.contours.forEach(function (contour) {
          points += contour.length;
        });
        maxPoints = Math.max(maxPoints, points);
      }
      if (hinting && glyf.instructions) {
        maxSizeOfInstructions = Math.max(maxSizeOfInstructions, glyf.instructions.length);
      }

      // 统计边界信息
      if (null != glyf.xMin && glyf.xMin < xMin) {
        xMin = glyf.xMin;
      }
      if (null != glyf.yMin && glyf.yMin < yMin) {
        yMin = glyf.yMin;
      }
      if (null != glyf.xMax && glyf.xMax > xMax) {
        xMax = glyf.xMax;
      }
      if (null != glyf.yMax && glyf.yMax > yMax) {
        yMax = glyf.yMax;
      }
      advanceWidthMax = Math.max(advanceWidthMax, glyf.advanceWidth);
      minLeftSideBearing = Math.min(minLeftSideBearing, glyf.leftSideBearing);
      if (null != glyf.xMax) {
        minRightSideBearing = Math.min(minRightSideBearing, glyf.advanceWidth - glyf.xMax);
        xMaxExtent = Math.max(xMaxExtent, glyf.xMax);
      }
      if (null != glyf.advanceWidth) {
        xAvgCharWidth += glyf.advanceWidth;
        glyfNotEmpty++;
      }
      var unicodes = glyf.unicode;
      if (typeof glyf.unicode === 'number') {
        unicodes = [glyf.unicode];
      }
      if (Array.isArray(unicodes)) {
        unicodes.forEach(function (unicode) {
          if (unicode !== 0xFFFF) {
            usFirstCharIndex = Math.min(usFirstCharIndex, unicode);
            usLastCharIndex = Math.max(usLastCharIndex, unicode);
          }
        });
      }
    });

    // 重新设置version 4
    ttf['OS/2'].version = 0x4;
    ttf['OS/2'].achVendID = (ttf['OS/2'].achVendID + '    ').slice(0, 4);
    ttf['OS/2'].xAvgCharWidth = xAvgCharWidth / (glyfNotEmpty || 1);
    ttf['OS/2'].ulUnicodeRange2 = 268435456;
    ttf['OS/2'].usFirstCharIndex = usFirstCharIndex;
    ttf['OS/2'].usLastCharIndex = usLastCharIndex;

    // rewrite hhea
    ttf.hhea.version = ttf.hhea.version || 0x1;
    ttf.hhea.advanceWidthMax = advanceWidthMax;
    ttf.hhea.minLeftSideBearing = minLeftSideBearing;
    ttf.hhea.minRightSideBearing = minRightSideBearing;
    ttf.hhea.xMaxExtent = xMaxExtent;

    // rewrite head
    ttf.head.version = ttf.head.version || 0x1;
    ttf.head.lowestRecPPEM = ttf.head.lowestRecPPEM || 0x8;
    ttf.head.xMin = xMin;
    ttf.head.yMin = yMin;
    ttf.head.xMax = xMax;
    ttf.head.yMax = yMax;

    // head rewrite
    if (ttf.support.head) {
      var _ttf$support$head = ttf.support.head,
        _xMin = _ttf$support$head.xMin,
        _yMin = _ttf$support$head.yMin,
        _xMax = _ttf$support$head.xMax,
        _yMax = _ttf$support$head.yMax;
      if (_xMin != null) {
        ttf.head.xMin = _xMin;
      }
      if (_yMin != null) {
        ttf.head.yMin = _yMin;
      }
      if (_xMax != null) {
        ttf.head.xMax = _xMax;
      }
      if (_yMax != null) {
        ttf.head.yMax = _yMax;
      }
    }
    // hhea rewrite
    if (ttf.support.hhea) {
      var _ttf$support$hhea = ttf.support.hhea,
        _advanceWidthMax = _ttf$support$hhea.advanceWidthMax,
        _xMaxExtent = _ttf$support$hhea.xMaxExtent,
        _minLeftSideBearing = _ttf$support$hhea.minLeftSideBearing,
        _minRightSideBearing = _ttf$support$hhea.minRightSideBearing;
      if (_advanceWidthMax != null) {
        ttf.hhea.advanceWidthMax = _advanceWidthMax;
      }
      if (_xMaxExtent != null) {
        ttf.hhea.xMaxExtent = _xMaxExtent;
      }
      if (_minLeftSideBearing != null) {
        ttf.hhea.minLeftSideBearing = _minLeftSideBearing;
      }
      if (_minRightSideBearing != null) {
        ttf.hhea.minRightSideBearing = _minRightSideBearing;
      }
    }
    // 这里根据存储的maxp来设置新的maxp，避免重复计算maxp
    ttf.maxp = ttf.maxp || {};
    ttf.support.maxp = {
      version: 1.0,
      numGlyphs: ttf.glyf.length,
      maxPoints: maxPoints,
      maxContours: maxContours,
      maxCompositePoints: maxCompositePoints,
      maxCompositeContours: maxCompositeContours,
      maxZones: ttf.maxp.maxZones || 0,
      maxTwilightPoints: ttf.maxp.maxTwilightPoints || 0,
      maxStorage: ttf.maxp.maxStorage || 0,
      maxFunctionDefs: ttf.maxp.maxFunctionDefs || 0,
      maxStackElements: ttf.maxp.maxStackElements || 0,
      maxSizeOfInstructions: maxSizeOfInstructions,
      maxComponentElements: maxComponentElements,
      maxComponentDepth: maxComponentElements ? 1 : 0
    };
    return _table.default.size.call(this, ttf);
  }
});