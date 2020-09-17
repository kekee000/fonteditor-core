/**
 * @file GPOS
 * @author fr33z00(https://github.com/fr33z00)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cvt.html
 */

import table from './table';

export default table.create(
    'GPOS',
    [],
    {

        read(reader, ttf) {
            const length = ttf.tables.GPOS.length;
            return reader.readBytes(this.offset, length);
        },

        write(writer, ttf) {
            if (ttf.GPOS) {
                writer.writeBytes(ttf.GPOS, ttf.GPOS.length);
            }
        },

        size(ttf) {
            return ttf.GPOS ? ttf.GPOS.length : 0;
        }
    }
);
