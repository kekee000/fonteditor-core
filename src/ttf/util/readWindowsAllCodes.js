/**
 * @file 读取windows支持的字符集
 * @author mengke01(kekee000@gmail.com)
 *
 * @see
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
 */


define(
    function (require) {

        /**
         * 读取ttf中windows字符表的字符
         * @param {Array} tables cmap表结构
         * @param {Object} ttf ttf对象
         * @return {Object} 字符字典索引，unicode => glyf index
         */
        function readWindowsAllCodes(tables, ttf) {

            var codes = {};
            var i;
            var l;
            var start;
            var end;
            // 读取windows unicode 编码段
            var format0 = tables.filter(function (item) {
                return item.format === 0;
            });

            if (format0.length) {
                format0 = format0[0];
                for (i = 0, l = format0.glyphIdArray.length; i < l; i++) {
                    if (format0.glyphIdArray[i]) {
                        codes[i] = format0.glyphIdArray[i];
                    }
                }
            }


            // 读取windows unicode 编码段
            var format12 = tables.filter(function (item) {
                return item.platformID === 3
                    && item.encodingID === 10
                    && item.format === 12;
            })[0];

            var format4 = tables.filter(function (item) {
                return item.platformID === 3
                    && item.encodingID === 1
                    && item.format === 4;
            })[0];

            var format2 = tables.filter(function (item) {
                return item.platformID === 3
                    && item.encodingID === 3
                    && item.format === 2;
            })[0];


            // 读取format12表
            if (format12) {
                for (i = 0, l = format12.nGroups; i < l; i++) {
                    var group = format12.groups[i];
                    var startId = group.startId;
                    start = group.start;
                    end = group.end;

                    for (;start <= end;) {
                        codes[start++] = startId++;
                    }
                }
            }
            // 读取format4表
            else if (format4) {
                var segCount = format4.segCountX2 / 2;
                // graphIdArray 和idRangeOffset的偏移量
                var graphIdArrayIndexOffset = (format4.glyphIdArrayOffset - format4.idRangeOffsetOffset) / 2;

                for (i = 0; i < segCount; ++i) {
                    // 读取单个字符
                    for (start = format4.startCode[i], end = format4.endCode[i]; start <= end; ++start) {
                        // range offset = 0
                        if (format4.idRangeOffset[i] === 0) {
                            codes[start] = (start + format4.idDelta[i]) % 0x10000;
                        }
                        // rely on to glyphIndexArray
                        else {
                            var index = i + format4.idRangeOffset[i] / 2
                                + (start - format4.startCode[i])
                                - graphIdArrayIndexOffset;

                            var graphId = format4.glyphIdArray[index];
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
                var subHeadKeys = format2.subHeadKeys;
                var subHeads = format2.subHeads;
                var glyphs = format2.glyphs;
                var numGlyphs = ttf.maxp.numGlyphs
                var index = 0;

                for (var i = 0; i < 256; i++) {
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
                        var k = subHeadKeys[i];
                        for (var j = 0, entryCount = subHeads[k].entryCount; j < entryCount; j++) {
                            if (subHeads[k].idRangeOffset + j >= glyphs.length) {
                                index = 0;
                            }
                            else if ((index = glyphs[subHeads[k].idRangeOffset + j]) !== 0) {
                                index = index + subHeads[k].idDelta;
                            }

                            if (index !== 0 && index < numGlyphs) {
                                var unicode = ((i <<8) | (j + subHeads[k].firstCode)) % 0xffff;
                                codes[unicode] = index;
                            }

                        }
                    }
                }
            }

            return codes;
        }

        return readWindowsAllCodes;
    }
);
