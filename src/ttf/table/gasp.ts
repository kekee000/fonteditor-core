/**
 * @file gasp 表
 * 对于需要hinting的字号需要这个表，否则会导致错误
 * @author mengke01(kekee000@gmail.com)
 * reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gasp.html
 */

import Reader from '../reader';
import { TTFObject } from '../ttf-types';
import Writer from '../writer';
import Table from './table';

export default class Gasp extends Table {
    name = 'gasp';

    read(reader: Reader, ttf: TTFObject) {
        const length = ttf.tables.gasp.length;
        return reader.readBytes(this.offset, length);
    }

    write(writer: Writer, ttf: TTFObject) {
        if (ttf.gasp) {
            writer.writeBytes(ttf.gasp, ttf.gasp.length);
        }
    }

    size(ttf: TTFObject): number {
        return ttf.gasp ? ttf.gasp.length : 0;
    }
}
