/**
 * @file prep表
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: http://www.microsoft.com/typography/otspec140/prep.htm
 */

import Reader from '../reader';
import {TTFObject} from '../ttf-types';
import Writer from '../writer';
import Table from './table';

export default class Prep extends Table {
    name = 'prep';

    read(reader: Reader, ttf: TTFObject) {
        const length = ttf.tables.prep.length;
        return reader.readBytes(this.offset, length);
    }

    write(writer: Writer, ttf: TTFObject) {
        if (ttf.prep) {
            writer.writeBytes(ttf.prep, ttf.prep.length);
        }
    }

    size(ttf: TTFObject): number {
        return ttf.prep ? ttf.prep.length : 0;
    }
}
