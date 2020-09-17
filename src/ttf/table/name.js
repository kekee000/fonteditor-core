/**
 * @file name表
 * @author mengke01(kekee000@gmail.com)
 */

import table from './table';
import nameIdTbl from '../enum/nameId';
import string from '../util/string';
import platformTbl from '../enum/platform';
import {mac, win} from '../enum/encoding';

export default table.create(
    'name',
    [],
    {

        read(reader) {
            let offset = this.offset;
            reader.seek(offset);

            const nameTbl = {};
            nameTbl.format = reader.readUint16();
            nameTbl.count = reader.readUint16();
            nameTbl.stringOffset = reader.readUint16();

            const nameRecordTbl = [];
            const count = nameTbl.count;
            let i;
            let nameRecord;

            for (i = 0; i < count; ++i) {
                nameRecord = {};
                nameRecord.platform = reader.readUint16();
                nameRecord.encoding = reader.readUint16();
                nameRecord.language = reader.readUint16();
                nameRecord.nameId = reader.readUint16();
                nameRecord.length = reader.readUint16();
                nameRecord.offset = reader.readUint16();
                nameRecordTbl.push(nameRecord);
            }

            offset += nameTbl.stringOffset;

            // 读取字符名字
            for (i = 0; i < count; ++i) {
                nameRecord = nameRecordTbl[i];
                nameRecord.name = reader.readBytes(offset + nameRecord.offset, nameRecord.length);
            }

            const names = {};

            // mac 下的english name
            let platform = platformTbl.Macintosh;
            let encoding = mac.Default;
            let language = 0;

            // 如果有windows 下的 english，则用windows下的 name
            if (nameRecordTbl.some((record) => record.platform === platformTbl.Microsoft
                    && record.encoding === win.UCS2
                    && record.language === 1033)) {
                platform = platformTbl.Microsoft;
                encoding = win.UCS2;
                language = 1033;
            }

            for (i = 0; i < count; ++i) {
                nameRecord = nameRecordTbl[i];
                if (nameRecord.platform === platform
                    && nameRecord.encoding === encoding
                    && nameRecord.language === language
                    && nameIdTbl[nameRecord.nameId]) {
                    names[nameIdTbl[nameRecord.nameId]] = language === 0
                        ? string.getUTF8String(nameRecord.name)
                        : string.getUCS2String(nameRecord.name);
                }
            }

            return names;
        },

        write(writer, ttf) {
            const nameRecordTbl = ttf.support.name;

            writer.writeUint16(0); // format
            writer.writeUint16(nameRecordTbl.length); // count
            writer.writeUint16(6 + nameRecordTbl.length * 12); // string offset

            // write name tbl header
            let offset = 0;
            nameRecordTbl.forEach((nameRecord) => {
                writer.writeUint16(nameRecord.platform);
                writer.writeUint16(nameRecord.encoding);
                writer.writeUint16(nameRecord.language);
                writer.writeUint16(nameRecord.nameId);
                writer.writeUint16(nameRecord.name.length);
                writer.writeUint16(offset); // offset
                offset += nameRecord.name.length;
            });

            // write name tbl strings
            nameRecordTbl.forEach((nameRecord) => {
                writer.writeBytes(nameRecord.name);
            });

            return writer;
        },

        size(ttf) {
            const names = ttf.name;
            let nameRecordTbl = [];

            // 写入name信息
            // 这里为了简化书写，仅支持英文编码字符，
            // 中文编码字符将被转化成url encode
            let size = 6;
            Object.keys(names).forEach((name) => {
                const id = nameIdTbl.names[name];

                const utf8Bytes = string.toUTF8Bytes(names[name]);
                const usc2Bytes = string.toUCS2Bytes(names[name]);

                if (undefined !== id) {
                    // mac
                    nameRecordTbl.push({
                        nameId: id,
                        platform: 1,
                        encoding: 0,
                        language: 0,
                        name: utf8Bytes
                    });

                    // windows
                    nameRecordTbl.push({
                        nameId: id,
                        platform: 3,
                        encoding: 1,
                        language: 1033,
                        name: usc2Bytes
                    });

                    // 子表大小
                    size += 12 * 2 + utf8Bytes.length + usc2Bytes.length;
                }
            });

            const namingOrder = ['platform', 'encoding', 'language', 'nameId'];
            nameRecordTbl = nameRecordTbl.sort((a, b) => {
                let l = 0;
                namingOrder.some(name => {
                    const o = a[name] - b[name];
                    if (o) {
                        l = o;
                        return true;
                    }
                    return false;
                });
                return l;
            });

            // 保存预处理信息
            ttf.support.name = nameRecordTbl;

            return size;
        }
    }
);
