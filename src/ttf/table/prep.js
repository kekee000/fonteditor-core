/**
 * @file prep表
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: http://www.microsoft.com/typography/otspec140/prep.htm
 */

import table from './table';

export default table.create(
    'prep',
    [],
    {

        read(reader, ttf) {
            const length = ttf.tables.prep.length;
            return reader.readBytes(this.offset, length);
        },

        write(writer, ttf) {
            if (ttf.prep) {
                writer.writeBytes(ttf.prep, ttf.prep.length);
            }
        },

        size(ttf) {
            return ttf.prep ? ttf.prep.length : 0;
        }
    }
);
