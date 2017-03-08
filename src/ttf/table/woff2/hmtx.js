/**
 * @file woff2 hmtx 表
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var table = require('../table');

        var hmtx = table.create(
            'hmtx',
            [],
            {

                read: function (reader, ttf) {
                    if ((ttf.tables.hmtx.flags & 0x03) !== 1) {
                        throw new Exception('not support ttf transformation ' + (ttf.tables.hmtx.flags & 0x03) + '!');
                    }

                    reader.seek(this.offset);
                    var flags = reader.readerUint8();
                    var numOfLongHorMetrics = ttf.hhea.numOfLongHorMetrics;
                    var hMetrics = [];
                    var i;
                    var hMetric;
                    for (i = 0; i < numOfLongHorMetrics; ++i) {
                        hMetric = {};
                        hMetric.advanceWidth = reader.readUint16();
                        hMetrics.push(hMetric);
                    }

                    // 最后一个宽度
                    var advanceWidth = hMetrics[numOfLongHorMetrics - 1].advanceWidth;
                    var numOfLast = ttf.maxp.numGlyphs - numOfLongHorMetrics;

                    // 获取后续的hmetrics
                    for (i = 0; i < numOfLast; ++i) {
                        hMetric = {};
                        hMetric.advanceWidth = advanceWidth;
                        hMetrics.push(hMetric);
                    }

                    if ((flags & 0x01) === 0) {
                        for (i = 0; i < numOfLongHorMetrics; ++i) {
                            hMetrics[i].lsb = reader.readUint16();
                        }
                        var lsb = hMetrics[numOfLongHorMetrics - 1].lsb;
                        for (i = numOfLongHorMetrics; i < ttf.maxp.numGlyphs; ++i) {
                            hMetrics[i].lsb = lsb;
                        }
                    }

                    if ((flags & 0x02) === 0) {
                        for (i = 0; i < numOfLongHorMetrics; ++i) {
                            hMetrics[i].leftSideBearing = reader.readUint16();
                        }
                        var leftSideBearing = hMetrics[numOfLongHorMetrics - 1].leftSideBearing;
                        for (i = numOfLongHorMetrics; i < ttf.maxp.numGlyphs; ++i) {
                            hMetrics[i].leftSideBearing = leftSideBearing;
                        }
                    }

                    return hMetrics;
                },

                write: function (writer, ttf) {
                },

                size: function (ttf) {
                    return '';
                }
            }
        );

        return hmtx;
    }
);
