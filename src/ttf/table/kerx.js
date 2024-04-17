/**
 * @file kerx
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6kerx.html
 */

import table from './table';

export default table.create(
    'kerx',
    [],
    {

        read(reader, ttf) {
            const length = ttf.tables.kerx.length;
            return reader.readBytes(this.offset, length);
        },

        write(writer, ttf) {
            if (ttf.kerx) {
                writer.writeBytes(ttf.kerx, ttf.kerx.length);
            }
        },

        size(ttf) {
            return ttf.kerx ? ttf.kerx.length : 0;
        }
    }
);
