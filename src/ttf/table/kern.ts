/**
 * @file kern
 * @author fr33z00(https://github.com/fr33z00)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6kern.html
 */

import Reader from '../reader';
import {TTFObject} from '../ttf-types';
import Writer from '../writer';
import Table from './table';

export default class Kern extends Table {
    name = 'kern';

    read(reader: Reader, ttf: TTFObject) {
        const length = ttf.tables.kern.length;
        return reader.readBytes(this.offset, length);
    }

    write(writer: Writer, ttf: TTFObject) {
        if (ttf.kern) {
            writer.writeBytes(ttf.kern, ttf.kern.length);
        }
    }

    size(ttf: TTFObject): number {
        return ttf.kern ? ttf.kern.length : 0;
    }
}
