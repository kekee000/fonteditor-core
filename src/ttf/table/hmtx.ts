/**
 * @file hmtx 表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hmtx.html
 */

import Reader from '../reader';
import {TTFObject} from '../ttf-types';
import Writer from '../writer';
import Table from './table';

interface HhMetric {
    advanceWidth: number;
    leftSideBearing: number;
}

export default class Hmtx extends Table {
    name = 'hmtx';

    read(reader: Reader, ttf: TTFObject) {
        const offset = this.offset!;
        reader.seek(offset);

        const numOfLongHorMetrics = ttf.hhea.numOfLongHorMetrics;
        const hMetrics: HhMetric[] = [];
        for (let i = 0; i < numOfLongHorMetrics; ++i) {
            hMetrics.push({
                advanceWidth: reader.readUint16(),
                leftSideBearing: reader.readInt16()
            });
        }

        // 最后一个宽度
        const advanceWidth = hMetrics[numOfLongHorMetrics - 1].advanceWidth;
        const numOfLast = ttf.maxp.numGlyphs - numOfLongHorMetrics;

        // 获取后续的hmetrics
        for (let i = 0; i < numOfLast; ++i) {
            hMetrics.push({
                advanceWidth: advanceWidth,
                leftSideBearing: reader.readInt16()
            });
        }

        return hMetrics;
    }

    write(writer: Writer, ttf: TTFObject) {
        const numOfLongHorMetrics = ttf.hhea.numOfLongHorMetrics;
        for (let i = 0; i < numOfLongHorMetrics; ++i) {
            writer.writeUint16(ttf.glyf[i].advanceWidth);
            writer.writeInt16(ttf.glyf[i].leftSideBearing);
        }

        // 最后一个宽度
        const numOfLast = ttf.glyf.length - numOfLongHorMetrics;
        for (let i = 0; i < numOfLast; ++i) {
            writer.writeInt16(ttf.glyf[numOfLongHorMetrics + i].leftSideBearing);
        }
    }

    size(ttf: TTFObject): number {
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
