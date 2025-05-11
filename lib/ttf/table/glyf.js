"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _table = _interopRequireDefault(require("./table"));
var _parse = _interopRequireDefault(require("./glyf/parse"));
var _write = _interopRequireDefault(require("./glyf/write"));
var _sizeof = _interopRequireDefault(require("./glyf/sizeof"));
var _lang = require("../../common/lang");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file glyf表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html
 */
var _default = exports.default = _table.default.create('glyf', [], {
  read: function read(reader, ttf) {
    var startOffset = this.offset;
    var loca = ttf.loca;
    var numGlyphs = ttf.maxp.numGlyphs;
    var glyphs = [];
    reader.seek(startOffset);

    // subset
    var subset = ttf.readOptions.subset;
    if (subset && subset.length > 0) {
      var subsetMap = {
        0: true // 设置.notdef
      };
      subsetMap[0] = true;
      // subset map
      var cmap = ttf.cmap;

      // unicode to index
      Object.keys(cmap).forEach(function (c) {
        if (subset.indexOf(+c) > -1) {
          var _i = cmap[c];
          subsetMap[_i] = true;
        }
      });
      ttf.subsetMap = subsetMap;
      var parsedGlyfMap = {};
      // 循环解析subset相关的glyf，包括复合字形相关的字形
      var travelsParse = function travels(subsetMap) {
        var newSubsetMap = {};
        Object.keys(subsetMap).forEach(function (i) {
          var index = +i;
          parsedGlyfMap[index] = true;
          // 当前的和下一个一样，或者最后一个无轮廓
          if (loca[index] === loca[index + 1]) {
            glyphs[index] = {
              contours: []
            };
          } else {
            glyphs[index] = (0, _parse.default)(reader, ttf, startOffset + loca[index]);
          }
          if (glyphs[index].compound) {
            glyphs[index].glyfs.forEach(function (g) {
              if (!parsedGlyfMap[g.glyphIndex]) {
                newSubsetMap[g.glyphIndex] = true;
              }
            });
          }
        });
        if (!(0, _lang.isEmptyObject)(newSubsetMap)) {
          travels(newSubsetMap);
        }
      };
      travelsParse(subsetMap);
      return glyphs;
    }

    // 解析字体轮廓, 前n-1个
    var i;
    var l;
    for (i = 0, l = numGlyphs - 1; i < l; i++) {
      // 当前的和下一个一样，或者最后一个无轮廓
      if (loca[i] === loca[i + 1]) {
        glyphs[i] = {
          contours: []
        };
      } else {
        glyphs[i] = (0, _parse.default)(reader, ttf, startOffset + loca[i]);
      }
    }

    // 最后一个轮廓
    if (ttf.tables.glyf.length - loca[i] < 5) {
      glyphs[i] = {
        contours: []
      };
    } else {
      glyphs[i] = (0, _parse.default)(reader, ttf, startOffset + loca[i]);
    }
    return glyphs;
  },
  write: _write.default,
  size: _sizeof.default
});