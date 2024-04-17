/**
 * @file ttf读取器
 * @author mengke01(kekee000@gmail.com)
 *
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */

import Directory from './table/directory';
import supportTables from './table/support';
import Reader from './reader';
import postName from './enum/postName';
import error from './error';
import compound2simpleglyf from './util/compound2simpleglyf';

export default class TTFReader {

    /**
     * ttf读取器的构造函数
     *
     * @param {Object} options 写入参数
     * @param {boolean} options.hinting 保留hinting信息
     * @param {boolean} options.compound2simple 复合字形转简单字形
     * @constructor
     */
    constructor(options = {}) {
        options.subset = options.subset || []; // 子集
        options.hinting = options.hinting || false; // 默认不保留 hints 信息
        options.kerning = options.kerning || false; // 默认不保留 kerning 信息
        options.compound2simple = options.compound2simple || false; // 复合字形转简单字形
        this.options = options;
    }

    /**
     * 初始化读取
     *
     * @param {ArrayBuffer} buffer buffer对象
     * @return {Object} ttf对象
     */
    readBuffer(buffer) {

        const reader = new Reader(buffer, 0, buffer.byteLength, false);

        const ttf = {};

        // version
        ttf.version = reader.readFixed(0);

        if (ttf.version !== 0x1) {
            error.raise(10101);
        }

        // num tables
        ttf.numTables = reader.readUint16();

        if (ttf.numTables <= 0 || ttf.numTables > 100) {
            error.raise(10101);
        }

        // searchRange
        ttf.searchRange = reader.readUint16();

        // entrySelector
        ttf.entrySelector = reader.readUint16();

        // rangeShift
        ttf.rangeShift = reader.readUint16();

        ttf.tables = new Directory(reader.offset).read(reader, ttf);

        if (!ttf.tables.glyf || !ttf.tables.head || !ttf.tables.cmap || !ttf.tables.hmtx) {
            error.raise(10204);
        }

        ttf.readOptions = this.options;

        // 读取支持的表数据
        Object.keys(supportTables).forEach((tableName) => {

            if (ttf.tables[tableName]) {
                const offset = ttf.tables[tableName].offset;
                ttf[tableName] = new supportTables[tableName](offset).read(reader, ttf);
            }
        });

        if (!ttf.glyf) {
            error.raise(10201);
        }

        reader.dispose();

        return ttf;
    }

    /**
     * 关联glyf相关的信息
     *
     * @param {Object} ttf ttf对象
     */
    resolveGlyf(ttf) {
        const codes = ttf.cmap;
        const glyf = ttf.glyf;
        const subsetMap = ttf.readOptions.subset ? ttf.subsetMap : null; // 当前ttf的子集列表

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

        // advanceWidth
        ttf.hmtx.forEach((item, i) => {
            if (subsetMap && !subsetMap[i]) {
                return;
            }
            glyf[i].advanceWidth = item.advanceWidth;
            glyf[i].leftSideBearing = item.leftSideBearing;
        });

        // format = 2 的post表会携带glyf name信息
        if (ttf.post && 2 === ttf.post.format) {
            const nameIndex = ttf.post.nameIndex;
            const names = ttf.post.names;
            nameIndex.forEach((nameIndex, i) => {
                if (subsetMap && !subsetMap[i]) {
                    return;
                }
                if (nameIndex <= 257) {
                    glyf[i].name = postName[nameIndex];
                }
                else {
                    glyf[i].name = names[nameIndex - 258] || '';
                }
            });
        }

        // 设置了subsetMap之后需要选取subset中的字形
        // 并且对复合字形转换成简单字形
        if (subsetMap) {
            const subGlyf = [];
            Object.keys(subsetMap).forEach((i) => {
                i = +i;
                if (glyf[i].compound) {
                    compound2simpleglyf(i, ttf, true);
                }
                subGlyf.push(glyf[i]);
            });
            ttf.glyf = subGlyf;
            // 转换之后不存在复合字形了
            ttf.maxp.maxComponentElements = 0;
            ttf.maxp.maxComponentDepth = 0;
        }
    }

    /**
     * 清除非必须的表
     *
     * @param {Object} ttf ttf对象
     */
    cleanTables(ttf) {
        delete ttf.readOptions;
        delete ttf.tables;
        delete ttf.hmtx;
        delete ttf.loca;
        if (ttf.post) {
            delete ttf.post.nameIndex;
            delete ttf.post.names;
        }

        delete ttf.subsetMap;

        // 不携带hinting信息则删除hint相关表
        if (!this.options.hinting) {
            delete ttf.fpgm;
            delete ttf.cvt;
            delete ttf.prep;
            ttf.glyf.forEach((glyf) => {
                delete glyf.instructions;
            });
        }

        if (!this.options.hinting && !this.options.kerning) {
            delete ttf.GPOS;
            delete ttf.kern;
            delete ttf.kerx;
        }

        // 复合字形转简单字形
        if (this.options.compound2simple && ttf.maxp.maxComponentElements) {
            ttf.glyf.forEach((glyf, index) => {
                if (glyf.compound) {
                    compound2simpleglyf(index, ttf, true);
                }
            });
            ttf.maxp.maxComponentElements = 0;
            ttf.maxp.maxComponentDepth = 0;
        }
    }

    /**
     * 获取解析后的ttf文档
     *
     * @param {ArrayBuffer} buffer buffer对象
     * @return {Object} ttf文档
     */
    read(buffer) {
        this.ttf = this.readBuffer(buffer);
        this.resolveGlyf(this.ttf);
        this.cleanTables(this.ttf);
        return this.ttf;
    }

    /**
     * 注销
     */
    dispose() {
        delete this.ttf;
        delete this.options;
    }

}
