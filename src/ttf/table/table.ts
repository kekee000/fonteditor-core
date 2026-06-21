/**
 * @file ttf表基类
 * @author mengke01(kekee000@gmail.com)
 */

import struct, {names as structNames} from './struct';
import error from '../error';
import Reader from '../reader';
import {TTFObject} from '../ttf-types';
import Writer from '../writer';

/**
 * ttf 表基类，子类通过覆盖 `name` / `struct` 字段以及 `read` / `write` / `size`
 * 等方法来定制具体表的解析与序列化逻辑。
 */
export default class Table {
    name: string = '';
    struct: Array<[string, number, number?]> = [];
    offset: number | undefined;
    [key: string]: any;

    constructor(offset?: number) {
        this.offset = offset;
    }

    /**
     * 读取表结构
     *
     * @param reader reader对象
     * @return 当前对象
     */
    read(reader: Reader, _ttf?: TTFObject) {
        const offset = this.offset;

        if (undefined !== offset) {
            reader.seek(offset);
        }

        const me = this;

        this.struct.forEach((item) => {
            const name = item[0];
            const type = item[1];
            let typeName = null;
            switch (type) {
                case struct.Int8:
                case struct.Uint8:
                case struct.Int16:
                case struct.Uint16:
                case struct.Int32:
                case struct.Uint32:
                    typeName = structNames[type];
                    me[name] = reader.read(typeName);
                    break;

                case struct.Fixed:
                    me[name] = reader.readFixed();
                    break;

                case struct.LongDateTime:
                    me[name] = reader.readLongDateTime();
                    break;

                case struct.Bytes:
                    me[name] = reader.readBytes(reader.offset, item[2] || 0);
                    break;

                case struct.Char:
                    me[name] = reader.readChar(reader.offset);
                    break;

                case struct.String:
                    me[name] = reader.readString(reader.offset, item[2] || 0);
                    break;

                default:
                    error.raise(10003, name, type);
            }
        });

        return this.valueOf();
    }

    /**
     * 写表结构
     *
     * @param writer writer对象
     * @param ttf 已解析的ttf对象
     *
     * @return 返回writer对象
     */
    write(writer: Writer, ttf: TTFObject) {
        const table = ttf[this.name];

        if (!table) {
            error.raise(10203, this.name);
        }

        this.struct.forEach((item) => {
            const name = item[0];
            const type = item[1];
            let typeName = null;
            switch (type) {
                case struct.Int8:
                case struct.Uint8:
                case struct.Int16:
                case struct.Uint16:
                case struct.Int32:
                case struct.Uint32:
                    typeName = structNames[type];
                    writer.write(typeName, table[name]);
                    break;

                case struct.Fixed:
                    writer.writeFixed(table[name]);
                    break;

                case struct.LongDateTime:
                    writer.writeLongDateTime(table[name]);
                    break;

                case struct.Bytes:
                    writer.writeBytes(table[name], item[2] || 0);
                    break;

                case struct.Char:
                    writer.writeChar(table[name]);
                    break;

                case struct.String:
                    writer.writeString(table[name], item[2] || 0);
                    break;

                default:
                    error.raise(10003, name, type);
            }
        });
    }

    /**
     * 获取ttf表的size大小
     *
     * @return {number} 表大小
     */
    size(_ttf?: TTFObject): number {
        let sz = 0;
        this.struct.forEach((item) => {
            const type = item[1];
            switch (type) {
                case struct.Int8:
                case struct.Uint8:
                    sz += 1;
                    break;

                case struct.Int16:
                case struct.Uint16:
                    sz += 2;
                    break;

                case struct.Int32:
                case struct.Uint32:
                case struct.Fixed:
                    sz += 4;
                    break;

                case struct.LongDateTime:
                    sz += 8;
                    break;

                case struct.Bytes:
                    sz += item[2] || 0;
                    break;

                case struct.Char:
                    sz += 1;
                    break;

                case struct.String:
                    sz += item[2] || 0;
                    break;

                default:
                    error.raise(10003, item[0], type);
            }
        });

        return sz;
    }

    /**
     * 获取对象的值
     *
     * @return {*} 当前对象的值
     */
    valueOf(): Record<string, any> {
        const val: Record<string, any> = {};
        this.struct.forEach((item) => {
            val[item[0]] = this[item[0]];
        });
        return val;
    }
}
