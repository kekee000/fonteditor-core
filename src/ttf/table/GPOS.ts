/**
 * @file GPOS
 * @author fr33z00(https://github.com/fr33z00)
 *
 * @reference: https://learn.microsoft.com/en-us/typography/opentype/spec/gpos
 */
import Reader from '../reader';
import {TTFObject} from '../ttf-types';
import Writer from '../writer';
import Table from './table';

export default class GPOS extends Table {
    name = 'GPOS';

    read(reader: Reader, ttf: TTFObject) {
        const length = ttf.tables.GPOS.length;
        return reader.readBytes(this.offset, length);
    }

    write(writer: Writer, ttf: TTFObject) {
        if (ttf.GPOS) {
            writer.writeBytes(ttf.GPOS, (ttf.GPOS as ArrayLike<number>).length);
        }
    }

    size(ttf: TTFObject): number {
        return ttf.GPOS ? (ttf.GPOS as ArrayLike<number>).length : 0;
    }
}
