/**
 * @file cmap 表
 * @author mengke01(kekee000@gmail.com)
 *
 * @see
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
 */

import Table from './table';
import Reader from '../reader';
import { TTFObject } from '../ttf-types';
import Writer from '../writer';
import readWindowsAllCodes from '../util/readWindowsAllCodes';

/**
 * 读取cmap子表
 *
 * @param reader Reader对象
 * @param ttf ttf对象
 * @param subTable 子表对象
 * @param cmapOffset 子表的偏移
 */
function readSubTable(reader: Reader, ttf: TTFObject, subTable: any, cmapOffset: number) {
    let i = 0;
    let l = 0;
    let glyphIdArray: number[] = [];
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
            const group: any = {};
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


/**
 * 创建`子表0`
 *
 * @param writer 写对象
 * @param unicodes unicodes列表
 * @return
 */
function writeSubTable0(writer: Writer, unicodes: number[]) {

    writer.writeUint16(0); // format
    writer.writeUint16(262); // length
    writer.writeUint16(0); // language

    // Array of unicodes 0..255
    let i = -1;
    let unicode;
    while ((unicode = unicodes.shift())) {
        while (++i < unicode[0]) {
            writer.writeUint8(0);
        }

        writer.writeUint8(unicode[1]);
        i = unicode[0];
    }

    while (++i < 256) {
        writer.writeUint8(0);
    }

    return writer;
}


/**
 * 创建`子表4`
 *
 * @param writer 写对象
 * @param segments 分块编码列表
 * @return
 */
function writeSubTable4(writer: Writer, segments: Array<{start: number, end: number, delta: number}>) {

    writer.writeUint16(4); // format
    writer.writeUint16(24 + segments.length * 8); // length
    writer.writeUint16(0); // language

    const segCount = segments.length + 1;
    const maxExponent = Math.floor(Math.log(segCount) / Math.LN2);
    const searchRange = 2 * Math.pow(2, maxExponent);

    writer.writeUint16(segCount * 2); // segCountX2
    writer.writeUint16(searchRange); // searchRange
    writer.writeUint16(maxExponent); // entrySelector
    writer.writeUint16(2 * segCount - searchRange); // rangeShift

    // end list
    segments.forEach((segment) => {
        writer.writeUint16(segment.end);
    });
    writer.writeUint16(0xFFFF); // end code
    writer.writeUint16(0); // reservedPad


    // start list
    segments.forEach((segment) => {
        writer.writeUint16(segment.start);
    });
    writer.writeUint16(0xFFFF); // start code

    // id delta
    segments.forEach((segment) => {
        writer.writeUint16(segment.delta);
    });
    writer.writeUint16(1);

    // Array of range offsets, it doesn't matter when deltas present
    for (let i = 0, l = segments.length; i < l; i++) {
        writer.writeUint16(0);
    }
    writer.writeUint16(0); // rangeOffsetArray should be finished with 0

    return writer;
}

/**
 * 创建`子表12`
 *
 * @param {Writer} writer 写对象
 * @param {Array} segments 分块编码列表
 * @return {Writer}
 */
function writeSubTable12(writer: Writer, segments: Array<{start: number, end: number, startId: number}>) {

    writer.writeUint16(12); // format
    writer.writeUint16(0); // reserved
    writer.writeUint32(16 + segments.length * 12); // length
    writer.writeUint32(0); // language
    writer.writeUint32(segments.length); // nGroups

    segments.forEach((segment) => {
        writer.writeUint32(segment.start);
        writer.writeUint32(segment.end);
        writer.writeUint32(segment.startId);
    });

    return writer;
}

/**
 * 写subtableheader
 *
 * @param {Writer} writer Writer对象
 * @param {number} platform 平台
 * @param {number} encoding 编码
 * @param {number} offset 偏移
 * @return {Writer}
 */
function writeSubTableHeader(writer: Writer, platform: number, encoding: number, offset: number) {
    writer.writeUint16(platform); // platform
    writer.writeUint16(encoding); // encoding
    writer.writeUint32(offset); // offset
    return writer;
}


/**
 * 获取format4 delta值
 * Delta is saved in signed int in cmap format 4 subtable,
 * but can be in -0xFFFF..0 interval.
 * -0x10000..-0x7FFF values are stored with offset.
 *
 * @param delta delta值
 * @return delta值
 */
function encodeDelta(delta: number) {
    return delta > 0x7FFF
        ? delta - 0x10000
        : (delta < -0x7FFF ? delta + 0x10000 : delta);
}

interface GlyphUnicode {
    unicode: number;
    id: number;
}

/**
 * 根据bound获取glyf segment
 *
 * @param glyfUnicodes glyf编码集合
 * @param bound 编码范围
 * @return 码表
 */
function getSegments(glyfUnicodes: GlyphUnicode[], bound?: number) {

    let prevGlyph: GlyphUnicode | null = null;
    const result: any[] = [];
    let segment: any = {};

    glyfUnicodes.forEach((glyph) => {

        if (bound === undefined || glyph.unicode <= bound) {
            // 初始化编码头部，这里unicode和graph id 都必须连续
            if (prevGlyph === null
                || glyph.unicode !== prevGlyph.unicode + 1
                || glyph.id !== prevGlyph.id + 1
            ) {
                if (prevGlyph !== null) {
                    segment.end = prevGlyph.unicode;
                    result.push(segment);
                    segment = {
                        start: glyph.unicode,
                        startId: glyph.id,
                        delta: encodeDelta(glyph.id - glyph.unicode)
                    };
                }
                else {
                    segment.start = glyph.unicode;
                    segment.startId = glyph.id;
                    segment.delta = encodeDelta(glyph.id - glyph.unicode);
                }
            }

            prevGlyph = glyph;
        }
    });

    // need to finish the last segment
    if (prevGlyph !== null) {
        segment.end = prevGlyph.unicode;
        result.push(segment);
    }

    // 返回编码范围
    return result;
}

/**
 * 获取format0编码集合
 *
 * @param glyfUnicodes glyf编码集合
 * @return 码表
 */
function getFormat0Segment(glyfUnicodes: GlyphUnicode[]) {
    const unicodes: any[] = [];
    glyfUnicodes.forEach((u) => {
        if (u.unicode !== undefined && u.unicode < 256) {
            unicodes.push([u.unicode, u.id]);
        }
    });

    // 按编码排序
    unicodes.sort((a, b) => a[0] - b[0]);

    return unicodes;
}


export default class Cmap extends Table {
    name = 'cmap';

    read(reader: Reader, ttf: TTFObject) {
        const tcmap: any = {};
        // eslint-disable-next-line no-invalid-this
        const cmapOffset = this.offset;

        reader.seek(cmapOffset);

        tcmap.version = reader.readUint16(); // 编码方式
        const numberSubtables = tcmap.numberSubtables = reader.readUint16(); // 表个数


        const subTables = tcmap.tables = []; // 名字表
        let offset = reader.offset;

        // 使用offset读取，以便于查找
        for (let i = 0, l = numberSubtables; i < l; i++) {
            const subTable: any = {};
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

    write(writer: Writer, ttf: TTFObject) {
        const hasGLyphsOver2Bytes = ttf.support.cmap.hasGLyphsOver2Bytes;

        // write table header.
        writer.writeUint16(0); // version
        writer.writeUint16(hasGLyphsOver2Bytes ? 4 : 3); // count

        // header size
        const subTableOffset = 4 + (hasGLyphsOver2Bytes ? 32 : 24);
        const format4Size = ttf.support.cmap.format4Size;
        const format0Size = ttf.support.cmap.format0Size;

        // subtable 4, unicode
        writeSubTableHeader(writer, 0, 3, subTableOffset);

        // subtable 0, mac standard
        writeSubTableHeader(writer, 1, 0, subTableOffset + format4Size);

        // subtable 4, windows standard
        writeSubTableHeader(writer, 3, 1, subTableOffset);

        if (hasGLyphsOver2Bytes) {
            writeSubTableHeader(writer, 3, 10, subTableOffset + format4Size + format0Size);
        }

        // write tables, order of table seem to be magic, it is taken from TTX tool
        writeSubTable4(writer, ttf.support.cmap.format4Segments);
        writeSubTable0(writer, ttf.support.cmap.format0Segments);

        if (hasGLyphsOver2Bytes) {
            writeSubTable12(writer, ttf.support.cmap.format12Segments);
        }
    }

    size(ttf: TTFObject): number {
        ttf.support.cmap = {};
        let glyfUnicodes: GlyphUnicode[] = [];
        ttf.glyf.forEach((glyph: any, index: number) => {

            let unicodes = glyph.unicode;

            if (typeof glyph.unicode === 'number') {
                unicodes = [glyph.unicode];
            }

            if (unicodes && unicodes.length) {
                unicodes.forEach((unicode: number) => {
                    glyfUnicodes.push({
                        unicode,
                        id: unicode !== 0xFFFF ? index : 0
                    });
                });
            }

        });

        glyfUnicodes = glyfUnicodes.sort((a: any, b: any) => a.unicode - b.unicode);

        ttf.support.cmap.unicodes = glyfUnicodes;

        const unicodes2Bytes = glyfUnicodes;

        ttf.support.cmap.format4Segments = getSegments(unicodes2Bytes, 0xFFFF);
        ttf.support.cmap.format4Size = 24
            + ttf.support.cmap.format4Segments.length * 8;

        ttf.support.cmap.format0Segments = getFormat0Segment(glyfUnicodes);
        ttf.support.cmap.format0Size = 262;

        // we need subtable 12 only if found unicodes with > 2 bytes.
        const hasGLyphsOver2Bytes = unicodes2Bytes.some((glyph: any) => glyph.unicode > 0xFFFF);

        if (hasGLyphsOver2Bytes) {
            ttf.support.cmap.hasGLyphsOver2Bytes = hasGLyphsOver2Bytes;

            const unicodes4Bytes = glyfUnicodes;

            ttf.support.cmap.format12Segments = getSegments(unicodes4Bytes);
            ttf.support.cmap.format12Size = 16
                + ttf.support.cmap.format12Segments.length * 12;
        }

        const size = 4 + (hasGLyphsOver2Bytes ? 32 : 24) // cmap header
            + ttf.support.cmap.format0Size // format 0
            + ttf.support.cmap.format4Size // format 4
            + (hasGLyphsOver2Bytes ? ttf.support.cmap.format12Size : 0); // format 12

        return size;
    }
}
