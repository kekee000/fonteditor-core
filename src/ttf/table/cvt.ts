/**
 * @file cvt表
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cvt.html
 */

import Reader from '../reader';
import Writer from '../writer';
import { TTFObject } from '../ttf-types';
import Table from './table';

export default class Cvt extends Table {
    name = 'cvt';

    read(reader: Reader, ttf: TTFObject) {
        const length = ttf.tables.cvt.length;
        return reader.readBytes(this.offset, length);
    }

    write(writer: Writer, ttf: TTFObject) {
        if (ttf.cvt) {
            writer.writeBytes(ttf.cvt, ttf.cvt.length);
        }
    }

    size(ttf: TTFObject): number {
        return ttf.cvt ? ttf.cvt.length : 0;
    }
}
