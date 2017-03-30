/**
 * @file glyf表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html
 */

define(
    function (require) {

        var table = require('./table');
        var parse = require('./glyf/parse');
        var write = require('./glyf/write');
        var sizeof = require('./glyf/sizeof');
        var lang = require('../../common/lang');
        var glyf = table.create(
            'glyf',
            [],
            {

                read: function (reader, ttf) {
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
                                var i = cmap[c];
                                subsetMap[i] = true;
                            }
                        });
                        ttf.subsetMap = subsetMap;
                        var parsedGlyfMap = {};
                        // 循环解析subset相关的glyf，包括复合字形相关的字形
                        var travelsParse = function travels(subsetMap) {
                            var newSubsetMap = {};
                            Object.keys(subsetMap).forEach(function (i) {
                                parsedGlyfMap[i] = true;
                                // 当前的和下一个一样，或者最后一个无轮廓
                                if (loca[i] === loca[i + 1]) {
                                    glyphs[i] = {
                                        contours: []
                                    };
                                }
                                else {
                                    glyphs[i] = parse(reader, ttf, startOffset + loca[i]);
                                }

                                if (glyphs[i].compound) {
                                    glyphs[i].glyfs.forEach(function (g) {
                                        if (!parsedGlyfMap[g.glyphIndex]) {
                                            newSubsetMap[g.glyphIndex] = true;
                                        }
                                    });
                                }
                            });

                            if (!lang.isEmptyObject(newSubsetMap)) {
                                travels(newSubsetMap);
                            }
                        };

                        travelsParse(subsetMap);
                        return glyphs;
                    }

                    // 解析字体轮廓, 前n-1个
                    for (var i = 0, l = numGlyphs - 1; i < l; i++) {
                        // 当前的和下一个一样，或者最后一个无轮廓
                        if (loca[i] === loca[i + 1]) {
                            glyphs[i] = {
                                contours: []
                            };
                        }
                        else {
                            glyphs[i] = parse(reader, ttf, startOffset + loca[i]);
                        }
                    }

                    // 最后一个轮廓
                    if ((ttf.tables.glyf.length - loca[i]) < 5) {
                        glyphs[i] = {
                            contours: []
                        };
                    }
                    else {
                        glyphs[i] = parse(reader, ttf, startOffset + loca[i]);
                    }

                    return glyphs;
                },

                write: write,
                size: sizeof
            }
        );

        return glyf;
    }
);
