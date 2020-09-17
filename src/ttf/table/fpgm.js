/**
 * @file fpgm 表
 * @author mengke01(kekee000@gmail.com)
 *
 * reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6fpgm.html
 */

import table from './table';

export default table.create(
    'fpgm',
    [],
    {

        read(reader, ttf) {
            const length = ttf.tables.fpgm.length;
            return reader.readBytes(this.offset, length);
        },

        write(writer, ttf) {
            if (ttf.fpgm) {
                writer.writeBytes(ttf.fpgm, ttf.fpgm.length);
            }
        },

        size(ttf) {
            return ttf.fpgm ? ttf.fpgm.length : 0;
        }
    }
);

