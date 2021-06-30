/**
 * @file woff转换ttf
 * @author mengke01(kekee000@gmail.com)
 */

import Reader from './reader';
import Writer from './writer';
import error from './error';

/**
 * woff格式转换成ttf字体格式
 *
 * @param {ArrayBuffer} woffBuffer woff缓冲数组
 * @param {Object} options 选项
 * @param {Object} options.inflate 解压相关函数
 *
 * @return {ArrayBuffer} ttf格式byte流
 */
export default function woff2ttf(woffBuffer, options = {}) {
    const reader = new Reader(woffBuffer);
    const signature = reader.readUint32(0);
    const flavor = reader.readUint32(4);

    if (signature !== 0x774F4646 || (flavor !== 0x10000 && flavor !== 0x4f54544f)) {
        reader.dispose();
        error.raise(10102);
    }

    const numTables = reader.readUint16(12);
    const ttfSize = reader.readUint32(16);
    const tableEntries = [];
    let tableEntry;
    let i;
    let l;

    // 读取woff表索引信息
    for (i = 0; i < numTables; ++i) {
        reader.seek(44 + i * 20);
        tableEntry = {
            tag: reader.readString(reader.offset, 4),
            offset: reader.readUint32(),
            compLength: reader.readUint32(),
            length: reader.readUint32(),
            checkSum: reader.readUint32()
        };

        // ttf 表数据
        const deflateData = reader.readBytes(tableEntry.offset, tableEntry.compLength);
        // 需要解压
        if (deflateData.length < tableEntry.length) {

            if (!options.inflate) {
                reader.dispose();
                error.raise(10105);
            }

            tableEntry.data = options.inflate(deflateData);
        }
        else {
            tableEntry.data = deflateData;
        }

        tableEntry.length = tableEntry.data.length;
        tableEntries.push(tableEntry);
    }


    const writer = new Writer(new ArrayBuffer(ttfSize));
    // 写头部
    const entrySelector = Math.floor(Math.log(numTables) / Math.LN2);
    const searchRange = Math.pow(2, entrySelector) * 16;
    const rangeShift = numTables * 16 - searchRange;

    writer.writeUint32(flavor);
    writer.writeUint16(numTables);
    writer.writeUint16(searchRange);
    writer.writeUint16(entrySelector);
    writer.writeUint16(rangeShift);

    // 写ttf表索引
    let tblOffset = 12 + 16 * tableEntries.length;
    for (i = 0, l = tableEntries.length; i < l; ++i) {
        tableEntry = tableEntries[i];
        writer.writeString(tableEntry.tag);
        writer.writeUint32(tableEntry.checkSum);
        writer.writeUint32(tblOffset);
        writer.writeUint32(tableEntry.length);
        tblOffset += tableEntry.length
            + (tableEntry.length % 4 ? 4 - tableEntry.length % 4 : 0);
    }

    // 写ttf表数据
    for (i = 0, l = tableEntries.length; i < l; ++i) {
        tableEntry = tableEntries[i];
        writer.writeBytes(tableEntry.data);
        if (tableEntry.length % 4) {
            writer.writeEmpty(4 - tableEntry.length % 4);
        }
    }

    return writer.getBuffer();
}
