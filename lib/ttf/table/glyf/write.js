"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = write;
var _componentFlag = _interopRequireDefault(require("../../enum/componentFlag"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file 写glyf数据
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 写glyf
 *
 * @param  {Object} writer 写入器
 * @param  {Object} ttf    ttf对象
 * @return {Object}        写入器
 */
function write(writer, ttf) {
  var hinting = ttf.writeOptions ? ttf.writeOptions.hinting : false;
  var writeZeroContoursGlyfData = ttf.writeOptions ? ttf.writeOptions.writeZeroContoursGlyfData : false;
  ttf.glyf.forEach(function (glyf, index) {
    // 非复合图元没有轮廓则不写
    if (!glyf.compound && !writeZeroContoursGlyfData && (!glyf.contours || !glyf.contours.length)) {
      return;
    }
    // header
    writer.writeInt16(glyf.compound ? -1 : (glyf.contours || []).length);
    writer.writeInt16(glyf.xMin);
    writer.writeInt16(glyf.yMin);
    writer.writeInt16(glyf.xMax);
    writer.writeInt16(glyf.yMax);
    var i;
    var l;
    var flags;

    // 复合图元
    if (glyf.compound) {
      for (i = 0, l = glyf.glyfs.length; i < l; i++) {
        var g = glyf.glyfs[i];
        flags = g.points ? 0 : _componentFlag.default.ARGS_ARE_XY_VALUES + _componentFlag.default.ROUND_XY_TO_GRID; // xy values

        // more components
        if (i < l - 1) {
          flags += _componentFlag.default.MORE_COMPONENTS;
        }

        // use my metrics
        flags += g.useMyMetrics ? _componentFlag.default.USE_MY_METRICS : 0;
        // overlap compound
        flags += g.overlapCompound ? _componentFlag.default.OVERLAP_COMPOUND : 0;
        var transform = g.transform;
        var a = transform.a;
        var b = transform.b;
        var c = transform.c;
        var d = transform.d;
        var e = g.points ? g.points[0] : transform.e;
        var f = g.points ? g.points[1] : transform.f;

        // xy values or points
        // int 8 放不下，则用int16放
        if (e < 0 || e > 0x7F || f < 0 || f > 0x7F) {
          flags += _componentFlag.default.ARG_1_AND_2_ARE_WORDS;
        }
        if (b || c) {
          flags += _componentFlag.default.WE_HAVE_A_TWO_BY_TWO;
        } else if ((a !== 1 || d !== 1) && a === d) {
          flags += _componentFlag.default.WE_HAVE_A_SCALE;
        } else if (a !== 1 || d !== 1) {
          flags += _componentFlag.default.WE_HAVE_AN_X_AND_Y_SCALE;
        }
        writer.writeUint16(flags);
        writer.writeUint16(g.glyphIndex);
        if (_componentFlag.default.ARG_1_AND_2_ARE_WORDS & flags) {
          writer.writeInt16(e);
          writer.writeInt16(f);
        } else {
          writer.writeUint8(e);
          writer.writeUint8(f);
        }
        if (_componentFlag.default.WE_HAVE_A_SCALE & flags) {
          writer.writeInt16(Math.round(a * 16384));
        } else if (_componentFlag.default.WE_HAVE_AN_X_AND_Y_SCALE & flags) {
          writer.writeInt16(Math.round(a * 16384));
          writer.writeInt16(Math.round(d * 16384));
        } else if (_componentFlag.default.WE_HAVE_A_TWO_BY_TWO & flags) {
          writer.writeInt16(Math.round(a * 16384));
          writer.writeInt16(Math.round(b * 16384));
          writer.writeInt16(Math.round(c * 16384));
          writer.writeInt16(Math.round(d * 16384));
        }
      }
    } else {
      var endPtsOfContours = -1;
      (glyf.contours || []).forEach(function (contour) {
        endPtsOfContours += contour.length;
        writer.writeUint16(endPtsOfContours);
      });

      // instruction
      if (hinting && glyf.instructions) {
        var instructions = glyf.instructions;
        writer.writeUint16(instructions.length);
        for (i = 0, l = instructions.length; i < l; i++) {
          writer.writeUint8(instructions[i]);
        }
      } else {
        writer.writeUint16(0);
      }

      // 获取暂存中的flags
      flags = ttf.support.glyf[index].flags || [];
      for (i = 0, l = flags.length; i < l; i++) {
        writer.writeUint8(flags[i]);
      }
      var xCoord = ttf.support.glyf[index].xCoord || [];
      for (i = 0, l = xCoord.length; i < l; i++) {
        if (0 <= xCoord[i] && xCoord[i] <= 0xFF) {
          writer.writeUint8(xCoord[i]);
        } else {
          writer.writeInt16(xCoord[i]);
        }
      }
      var yCoord = ttf.support.glyf[index].yCoord || [];
      for (i = 0, l = yCoord.length; i < l; i++) {
        if (0 <= yCoord[i] && yCoord[i] <= 0xFF) {
          writer.writeUint8(yCoord[i]);
        } else {
          writer.writeInt16(yCoord[i]);
        }
      }
    }

    // 4字节对齐
    var glyfSize = ttf.support.glyf[index].glyfSize;
    if (glyfSize % 4) {
      writer.writeEmpty(4 - glyfSize % 4);
    }
  });
  return writer;
}