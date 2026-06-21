/**
 * @file fpgm 表
 * @author mengke01(kekee000@gmail.com)
 *
 * reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6fpgm.html
 */
import Reader from '../reader';
import { TTFObject } from '../ttf-types';
import Writer from '../writer';
import Table from './table';

export default class Fpgm extends Table {
    name = 'fpgm';

    read(reader: Reader, ttf: TTFObject) {
        const length = ttf.tables.fpgm.length;
        return reader.readBytes(this.offset, length);
    }

    write(writer: Writer, ttf: TTFObject) {
        if (ttf.fpgm) {
            writer.writeBytes(ttf.fpgm, ttf.fpgm.length);
        }
    }

    size(ttf: TTFObject): number {
        return ttf.fpgm ? ttf.fpgm.length : 0;
    }
}
