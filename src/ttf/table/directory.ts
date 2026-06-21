/**
 * @file directory 表, 读取和写入ttf表索引
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6.html
 */

import Reader from '../reader';
import { TTFObject, TTFTableDirectory } from '../ttf-types';
import Writer from '../writer';
import Table from './table';

export default class Directory extends Table {
    name = 'directory';

    read(reader: Reader, ttf: TTFObject) {
        const tables: TTFTableDirectory = {};
        const numTables = ttf.numTables;
        const offset = this.offset!;

        for (let i = offset, l = numTables * 16; i < l; i += 16) {
            const name = reader.readString(i, 4).trim();

            tables[name] = {
                name,
                checkSum: reader.readUint32(i + 4),
                offset: reader.readUint32(i + 8),
                length: reader.readUint32(i + 12)
            };
        }
        return tables;
    }

    write(writer: Writer, ttf: TTFObject) {
        const tables = ttf.support.tables;
        for (let i = 0, l = tables.length; i < l; i++) {
            writer.writeString((tables[i].name + '    ').slice(0, 4));
            writer.writeUint32(tables[i].checkSum);
            writer.writeUint32(tables[i].offset);
            writer.writeUint32(tables[i].length);
        }
    }

    size(ttf: TTFObject): number {
        return ttf.numTables * 16;
    }
}
