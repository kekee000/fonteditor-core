/**
 * @file OS/2表
 * @author mengke01(kekee000@gmail.com)
 *
 * http://www.microsoft.com/typography/otspec/os2.htm
 */

import table from './table';
import struct from './struct';

export default table.create(
    'OS/2',
    [
        ['version', struct.Uint16],

        ['xAvgCharWidth', struct.Int16],
        ['usWeightClass', struct.Uint16],
        ['usWidthClass', struct.Uint16],

        ['fsType', struct.Uint16],

        ['ySubscriptXSize', struct.Uint16],
        ['ySubscriptYSize', struct.Uint16],
        ['ySubscriptXOffset', struct.Uint16],
        ['ySubscriptYOffset', struct.Uint16],

        ['ySuperscriptXSize', struct.Uint16],
        ['ySuperscriptYSize', struct.Uint16],
        ['ySuperscriptXOffset', struct.Uint16],
        ['ySuperscriptYOffset', struct.Uint16],

        ['yStrikeoutSize', struct.Uint16],
        ['yStrikeoutPosition', struct.Uint16],

        ['sFamilyClass', struct.Uint16],

        // Panose
        ['bFamilyType', struct.Uint8],
        ['bSerifStyle', struct.Uint8],
        ['bWeight', struct.Uint8],
        ['bProportion', struct.Uint8],
        ['bContrast', struct.Uint8],
        ['bStrokeVariation', struct.Uint8],
        ['bArmStyle', struct.Uint8],
        ['bLetterform', struct.Uint8],
        ['bMidline', struct.Uint8],
        ['bXHeight', struct.Uint8],

        // unicode range
        ['ulUnicodeRange1', struct.Uint32],
        ['ulUnicodeRange2', struct.Uint32],
        ['ulUnicodeRange3', struct.Uint32],
        ['ulUnicodeRange4', struct.Uint32],

        // char 4
        ['achVendID', struct.String, 4],

        ['fsSelection', struct.Uint16],
        ['usFirstCharIndex', struct.Uint16],
        ['usLastCharIndex', struct.Uint16],

        ['sTypoAscender', struct.Int16],
        ['sTypoDescender', struct.Int16],
        ['sTypoLineGap', struct.Int16],

        ['usWinAscent', struct.Uint16],
        ['usWinDescent', struct.Uint16],
        // version 0 above 39

        ['ulCodePageRange1', struct.Uint32],
        ['ulCodePageRange2', struct.Uint32],
        // version 1 above 41

        ['sxHeight', struct.Int16],
        ['sCapHeight', struct.Int16],

        ['usDefaultChar', struct.Uint16],
        ['usBreakChar', struct.Uint16],
        ['usMaxContext', struct.Uint16]
        // version 2,3,4 above 46
    ],
    {

        read(reader, ttf) {
            const format = reader.readUint16(this.offset);
            let struct = this.struct;

            // format2
            if (format === 0) {
                struct = struct.slice(0, 39);
            }
            else if (format === 1) {
                struct = struct.slice(0, 41);
            }

            const OS2Head = table.create('os2head', struct);
            const tbl = new OS2Head(this.offset).read(reader, ttf);

            // 补齐其他version的字段
            const os2Fields = {
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

        size(ttf) {

            // 更新其他表的统计信息
            // header
            let xMin = 16384;
            let yMin = 16384;
            let xMax = -16384;
            let yMax = -16384;

            // hhea
            let advanceWidthMax = -1;
            let minLeftSideBearing = 16384;
            let minRightSideBearing = 16384;
            let xMaxExtent = -16384;

            // os2 count
            let xAvgCharWidth = 0;
            let usFirstCharIndex = 0x10FFFF;
            let usLastCharIndex = -1;

            // maxp
            let maxPoints = 0;
            let maxContours = 0;
            let maxCompositePoints = 0;
            let maxCompositeContours = 0;
            let maxSizeOfInstructions = 0;
            let maxComponentElements = 0;

            let glyfNotEmpty = 0; // 非空glyf
            const hinting = ttf.writeOptions ? ttf.writeOptions.hinting : false;

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


            ttf.glyf.forEach((glyf) => {

                // 统计control point信息
                if (glyf.compound) {
                    let compositeContours = 0;
                    let compositePoints = 0;
                    glyf.glyfs.forEach((g) => {
                        const cglyf = ttf.glyf[g.glyphIndex];
                        if (!cglyf) {
                            return;
                        }
                        compositeContours += cglyf.contours ? cglyf.contours.length : 0;
                        if (cglyf.contours && cglyf.contours.length) {
                            cglyf.contours.forEach((contour) => {
                                compositePoints += contour.length;
                            });
                        }
                    });

                    maxComponentElements++;
                    maxCompositePoints = Math.max(maxCompositePoints, compositePoints);
                    maxCompositeContours = Math.max(maxCompositeContours, compositeContours);
                }
                // 简单图元
                else if (glyf.contours && glyf.contours.length) {
                    maxContours = Math.max(maxContours, glyf.contours.length);

                    let points = 0;
                    glyf.contours.forEach((contour) => {
                        points += contour.length;
                    });
                    maxPoints = Math.max(maxPoints, points);
                }

                if (hinting && glyf.instructions) {
                    maxSizeOfInstructions = Math.max(maxSizeOfInstructions, glyf.instructions.length);
                }

                // 统计边界信息
                if (glyf.xMin < xMin) {
                    xMin = glyf.xMin;
                }

                if (glyf.yMin < yMin) {
                    yMin = glyf.yMin;
                }

                if (glyf.xMax > xMax) {
                    xMax = glyf.xMax;
                }

                if (glyf.yMax > yMax) {
                    yMax = glyf.yMax;
                }

                advanceWidthMax = Math.max(advanceWidthMax, glyf.advanceWidth);
                minLeftSideBearing = Math.min(minLeftSideBearing, glyf.leftSideBearing);
                minRightSideBearing = Math.min(minRightSideBearing, glyf.advanceWidth - glyf.xMax);
                xMaxExtent = Math.max(xMaxExtent, glyf.xMax);

                xAvgCharWidth += glyf.advanceWidth;

                glyfNotEmpty++;

                let unicodes = glyf.unicode;

                if (typeof glyf.unicode === 'number') {
                    unicodes = [glyf.unicode];
                }

                if (Array.isArray(unicodes)) {
                    unicodes.forEach((unicode) => {
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
                const {xMin, yMin, xMax, yMax} = ttf.support.head;
                if (xMin != null) {
                    ttf.head.xMin = xMin;
                }
                if (yMin != null) {
                    ttf.head.yMin = yMin;
                }
                if (xMax != null) {
                    ttf.head.xMax = xMax;
                }
                if (yMax != null) {
                    ttf.head.yMax = yMax;
                }

            }
            // hhea rewrite
            if (ttf.support.hhea) {
                const {advanceWidthMax, xMaxExtent, minLeftSideBearing, minRightSideBearing} = ttf.support.hhea;
                if (advanceWidthMax != null) {
                    ttf.hhea.advanceWidthMax = advanceWidthMax;
                }
                if (xMaxExtent != null) {
                    ttf.hhea.xMaxExtent = xMaxExtent;
                }
                if (minLeftSideBearing != null) {
                    ttf.hhea.minLeftSideBearing = minLeftSideBearing;
                }
                if (minRightSideBearing != null) {
                    ttf.hhea.minRightSideBearing = minRightSideBearing;
                }
            }
            // 这里根据存储的maxp来设置新的maxp，避免重复计算maxp
            ttf.maxp = ttf.maxp || {};
            ttf.support.maxp = {
                version: 1.0,
                numGlyphs: ttf.glyf.length,
                maxPoints,
                maxContours,
                maxCompositePoints,
                maxCompositeContours,
                maxZones: ttf.maxp.maxZones || 0,
                maxTwilightPoints: ttf.maxp.maxTwilightPoints || 0,
                maxStorage: ttf.maxp.maxStorage || 0,
                maxFunctionDefs: ttf.maxp.maxFunctionDefs || 0,
                maxStackElements: ttf.maxp.maxStackElements || 0,
                maxSizeOfInstructions,
                maxComponentElements,
                maxComponentDepth: maxComponentElements ? 1 : 0
            };

            return table.size.call(this, ttf);
        }
    }
);
