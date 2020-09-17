/**
 * @file cff表
 * @author mengke01(kekee000@gmail.com)
 *
 * reference:
 * http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/font/pdfs/5176.CFF.pdf
 *
 * modify from:
 * https://github.com/nodebox/opentype.js/blob/master/src/tables/cff.js
 */

import table from './table';
import string from '../util/string';
import encoding from './cff/encoding';
import cffStandardStrings from './cff/cffStandardStrings';
import parseCFFDict from './cff/parseCFFDict';
import parseCFFGlyph from './cff/parseCFFGlyph';
import parseCFFCharset from './cff/parseCFFCharset';
import parseCFFEncoding from './cff/parseCFFEncoding';
import Reader from '../reader';

/**
 * 获取cff偏移
 *
 * @param  {Reader} reader  读取器
 * @param  {number} offSize 偏移大小
 * @param  {number} offset  起始偏移
 * @return {number}         偏移
 */
function getOffset(reader, offSize) {
    let v = 0;
    for (let i = 0; i < offSize; i++) {
        v <<= 8;
        v += reader.readUint8();
    }
    return v;
}

/**
 * 解析cff表头部
 *
 * @param  {Reader} reader 读取器
 * @return {Object}        头部字段
 */
function parseCFFHead(reader) {
    const head = {};
    head.startOffset = reader.offset;
    head.endOffset = head.startOffset + 4;
    head.formatMajor = reader.readUint8();
    head.formatMinor = reader.readUint8();
    head.size = reader.readUint8();
    head.offsetSize = reader.readUint8();
    return head;
}

/**
 * 解析`CFF`表索引
 *
 * @param  {Reader} reader       读取器
 * @param  {number} offset       偏移
 * @param  {Funciton} conversionFn 转换函数
 * @return {Object}              表对象
 */
function parseCFFIndex(reader, offset, conversionFn) {
    if (offset) {
        reader.seek(offset);
    }
    const start = reader.offset;
    const offsets = [];
    const objects = [];
    const count = reader.readUint16();
    let i;
    let l;
    if (count !== 0) {
        const offsetSize = reader.readUint8();
        for (i = 0, l = count + 1; i < l; i++) {
            offsets.push(getOffset(reader, offsetSize));
        }

        for (i = 0, l = count; i < l; i++) {
            let value = reader.readBytes(offsets[i + 1] - offsets[i]);
            if (conversionFn) {
                value = conversionFn(value);
            }
            objects.push(value);
        }
    }

    return {
        objects,
        startOffset: start,
        endOffset: reader.offset
    };
}

// Subroutines are encoded using the negative half of the number space.
// See type 2 chapter 4.7 "Subroutine operators".
function calcCFFSubroutineBias(subrs) {
    let bias;
    if (subrs.length < 1240) {
        bias = 107;
    }
    else if (subrs.length < 33900) {
        bias = 1131;
    }
    else {
        bias = 32768;
    }

    return bias;
}


export default table.create(
    'cff',
    [],
    {
        read(reader, font) {

            const offset = this.offset;
            reader.seek(offset);

            const head = parseCFFHead(reader);
            const nameIndex = parseCFFIndex(reader, head.endOffset, string.getString);
            const topDictIndex = parseCFFIndex(reader, nameIndex.endOffset);
            const stringIndex = parseCFFIndex(reader, topDictIndex.endOffset, string.getString);
            const globalSubrIndex = parseCFFIndex(reader, stringIndex.endOffset);

            const cff = {
                head
            };

            // 全局子glyf数据
            cff.gsubrs = globalSubrIndex.objects;
            cff.gsubrsBias = calcCFFSubroutineBias(globalSubrIndex.objects);

            // 顶级字典数据
            const dictReader = new Reader(new Uint8Array(topDictIndex.objects[0]).buffer);
            const topDict = parseCFFDict.parseTopDict(
                dictReader,
                0,
                dictReader.length,
                stringIndex.objects
            );
            cff.topDict = topDict;

            // 私有字典数据
            const privateDictLength = topDict.private[0];
            let privateDict = {};
            let privateDictOffset;
            if (privateDictLength) {
                privateDictOffset = offset + topDict.private[1];
                privateDict = parseCFFDict.parsePrivateDict(
                    reader,
                    privateDictOffset,
                    privateDictLength,
                    stringIndex.objects
                );
                cff.defaultWidthX = privateDict.defaultWidthX;
                cff.nominalWidthX = privateDict.nominalWidthX;
            }
            else {
                cff.defaultWidthX = 0;
                cff.nominalWidthX = 0;
            }

            // 私有子glyf数据
            if (privateDict.subrs) {
                const subrOffset = privateDictOffset + privateDict.subrs;
                const subrIndex = parseCFFIndex(reader, subrOffset);
                cff.subrs = subrIndex.objects;
                cff.subrsBias = calcCFFSubroutineBias(cff.subrs);
            }
            else {
                cff.subrs = [];
                cff.subrsBias = 0;
            }
            cff.privateDict = privateDict;

            // 解析glyf数据和名字
            const charStringsIndex = parseCFFIndex(reader, offset + topDict.charStrings);
            const nGlyphs = charStringsIndex.objects.length;

            if (topDict.charset < 3) {
                // @author: fr33z00
                // See end of chapter 13 (p22) of #5176.CFF.pdf :
                // Still more optimization is possible by
                // observing that many fonts adopt one of 3 common charsets. In
                // these cases the operand to the charset operator in the Top DICT
                // specifies a predefined charset id, in place of an offset, as shown in table 22
                cff.charset = cffStandardStrings;
            }
            else {
                cff.charset = parseCFFCharset(reader, offset + topDict.charset, nGlyphs, stringIndex.objects);
            }

            // Standard encoding
            if (topDict.encoding === 0) {
                cff.encoding = encoding.standardEncoding;
            }
            // Expert encoding
            else if (topDict.encoding === 1) {
                cff.encoding = encoding.expertEncoding;
            }
            else {
                cff.encoding = parseCFFEncoding(reader, offset + topDict.encoding);
            }

            cff.glyf = [];

            // only parse subset glyphs
            const subset = font.readOptions.subset;
            if (subset && subset.length > 0) {

                // subset map
                const subsetMap = {
                    0: true // 设置.notdef
                };
                const codes = font.cmap;

                // unicode to index
                Object.keys(codes).forEach((c) => {
                    if (subset.indexOf(+c) > -1) {
                        const i = codes[c];
                        subsetMap[i] = true;
                    }
                });
                font.subsetMap = subsetMap;

                Object.keys(subsetMap).forEach((i) => {
                    i = +i;
                    const glyf = parseCFFGlyph(charStringsIndex.objects[i], cff, i);
                    glyf.name = cff.charset[i];
                    cff.glyf[i] = glyf;
                });
            }
            // parse all
            else {
                for (let i = 0, l = nGlyphs; i < l; i++) {
                    const glyf = parseCFFGlyph(charStringsIndex.objects[i], cff, i);
                    glyf.name = cff.charset[i];
                    cff.glyf.push(glyf);
                }
            }

            return cff;
        },

        // eslint-disable-next-line no-unused-vars
        write(writer, font) {
            throw new Error('not support write cff table');
        },

        // eslint-disable-next-line no-unused-vars
        size(font) {
            throw new Error('not support get cff table size');
        }
    }
);
