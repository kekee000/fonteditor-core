/**
 * @file kerx
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6kerx.html
 */

import Reader from '../reader';
import {TTFObject} from '../ttf-types';
import Writer from '../writer';
import Table from './table';

export default class Kerx extends Table {
    name = 'kerx';

    read(reader: Reader, ttf: TTFObject) {
        const length = ttf.tables.kerx.length;
        return reader.readBytes(this.offset, length);
    }

    write(writer: Writer, ttf: TTFObject) {
        if (ttf.kerx) {
            writer.writeBytes(ttf.kerx, ttf.kerx.length);
        }
    }

    size(ttf: TTFObject): number {
        return ttf.kerx ? ttf.kerx.length : 0;
    }
}
