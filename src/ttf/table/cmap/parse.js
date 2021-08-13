/**
 * @file 解析cmap表
 * @author mengke01(kekee000@gmail.com)
 */

import readWindowsAllCodes from '../../util/readWindowsAllCodes';

/**
 * 读取cmap子表
 *
 * @param {Reader} reader Reader对象
 * @param {Object} ttf ttf对象
 * @param {Object} subTable 子表对象
 * @param {number} cmapOffset 子表的偏移
 */
function readSubTable(reader, ttf, subTable, cmapOffset) {
    let i;
    let l;
    let glyphIdArray;
    const startOffset = cmapOffset + subTable.offset;
    let glyphCount;
    subTable.format = reader.readUint16(startOffset);

    // 0～256 紧凑排列
    if (subTable.format === 0) {
        const format0 = subTable;
        // 跳过format字段
        format0.length = reader.readUint16();
        format0.language = reader.readUint16();
        glyphIdArray = [];
        for (i = 0, l = format0.length - 6; i < l; i++) {
            glyphIdArray.push(reader.readUint8());
        }
        format0.glyphIdArray = glyphIdArray;
    }
    else if (subTable.format === 2) {
        const format2 = subTable;
        // 跳过format字段
        format2.length = reader.readUint16();
        format2.language = reader.readUint16();

        const subHeadKeys = [];
        let maxSubHeadKey = 0;// 最大索引
        let maxPos = -1; // 最大位置
        for (let i = 0, l = 256; i < l; i++) {
            subHeadKeys[i] = reader.readUint16() / 8;
            if (subHeadKeys[i] > maxSubHeadKey) {
                maxSubHeadKey = subHeadKeys[i];
                maxPos = i;
            }
        }

        const subHeads = [];
        for (i = 0; i <= maxSubHeadKey; i++) {
            subHeads[i] = {
                firstCode: reader.readUint16(),
                entryCount: reader.readUint16(),
                idDelta: reader.readUint16(),
                idRangeOffset: (reader.readUint16() - (maxSubHeadKey - i) * 8 - 2) / 2
            };
        }

        glyphCount = (startOffset + format2.length - reader.offset) / 2;
        const glyphs = [];
        for (i = 0; i < glyphCount; i++) {
            glyphs[i] = reader.readUint16();
        }

        format2.subHeadKeys = subHeadKeys;
        format2.maxPos = maxPos;
        format2.subHeads = subHeads;
        format2.glyphs = glyphs;

    }
    // 双字节编码，非紧凑排列
    else if (subTable.format === 4) {
        const format4 = subTable;
        // 跳过format字段
        format4.length = reader.readUint16();
        format4.language = reader.readUint16();
        format4.segCountX2 = reader.readUint16();
        format4.searchRange = reader.readUint16();
        format4.entrySelector = reader.readUint16();
        format4.rangeShift = reader.readUint16();

        const segCount = format4.segCountX2 / 2;

        // end code
        const endCode = [];
        for (i = 0; i < segCount; ++i) {
            endCode.push(reader.readUint16());
        }
        format4.endCode = endCode;

        format4.reservedPad = reader.readUint16();

        // start code
        const startCode = [];
        for (i = 0; i < segCount; ++i) {
            startCode.push(reader.readUint16());
        }
        format4.startCode = startCode;

        // idDelta
        const idDelta = [];
        for (i = 0; i < segCount; ++i) {
            idDelta.push(reader.readUint16());
        }
        format4.idDelta = idDelta;


        format4.idRangeOffsetOffset = reader.offset;

        // idRangeOffset
        const idRangeOffset = [];
        for (i = 0; i < segCount; ++i) {
            idRangeOffset.push(reader.readUint16());
        }
        format4.idRangeOffset = idRangeOffset;

        // 总长度 - glyphIdArray起始偏移/2
        glyphCount = (format4.length - (reader.offset - startOffset)) / 2;

        // 记录array offset
        format4.glyphIdArrayOffset = reader.offset;

        // glyphIdArray
        glyphIdArray = [];
        for (i = 0; i < glyphCount; ++i) {
            glyphIdArray.push(reader.readUint16());
        }

        format4.glyphIdArray = glyphIdArray;
    }

    else if (subTable.format === 6) {
        const format6 = subTable;

        format6.length = reader.readUint16();
        format6.language = reader.readUint16();
        format6.firstCode = reader.readUint16();
        format6.entryCount = reader.readUint16();

        // 记录array offset
        format6.glyphIdArrayOffset = reader.offset;

        const glyphIndexArray = [];
        const entryCount = format6.entryCount;
        // 读取字符分组
        for (i = 0; i < entryCount; ++i) {
            glyphIndexArray.push(reader.readUint16());
        }
        format6.glyphIdArray = glyphIndexArray;

    }
    // defines segments for sparse representation in 4-byte character space
    else if (subTable.format === 12) {
        const format12 = subTable;

        format12.reserved = reader.readUint16();
        format12.length = reader.readUint32();
        format12.language = reader.readUint32();
        format12.nGroups = reader.readUint32();

        const groups = [];
        const nGroups = format12.nGroups;
        // 读取字符分组
        for (i = 0; i < nGroups; ++i) {
            const group = {};
            group.start = reader.readUint32();
            group.end = reader.readUint32();
            group.startId = reader.readUint32();
            groups.push(group);
        }
        format12.groups = groups;
    }
    // format 14
    else if (subTable.format === 14) {
        const format14 = subTable;
        format14.length = reader.readUint32();
        const numVarSelectorRecords = reader.readUint32();
        const groups = [];
        let offset = reader.offset;
        for (let i = 0; i < numVarSelectorRecords; i++) {
            const varSelector = reader.readUint24(offset);
            const defaultUVSOffset = reader.readUint32(offset + 3);
            const nonDefaultUVSOffset = reader.readUint32(offset + 7);
            offset += 11;

            if (defaultUVSOffset) {
                const numUnicodeValueRanges = reader.readUint32(startOffset + defaultUVSOffset);
                for (let j = 0; j < numUnicodeValueRanges; j++) {
                    const startUnicode = reader.readUint24();
                    const additionalCount = reader.readUint8();
                    groups.push({
                        start: startUnicode,
                        end: startUnicode + additionalCount,
                        varSelector
                    });
                }
            }
            if (nonDefaultUVSOffset) {
                const numUVSMappings = reader.readUint32(startOffset + nonDefaultUVSOffset);
                for (let j = 0; j < numUVSMappings; j++) {
                    const unicode = reader.readUint24();
                    const glyphId = reader.readUint16();
                    groups.push({
                        unicode,
                        glyphId,
                        varSelector
                    });
                }
            }
        }
        format14.groups = groups;
    }
    else {
        console.warn('not support cmap format:' + subTable.format);
    }
}


export default function parse(reader, ttf) {
    const tcmap = {};
    // eslint-disable-next-line no-invalid-this
    const cmapOffset = this.offset;

    reader.seek(cmapOffset);

    tcmap.version = reader.readUint16(); // 编码方式
    const numberSubtables = tcmap.numberSubtables = reader.readUint16(); // 表个数


    const subTables = tcmap.tables = []; // 名字表
    let offset = reader.offset;

    // 使用offset读取，以便于查找
    for (let i = 0, l = numberSubtables; i < l; i++) {
        const subTable = {};
        subTable.platformID = reader.readUint16(offset);
        subTable.encodingID = reader.readUint16(offset + 2);
        subTable.offset = reader.readUint32(offset + 4);

        readSubTable(reader, ttf, subTable, cmapOffset);
        subTables.push(subTable);

        offset += 8;
    }

    const cmap = readWindowsAllCodes(subTables, ttf);

    return cmap;
}
