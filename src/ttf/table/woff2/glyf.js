/**
 * @file woff2 glyf 表
 * @author mengke01(kekee000@gmail.com)
 */

// 98% of Google Fonts have no glyph above 5k bytes
// Largest glyph ever observed was 72k bytes
var defaultGlyphBuf = 5120;
var MAX_INSTRUCTION_LENGTH = 5000; // 设置instructions阈值防止读取错误

define(
    function (require) {

        var table = require('../table');
        var woff2Util = require('../../util/woff2');
        var componentFlag = require('../../enum/componentFlag');

        function withSign(flag, baseval) {
            // Precondition: 0 <= baseval < 65536 (to avoid integer overflow)
            return (flag & 1) ? baseval : -baseval;
        }

        /**
         * 解析三元组
         *
         * @param {Array} flagIn 标志流
         * @param {Reader} glyphStream 字形流
         * @param {number} nPoints 总点数
         * @return {Object} 字形的三元组
         */
        function tripletDecode(flagIn, glyphStream, nPoints) {
            var x = 0;
            var y = 0;
            var tripletIndex = 0;
            var result = [];

            for (var i = 0; i < nPoints; i++) {
                var flag = flagIn[i];
                var onCurve = !(flag >> 7);
                flag &= 0x7f;
                var nDataBytes = 0;
                if (flag < 84) {
                    nDataBytes = 1;
                }
                else if (flag < 120) {
                    nDataBytes = 2;
                }
                else if (flag < 124) {
                    nDataBytes = 3;
                }
                else {
                    nDataBytes = 4;
                }

                var dx, dy;
                if (flag < 10) {
                    dx = 0;
                    dy = withSign(flag, ((flag & 14) << 7) + glyphStream.readUint8());
                }
                else if (flag < 20) {
                    dx = withSign(flag, (((flag - 10) & 14) << 7) + glyphStream.readUint8());
                    dy = 0;
                }
                else if (flag < 84) {
                    var b0 = flag - 20;
                    var b1 = glyphStream.readUint8();
                    dx = withSign(flag, 1 + (b0 & 0x30) + (b1 >> 4));
                    dy = withSign(flag >> 1, 1 + ((b0 & 0x0c) << 2) + (b1 & 0x0f));
                }
                else if (flag < 120) {
                    var b0 = flag - 84;
                    dx = withSign(flag, 1 + ((b0 / 12) << 8) + glyphStream.readUint8());
                    dy = withSign(flag >> 1, 1 + (((b0 % 12) >> 2) << 8) + glyphStream.readUint8());
                }
                else if (flag < 124) {
                    var b1 = glyphStream.readUint8();
                    var b2 = glyphStream.readUint8();
                    dx = withSign(flag, (b1 << 4) + (b2 >> 4));
                    dy = withSign(flag >> 1, ((b2 & 0x0f) << 8) + glyphStream.readUint8());
                }
                else {
                    dx = withSign(flag, (glyphStream.readUint8() << 8) + glyphStream.readUint8());
                    dy = withSign(flag >> 1, (glyphStream.readUint8() << 8) + glyphStream.readUint8());
                }
                tripletIndex += nDataBytes;

                // Possible overflow but coordinate values are not security sensitive
                x += dx;
                y += dy;
                var tmp = {
                    x: x,
                    y: y
                }
                if (onCurve) {
                    tmp.onCurve = onCurve
                }
                result.push(tmp);
            }
            return result;
        }

        /**
         * 读取复合字形
         *
         * @param {Reader} compositeStream 复合字形数据流
         * @param {Reader} glyphStream 字形流
         * @param {Reader} instructionStream 指令流
         * @param {Reader} bboxStream 框数据流
         * @param {Object} glyf glyf对象
         * @return {Object} glyf对象
         */
        function parseCompoundGlyf(compositeStream, glyphStream, instructionStream, bboxStream, glyf) {
            glyf.xMin = bboxStream.readInt16();
            glyf.yMin = bboxStream.readInt16();
            glyf.xMax = bboxStream.readInt16();
            glyf.yMax = bboxStream.readInt16();
            glyf.compound = true;
            glyf.glyfs = [];

            var flags;
            var g;

            // 读取复杂字形
            do {
                flags = compositeStream.readUint16();
                g = {};
                g.flags = flags;
                g.glyphIndex = compositeStream.readUint16();

                var arg1 = 0;
                var arg2 = 0;
                var scaleX = 16384;
                var scaleY = 16384;
                var scale01 = 0;
                var scale10 = 0;

                if (componentFlag.ARG_1_AND_2_ARE_WORDS & flags) {
                    arg1 = compositeStream.readInt16();
                    arg2 = compositeStream.readInt16();

                }
                else {
                    arg1 = compositeStream.readInt8();
                    arg2 = compositeStream.readInt8();
                }

                if (componentFlag.ROUND_XY_TO_GRID & flags) {
                    arg1 = Math.round(arg1);
                    arg2 = Math.round(arg2);
                }

                if (componentFlag.WE_HAVE_A_SCALE & flags) {
                    scaleX = compositeStream.readInt16();
                    scaleY = scaleX;
                }
                else if (componentFlag.WE_HAVE_AN_X_AND_Y_SCALE & flags) {
                    scaleX = compositeStream.readInt16();
                    scaleY = compositeStream.readInt16();
                }
                else if (componentFlag.WE_HAVE_A_TWO_BY_TWO & flags) {
                    scaleX = compositeStream.readInt16();
                    scale01 = compositeStream.readInt16();
                    scale10 = compositeStream.readInt16();
                    scaleY = compositeStream.readInt16();
                }

                if (componentFlag.ARGS_ARE_XY_VALUES & flags) {
                    g.useMyMetrics = !!flags & componentFlag.USE_MY_METRICS;
                    g.overlapCompound = !!flags & componentFlag.OVERLAP_COMPOUND;

                    g.transform = {
                        a: Math.round(10000 * scaleX / 16384) / 10000,
                        b: Math.round(10000 * scale01 / 16384) / 10000,
                        c: Math.round(10000 * scale10 / 16384) / 10000,
                        d: Math.round(10000 * scaleY / 16384) / 10000,
                        e: arg1,
                        f: arg2
                    };
                }
                else {
                    error.raise(10202);
                }

                glyf.glyfs.push(g);

            } while (componentFlag.MORE_COMPONENTS & flags);

            if (componentFlag.WE_HAVE_INSTRUCTIONS & flags) {
                var length = woff2Util.read255UShort(glyphStream);
                if (length < MAX_INSTRUCTION_LENGTH) {
                    var instructions = [];
                    for (var i = 0; i < length; ++i) {
                        instructions.push(instructionStream.readUint8());
                    }
                    glyf.instructions = instructions;
                }
                else {
                    console.warn(length);
                }
            }

            return glyf;
        }

        var glyf = table.create(
            'glyf',
            [],
            {

                read: function (reader, ttf) {
                    var start = this.offset;
                    reader.seek(this.offset);

                    var version = reader.readFixed();
                    var numGlyphs = reader.readUint16();
                    var indexFormat = reader.readUint16();

                    var glyf = [];

                    // number of sub streams
                    var numSubStreams = 7;
                    var offset = (2 + numSubStreams) * 4;
                    var subStreams = [];

                    var subStreams = {};

                    var streamNames = ['nContourStream', 'nPointsStream', 'flagStream', 'glyphStream', 'compositeStream', 'bboxStream', 'instructionStream'];

                    streamNames.forEach(function(key) {
                        var subStreamSize = reader.readUint32();
                        if (subStreamSize > ttf.tables.glyf.transformLength - offset) {
                            console.log('error');
                        }
                        subStreams[key] = reader.slice(start + offset, subStreamSize);
                        offset += subStreamSize;
                    })

                    var bboxBitmapSize = ((numGlyphs + 31) >> 5) << 2;
                    var bboxBitmap = new Uint8Array(subStreams.bboxStream.view.buffer, subStreams.bboxStream.offset, bboxBitmapSize);

                    subStreams.bboxStream.seek(bboxBitmapSize);

                    for (var i = 0; i < numGlyphs; i++) {
                        glyf[i] = {};
                        var glyph_size = 0;
                        var hasBbox = false;

                        if (bboxBitmap[i >> 3] & (0x80 >> (i & 7))) {
                            hasBbox = true;
                        }

                        var nContours = subStreams.nContourStream.readUint16();

                        if (nContours === 0xffff) {
                            // composite glyph
                            glyf[i] = parseCompoundGlyf(subStreams.compositeStream, subStreams.glyphStream, subStreams.instructionStream, subStreams.bboxStream, glyf[i]);

                        }
                        else if (nContours > 0) {
                            // simple glyph
                            var nPointsVec = [];
                            var totalNPoints = 0;
                            for (var j = 0; j < nContours; j++) {
                                var nPointsContour = woff2Util.read255UShort(subStreams.nPointsStream);
                                nPointsVec.push(nPointsContour);
                                totalNPoints += nPointsContour;
                            }

                            var endPtsOfContours = [];

                            for (var j = 0; j < nPointsVec.length; j++) {
                                endPtsOfContours[j] = j === 0 ? nPointsVec[j] : nPointsVec[j] + endPtsOfContours[j - 1];
                            }

                            endPtsOfContours = endPtsOfContours.map(function(el) {
                                return el - 1;
                            })

                            var flagSize = totalNPoints;
                            var flagStreamOffset = subStreams.flagStream.offset;
                            var flagIn = subStreams.flagStream.readBytes(flagSize);
                            var triplets = tripletDecode(flagIn, subStreams.glyphStream, totalNPoints);

                            subStreams.flagStream.seek(flagStreamOffset + flagSize);

                            glyf[i].xMin = Infinity;
                            glyf[i].yMin = Infinity;
                            glyf[i].xMax = -Infinity;
                            glyf[i].yMax = -Infinity;
                            glyf[i].contours = [];

                            for (var j = 0; j < triplets.length; j++) {
                                if (triplets[j].x > glyf[i].xMax) {
                                    glyf[i].xMax = triplets[j].x;
                                }
                                if (triplets[j].x < glyf[i].xMin) {
                                    glyf[i].xMin = triplets[j].x;
                                }
                                if (triplets[j].y > glyf[i].yMax) {
                                    glyf[i].yMax = triplets[j].y;
                                }
                                if (triplets[j].y < glyf[i].yMin) {
                                    glyf[i].yMin = triplets[j].y;
                                }
                            }

                            glyf[i].contours.push(triplets.slice(0, endPtsOfContours[0] + 1));

                            for (var j = 1, length = endPtsOfContours.length; j < length; j++) {
                                glyf[i].contours.push(triplets.slice(endPtsOfContours[j - 1] + 1, endPtsOfContours[j] + 1));
                            }

                            var instructionSize = woff2Util.read255UShort(subStreams.glyphStream);
                            if (instructionSize > 0) {
                                glyf[i].instructions = [];
                                for (var j = 0; j < instructionSize; j++) {
                                    glyf[i].instructions.push(subStreams.instructionStream.readUint8());
                                }
                            }

                            if (hasBbox) {
                                glyf[i].xMin = bboxStream.readInt16();
                                glyf[i].yMin = bboxStream.readInt16();
                                glyf[i].xMax = bboxStream.readInt16();
                                glyf[i].yMax = bboxStream.readInt16();
                            }
                        }
                        else {
                            glyf[i].contours = [];
                        }

                    }

                    return glyf;

                },

                write: function (writer, ttf) {
                },

                size: function (ttf) {
                    return '';
                }
            }
        );

        return glyf;
    }
);
