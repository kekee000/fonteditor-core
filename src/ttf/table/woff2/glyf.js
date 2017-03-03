/**
 * @file woff2 glyf 表
 * @author mengke01(kekee000@gmail.com)
 */

// 98% of Google Fonts have no glyph above 5k bytes
// Largest glyph ever observed was 72k bytes
var defaultGlyphBuf = 5120;

define(
    function (require) {

        var table = require('../table');
        var woff2Util = require('../../util/woff2');

        function withSign(flag, baseval) {
            // Precondition: 0 <= baseval < 65536 (to avoid integer overflow)
            return (flag & 1) ? baseval : -baseval;
        }

        /**
         * 解析三元组
         *
         * @param {Reader} reader Reader对象
         * @param {Object} offsets 保存各个流的偏移
         * @param {number} nPoints 总点数
         * @return {Object} 字形的三元组
         */
        function tripletDecode(reader, offsets, nPoints) {
            var x = 0;
            var y = 0;
            var tripletIndex = 0;
            var result = [];

            for (var i = 0; i < nPoints; i++) {
                reader.seek(offsets.flagStream[0]);
                var flag = reader.readUint8();
                offsets.flagStream[0] = reader.offset;
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
                reader.seek(offsets.glyphStream[0]);
                if (flag < 10) {
                    dx = 0;
                    dy = withSign(flag, ((flag & 14) << 7) + reader.readUint8());
                }
                else if (flag < 20) {
                    dx = withSign(flag, (((flag - 10) & 14) << 7) + reader.readUint8());
                    dy = 0;
                }
                else if (flag < 84) {
                    var b0 = flag - 20;
                    var b1 = reader.readUint8();
                    dx = withSign(flag, 1 + (b0 & 0x30) + (b1 >> 4));
                    dy = withSign(flag >> 1, 1 + ((b0 & 0x0c) << 2) + (b1 & 0x0f));
                }
                else if (flag < 120) {
                    var b0 = flag - 84;
                    dx = withSign(flag, 1 + ((b0 / 12) << 8) + reader.readUint8());
                    dy = withSign(flag >> 1, 1 + (((b0 % 12) >> 2) << 8) + reader.readUint8());
                }
                else if (flag < 124) {
                    var b1 = reader.readUint8();
                    var b2 = reader.readUint8();
                    dx = withSign(flag, (b1 << 4) + (b2 >> 4));
                    dy = withSign(flag >> 1, ((b2 & 0x0f) << 8) + reader.readUint8());
                }
                else {
                    dx = withSign(flag, (reader.readUint8() << 8) + reader.readUint8());
                    dy = withSign(flag >> 1, (reader.readUint8() << 8) + reader.readUint8());
                }
                tripletIndex += nDataBytes;
                offsets.glyphStream[0] += nDataBytes;

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

                    var subStreams = {
                        nContourStream: 0,
                        nPointsStream: 0,
                        flagStream: 0,
                        glyphStream: 0,
                        compositeStream: 0,
                        bboxStream: 0,
                        instructionStream: 0
                    }

                    Object.keys(subStreams).forEach(function(key) {
                        var subStreamSize = reader.readUint32();
                        if (subStreamSize > ttf.tables.glyf.transformLength - offset) {
                            console.log('error');
                        }
                        subStreams[key] = [start + offset, subStreamSize];
                        offset += subStreamSize;
                    })

                    var bboxBitmap = [];
                    var bboxBitmapSize = ((numGlyphs + 31) >> 5) << 2;
                    reader.seek(subStreams.bboxStream[0]);

                    for (var i = 0; i < bboxBitmapSize; i++) {
                        bboxBitmap.push(reader.readUint8());
                    }

                    var nPointsVec;

                    for (var i = 0; i < numGlyphs; i++) {
                        glyf[i] = {
                            contours: []
                        };
                        var glyph_size = 0;
                        var hasBbox = false;

                        if (bboxBitmap[i >> 3] & (0x80 >> (i & 7))) {
                            hasBbox = true;
                        }

                        reader.seek(subStreams.nContourStream[0]);
                        var nContours = reader.readUint16();
                        subStreams.nContourStream[0] += 2;

                        if (nContours === 0xffff) {
                            // composite glyph

                        }
                        else if (nContours > 0) {
                            // simple glyph
                            nPointsVec = [];
                            var totalNPoints = 0;
                            reader.seek(subStreams.nPointsStream[0]);
                            for (var j = 0; j < nContours; j++) {
                                var nPointsContour = woff2Util.readUIntBase128(reader);
                                nPointsVec.push(nPointsContour);
                                totalNPoints += nPointsContour;
                            }
                            subStreams.nPointsStream[0] = reader.offset;

                            var endPtsOfContours = [];

                            for (var j = 0; j < nPointsVec.length; j++) {
                                endPtsOfContours[j] = j === 0 ? nPointsVec[j] : nPointsVec[j] + endPtsOfContours[j - 1];
                            }

                            endPtsOfContours = endPtsOfContours.map(function(el) {
                                return el - 1;
                            })

                            var flagSize = totalNPoints;
                            var triplets = tripletDecode(reader, subStreams, totalNPoints);

                            glyf[i].contours.push(triplets.slice(0, endPtsOfContours[0] + 1));

                            for (var j = 1, length = endPtsOfContours.length; j < length; j++) {
                                glyf[i].contours.push(triplets.slice(endPtsOfContours[j - 1] + 1, endPtsOfContours[j] + 1));
                            }

                            reader.seek(subStreams.glyphStream[0]);
                            var instructionSize = woff2Util.read255UShort(reader);
                            subStreams.glyphStream[0] = reader.offset;

                            // reader.seek(subStreams.instructionStream[0]);
                            // glyf[i].instruction = [];
                            // console.log(instructionSize);
                            // for (var j = 0; j < instructionSize; j++) {
                            //     glyf[i].instruction.push(reader.readUint8());
                            // }

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
