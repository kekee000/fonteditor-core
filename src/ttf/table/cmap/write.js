/**
 * @file 写cmap表
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 创建`子表0`
 *
 * @param {Writer} writer 写对象
 * @param {Array} unicodes unicodes列表
 * @return {Writer}
 */
function writeSubTable0(writer, unicodes) {

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
 * @param {Writer} writer 写对象
 * @param {Array} segments 分块编码列表
 * @return {Writer}
 */
function writeSubTable4(writer, segments) {

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
function writeSubTable12(writer, segments) {

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
function writeSubTableHeader(writer, platform, encoding, offset) {
    writer.writeUint16(platform); // platform
    writer.writeUint16(encoding); // encoding
    writer.writeUint32(offset); // offset
    return writer;
}


/**
 * 写cmap表数据
 *
 * @param  {Object} writer 写入器
 * @param  {Object} ttf    ttf对象
 * @return {Object}        写入器
 */
export default function write(writer, ttf) {
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

    return writer;
}
