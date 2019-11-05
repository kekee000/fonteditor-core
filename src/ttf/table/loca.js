/**
 * @file loca表
 * @author mengke01(kekee000@gmail.com)
 */

import table from './table';
import struct from './struct';

export default table.create(
    'loca',
    [],
    {

        read(reader, ttf) {
            let offset = this.offset;
            let indexToLocFormat = ttf.head.indexToLocFormat;
            // indexToLocFormat有2字节和4字节的区别
            let type = struct.names[(indexToLocFormat === 0) ? struct.Uint16 : struct.Uint32];
            let size = (indexToLocFormat === 0) ? 2 : 4; // 字节大小
            let sizeRatio = (indexToLocFormat === 0) ? 2 : 1; // 真实地址偏移
            let wordOffset = [];

            reader.seek(offset);

            let numGlyphs = ttf.maxp.numGlyphs;
            for (let i = 0; i < numGlyphs; ++i) {
                wordOffset.push(reader.read(type, offset, false) * sizeRatio);
                offset += size;
            }

            return wordOffset;
        },

        write(writer, ttf) {
            let glyfSupport = ttf.support.glyf;
            let offset = ttf.support.glyf.offset || 0;
            let indexToLocFormat = ttf.head.indexToLocFormat;
            let sizeRatio = (indexToLocFormat === 0) ? 0.5 : 1;
            let numGlyphs = ttf.glyf.length;

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

            return writer;
        },

        size(ttf) {
            let locaCount = ttf.glyf.length + 1;
            return ttf.head.indexToLocFormat ? locaCount * 4 : locaCount * 2;
        }
    }
);
