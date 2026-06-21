/**
 * @file loca表
 * @author mengke01(kekee000@gmail.com)
 */

import Table from './table';
import struct, {names as structNames} from './struct';
import Reader from '../reader';
import {TTFObject} from '../ttf-types';
import Writer from '../writer';

export default class Loca extends Table {
    name = 'loca';

    read(reader: Reader, ttf: TTFObject) {
        let offset = this.offset!;
        const indexToLocFormat = ttf.head.indexToLocFormat;
        // indexToLocFormat有2字节和4字节的区别
        const type = structNames[(indexToLocFormat === 0) ? struct.Uint16 : struct.Uint32];
        const size = (indexToLocFormat === 0) ? 2 : 4; // 字节大小
        const sizeRatio = (indexToLocFormat === 0) ? 2 : 1; // 真实地址偏移
        const wordOffset: number[] = [];

        reader.seek(offset);

        const numGlyphs = ttf.maxp.numGlyphs;
        for (let i = 0; i < numGlyphs; ++i) {
            wordOffset.push(reader.read(type, offset, false) * sizeRatio);
            offset += size;
        }

        return wordOffset;
    }

    write(writer: Writer, ttf: TTFObject) {
        const glyfSupport = ttf.support.glyf;
        let offset = ttf.support.glyf.offset || 0;
        const indexToLocFormat = ttf.head.indexToLocFormat;
        const sizeRatio = (indexToLocFormat === 0) ? 0.5 : 1;
        const numGlyphs = ttf.glyf.length;

        for (let i = 0; i < numGlyphs; ++i) {
            if (indexToLocFormat) {
                writer.writeUint32(offset);
            }
            else {
                writer.writeUint16(offset);
            }
            offset += glyfSupport[i].size * sizeRatio;
        }

        // write extra
        if (indexToLocFormat) {
            writer.writeUint32(offset);
        }
        else {
            writer.writeUint16(offset);
        }
    }

    size(ttf: TTFObject): number {
        const locaCount = ttf.glyf.length + 1;
        return ttf.head.indexToLocFormat ? locaCount * 4 : locaCount * 2;
    }
}
