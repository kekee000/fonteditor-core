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
export default function readWindowsAllCodes(tables, ttf) {

    let codes = {};

    // 读取windows unicode 编码段
    let format0 = tables.find(function (item) {
        return item.format === 0;
    });

    // 读取windows unicode 编码段
    let format12 = tables.find(function (item) {
        return item.platformID === 3
            && item.encodingID === 10
            && item.format === 12;
    });

    let format4 = tables.find(function (item) {
        return item.platformID === 3
            && item.encodingID === 1
            && item.format === 4;
    });

    let format2 = tables.find(function (item) {
        return item.platformID === 3
            && item.encodingID === 3
            && item.format === 2;
    });

    let format14 = tables.find(function (item) {
        return item.platformID === 0
            && item.encodingID === 5
            && item.format === 14;
    });

    if (format0) {
        for (let i = 0, l = format0.glyphIdArray.length; i < l; i++) {
            if (format0.glyphIdArray[i]) {
                codes[i] = format0.glyphIdArray[i];
            }
        }
    }

    // format 14 support
    if (format14) {
        for (let i = 0, l = format14.groups.length; i < l; i++) {
            let {unicode, glyphId} = format14.groups[i];
            if (unicode) {
                codes[unicode] = glyphId;
            }
        }
    }

    // 读取format12表
    if (format12) {
        for (let i = 0, l = format12.nGroups; i < l; i++) {
            let group = format12.groups[i];
            let startId = group.startId;
            let start = group.start;
            let end = group.end;
            for (;start <= end;) {
                codes[start++] = startId++;
            }
        }
    }
    // 读取format4表
    else if (format4) {
        let segCount = format4.segCountX2 / 2;
        // graphIdArray 和idRangeOffset的偏移量
        let graphIdArrayIndexOffset = (format4.glyphIdArrayOffset - format4.idRangeOffsetOffset) / 2;

        for (let i = 0; i < segCount; ++i) {
            // 读取单个字符
            for (let start = format4.startCode[i], end = format4.endCode[i]; start <= end; ++start) {
                // range offset = 0
                if (format4.idRangeOffset[i] === 0) {
                    codes[start] = (start + format4.idDelta[i]) % 0x10000;
                }
                // rely on to glyphIndexArray
                else {
                    let index = i + format4.idRangeOffset[i] / 2
                        + (start - format4.startCode[i])
                        - graphIdArrayIndexOffset;

                    let graphId = format4.glyphIdArray[index];
                    if (graphId !== 0) {
                        codes[start] = (graphId + format4.idDelta[i]) % 0x10000;
                    }
                    else {
                        codes[start] = 0;
                    }

                }
            }
        }

        delete codes[65535];
    }
    // 读取format2表
    // see https://github.com/fontforge/fontforge/blob/master/fontforge/parsettf.c
    else if (format2) {
        let subHeadKeys = format2.subHeadKeys;
        let subHeads = format2.subHeads;
        let glyphs = format2.glyphs;
        let numGlyphs = ttf.maxp.numGlyphs;
        let index = 0;

        for (let i = 0; i < 256; i++) {
            // 单字节编码
            if (subHeadKeys[i] === 0) {
                if (i >= format2.maxPos) {
                    index = 0;
                }
                else if (i < subHeads[0].firstCode
                    || i >= subHeads[0].firstCode + subHeads[0].entryCount
                    || subHeads[0].idRangeOffset + (i - subHeads[0].firstCode) >= glyphs.length) {
                    index = 0;
                }
                else if ((index = glyphs[subHeads[0].idRangeOffset + (i - subHeads[0].firstCode)]) !== 0) {
                    index = index + subHeads[0].idDelta;
                }

                // 单字节解码
                if (index !== 0 && index < numGlyphs) {
                    codes[i] = index;
                }
            }
            else {
                let k = subHeadKeys[i];
                for (let j = 0, entryCount = subHeads[k].entryCount; j < entryCount; j++) {
                    if (subHeads[k].idRangeOffset + j >= glyphs.length) {
                        index = 0;
                    }
                    else if ((index = glyphs[subHeads[k].idRangeOffset + j]) !== 0) {
                        index = index + subHeads[k].idDelta;
                    }

                    if (index !== 0 && index < numGlyphs) {
                        let unicode = ((i << 8) | (j + subHeads[k].firstCode)) % 0xffff;
                        codes[unicode] = index;
                    }

                }
            }
        }
    }

    return codes;
}
