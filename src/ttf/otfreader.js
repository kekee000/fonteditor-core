/**
 * @file otf字体读取
 * @author mengke01(kekee000@gmail.com)
 */

import Directory from './table/directory';
import supportTables from './table/support-otf';
import Reader from './reader';
import error from './error';

export default class OTFReader {

    /**
     * OTF读取函数
     *
     * @param {Object} options 写入参数
     * @constructor
     */
    constructor(options = {}) {
        options.subset = options.subset || [];
        this.options = options;
    }

    /**
     * 初始化
     *
     * @param {ArrayBuffer} buffer buffer对象
     * @return {Object} ttf对象
     */
    readBuffer(buffer) {

        const reader = new Reader(buffer, 0, buffer.byteLength, false);
        const font = {};

        // version
        font.version = reader.readString(0, 4);

        if (font.version !== 'OTTO') {
            error.raise(10301);
        }

        // num tables
        font.numTables = reader.readUint16();

        if (font.numTables <= 0 || font.numTables > 100) {
            error.raise(10302);
        }

        // searchRange
        font.searchRange = reader.readUint16();

        // entrySelector
        font.entrySelector = reader.readUint16();

        // rangeShift
        font.rangeShift = reader.readUint16();

        font.tables = new Directory(reader.offset).read(reader, font);

        if (!font.tables.head || !font.tables.cmap || !font.tables.CFF) {
            error.raise(10302);
        }

        font.readOptions = this.options;

        // 读取支持的表数据
        Object.keys(supportTables).forEach((tableName) => {
            if (font.tables[tableName]) {
                const offset = font.tables[tableName].offset;
                font[tableName] = new supportTables[tableName](offset).read(reader, font);
            }
        });

        if (!font.CFF.glyf) {
            error.raise(10303);
        }

        reader.dispose();

        return font;
    }

    /**
     * 关联glyf相关的信息
     *
     * @param {Object} font font对象
     */
    resolveGlyf(font) {

        const codes = font.cmap;
        let glyf = font.CFF.glyf;
        const subsetMap = font.readOptions.subset ? font.subsetMap : null; // 当前ttf的子集列表
        // unicode
        Object.keys(codes).forEach((c) => {
            const i = codes[c];
            if (subsetMap && !subsetMap[i]) {
                return;
            }
            if (!glyf[i].unicode) {
                glyf[i].unicode = [];
            }
            glyf[i].unicode.push(+c);
        });

        // leftSideBearing
        font.hmtx.forEach((item, i) => {
            if (subsetMap && !subsetMap[i]) {
                return;
            }
            glyf[i].advanceWidth = glyf[i].advanceWidth || item.advanceWidth || 0;
            glyf[i].leftSideBearing = item.leftSideBearing;
        });

        // 设置了subsetMap之后需要选取subset中的字形
        if (subsetMap) {
            const subGlyf = [];
            Object.keys(subsetMap).forEach((i) => {
                subGlyf.push(glyf[+i]);
            });
            glyf = subGlyf;
        }

        font.glyf = glyf;
    }

    /**
     * 清除非必须的表
     *
     * @param {Object} font font对象
     */
    cleanTables(font) {
        delete font.readOptions;
        delete font.tables;
        delete font.hmtx;
        delete font.post.glyphNameIndex;
        delete font.post.names;
        delete font.subsetMap;

        // 删除无用的表
        const cff = font.CFF;
        delete cff.glyf;
        delete cff.charset;
        delete cff.encoding;
        delete cff.gsubrs;
        delete cff.gsubrsBias;
        delete cff.subrs;
        delete cff.subrsBias;
    }

    /**
     * 获取解析后的ttf文档
     *
     * @param {ArrayBuffer} buffer buffer对象
     *
     * @return {Object} ttf文档
     */
    read(buffer) {
        this.font = this.readBuffer(buffer);
        this.resolveGlyf(this.font);
        this.cleanTables(this.font);
        return this.font;
    }

    /**
     * 注销
     */
    dispose() {
        delete this.font;
        delete this.options;
    }
}
