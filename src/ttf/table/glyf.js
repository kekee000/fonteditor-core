/**
 * @file glyf表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html
 */

import table from './table';
import parse from './glyf/parse';
import write from './glyf/write';
import sizeof from './glyf/sizeof';
import {isEmptyObject} from '../../common/lang';

export default table.create(
    'glyf',
    [],
    {

        read(reader, ttf) {
            const startOffset = this.offset;
            const loca = ttf.loca;
            const numGlyphs = ttf.maxp.numGlyphs;
            const glyphs = [];

            reader.seek(startOffset);

            // subset
            const subset = ttf.readOptions.subset;

            if (subset && subset.length > 0) {
                const subsetMap = {
                    0: true // 设置.notdef
                };
                subsetMap[0] = true;
                // subset map
                const cmap = ttf.cmap;

                // unicode to index
                Object.keys(cmap).forEach((c) => {
                    if (subset.indexOf(+c) > -1) {
                        const i = cmap[c];
                        subsetMap[i] = true;
                    }
                });
                ttf.subsetMap = subsetMap;
                const parsedGlyfMap = {};
                // 循环解析subset相关的glyf，包括复合字形相关的字形
                const travelsParse = function travels(subsetMap) {
                    const newSubsetMap = {};
                    Object.keys(subsetMap).forEach((i) => {
                        const index = +i;
                        parsedGlyfMap[index] = true;
                        // 当前的和下一个一样，或者最后一个无轮廓
                        if (loca[index] === loca[index + 1]) {
                            glyphs[index] = {
                                contours: []
                            };
                        }
                        else {
                            glyphs[index] = parse(reader, ttf, startOffset + loca[index]);
                        }

                        if (glyphs[index].compound) {
                            glyphs[index].glyfs.forEach((g) => {
                                if (!parsedGlyfMap[g.glyphIndex]) {
                                    newSubsetMap[g.glyphIndex] = true;
                                }
                            });
                        }
                    });

                    if (!isEmptyObject(newSubsetMap)) {
                        travels(newSubsetMap);
                    }
                };

                travelsParse(subsetMap);
                return glyphs;
            }

            // 解析字体轮廓, 前n-1个
            let i;
            let l;
            for (i = 0, l = numGlyphs - 1; i < l; i++) {
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

        write,
        size: sizeof
    }
);
