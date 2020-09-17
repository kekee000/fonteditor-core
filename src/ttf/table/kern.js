/**
 * @file kern
 * @author fr33z00(https://github.com/fr33z00)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cvt.html
 */

import table from './table';

export default table.create(
    'kern',
    [],
    {

        read(reader, ttf) {
            const length = ttf.tables.kern.length;
            return reader.readBytes(this.offset, length);
        },

        write(writer, ttf) {
            if (ttf.kern) {
                writer.writeBytes(ttf.kern, ttf.kern.length);
            }
        },

        size(ttf) {
            return ttf.kern ? ttf.kern.length : 0;
        }
    }
);
