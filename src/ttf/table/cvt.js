/**
 * @file cvt表
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cvt.html
 */

import table from './table';

export default table.create(
    'cvt',
    [],
    {

        read(reader, ttf) {
            const length = ttf.tables.cvt.length;
            return reader.readBytes(this.offset, length);
        },

        write(writer, ttf) {
            if (ttf.cvt) {
                writer.writeBytes(ttf.cvt, ttf.cvt.length);
            }
        },

        size(ttf) {
            return ttf.cvt ? ttf.cvt.length : 0;
        }
    }
);
