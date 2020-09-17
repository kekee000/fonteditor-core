/**
 * @file hmtx 表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hmtx.html
 */

import table from './table';

export default table.create(
    'hmtx',
    [],
    {

        read(reader, ttf) {
            const offset = this.offset;
            reader.seek(offset);

            const numOfLongHorMetrics = ttf.hhea.numOfLongHorMetrics;
            const hMetrics = [];
            let i;
            let hMetric;
            for (i = 0; i < numOfLongHorMetrics; ++i) {
                hMetric = {};
                hMetric.advanceWidth = reader.readUint16();
                hMetric.leftSideBearing = reader.readInt16();
                hMetrics.push(hMetric);
            }

            // 最后一个宽度
            const advanceWidth = hMetrics[numOfLongHorMetrics - 1].advanceWidth;
            const numOfLast = ttf.maxp.numGlyphs - numOfLongHorMetrics;

            // 获取后续的hmetrics
            for (i = 0; i < numOfLast; ++i) {
                hMetric = {};
                hMetric.advanceWidth = advanceWidth;
                hMetric.leftSideBearing = reader.readInt16();
                hMetrics.push(hMetric);
            }

            return hMetrics;

        },

        write(writer, ttf) {
            let i;
            const numOfLongHorMetrics = ttf.hhea.numOfLongHorMetrics;
            for (i = 0; i < numOfLongHorMetrics; ++i) {
                writer.writeUint16(ttf.glyf[i].advanceWidth);
                writer.writeInt16(ttf.glyf[i].leftSideBearing);
            }

            // 最后一个宽度
            const numOfLast = ttf.glyf.length - numOfLongHorMetrics;

            for (i = 0; i < numOfLast; ++i) {
                writer.writeInt16(ttf.glyf[numOfLongHorMetrics + i].leftSideBearing);
            }

            return writer;
        },

        size(ttf) {

            // 计算同最后一个advanceWidth相等的元素个数
            let numOfLast = 0;
            // 最后一个advanceWidth
            const advanceWidth = ttf.glyf[ttf.glyf.length - 1].advanceWidth;

            for (let i = ttf.glyf.length - 2; i >= 0; i--) {
                if (advanceWidth === ttf.glyf[i].advanceWidth) {
                    numOfLast++;
                }
                else {
                    break;
                }
            }

            ttf.hhea.numOfLongHorMetrics = ttf.glyf.length - numOfLast;

            return 4 * ttf.hhea.numOfLongHorMetrics + 2 * numOfLast;
        }
    }
);
