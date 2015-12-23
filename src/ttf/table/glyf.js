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

        function parseGlyfInSubset(reader, ttf, start, inSubset) {

            if (inSubset) {
                return parse(reader, ttf, start);
            }
            else {
                return {
                    contours: []
                };
            }

        };

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
                    var subsetMap = {};

                    // 全解析字形
                    var parseGlyph = parse;

                    if (subset && subset.length > 0) {

                        // subset map
                        var cmap = ttf.cmap;

                        // unicode to index
                        Object.keys(cmap).forEach(function (c) {
                            if (subset.indexOf(+c) > -1) {
                                var i = cmap[c];
                                subsetMap[i] = true;
                            }
                        });

                        // 解析部分字形
                        parseGlyph = parseGlyfInSubset;

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
                            glyphs[i] = parseGlyph(reader, ttf, startOffset + loca[i], subsetMap[i]);
                        }
                    }


                    // 最后一个轮廓
                    if ((ttf.tables.glyf.length - loca[i]) < 5) {
                        glyphs[i] = {
                            contours: []
                        };
                    }
                    else {
                        glyphs[i] = parseGlyph(reader, ttf, startOffset + loca[i], subsetMap[i]);
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
