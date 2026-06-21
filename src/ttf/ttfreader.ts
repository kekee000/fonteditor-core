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

export interface TTFReaderOptions {
    subset?: number[];
    hinting?: boolean;
    kerning?: boolean;
    compound2simple?: boolean;
    [key: string]: any;
}

export default class TTFReader {

    options: TTFReaderOptions;
    ttf: any;

    constructor(options: TTFReaderOptions = {}) {
        options.subset = options.subset || []; // 子集
        options.hinting = options.hinting || false; // 默认不保留 hints 信息
        options.kerning = options.kerning || false; // 默认不保留 kerning 信息
        options.compound2simple = options.compound2simple || false; // 复合字形转简单字形
        this.options = options;
    }

    /**
     * 初始化读取
     */
    readBuffer(buffer: ArrayBuffer): any {

        const reader = new Reader(buffer, 0, buffer.byteLength, false);

        const ttf: any = {};

        ttf.version = reader.readFixed(0);

        if (ttf.version !== 0x1) {
            error.raise(10101);
        }

        ttf.numTables = reader.readUint16();

        if (ttf.numTables <= 0 || ttf.numTables > 100) {
            error.raise(10101);
        }

        ttf.searchRange = reader.readUint16();
        ttf.entrySelector = reader.readUint16();
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
                ttf[tableName] = new (supportTables as any)[tableName](offset).read(reader, ttf);
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
     */
    resolveGlyf(ttf: any): void {
        const codes = ttf.cmap;
        const glyf = ttf.glyf;
        const subsetMap = ttf.readOptions.subset ? ttf.subsetMap : null;

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
        ttf.hmtx.forEach((item: any, i: number) => {
            if (subsetMap && !subsetMap[i]) {
                return;
            }
            glyf[i].advanceWidth = item.advanceWidth;
            glyf[i].leftSideBearing = item.leftSideBearing;
        });

        // format = 2 的post表会携带glyf name信息
        if (ttf.post && 2 === ttf.post.format) {
            const nameIndex: number[] = ttf.post.nameIndex;
            const names: string[] = ttf.post.names;
            nameIndex.forEach((nameIndex, i) => {
                if (subsetMap && !subsetMap[i]) {
                    return;
                }
                if (nameIndex <= 257) {
                    glyf[i].name = (postName as any)[nameIndex];
                }
                else {
                    glyf[i].name = names[nameIndex - 258] || '';
                }
            });
        }

        // 设置了subsetMap之后需要选取subset中的字形
        if (subsetMap) {
            const subGlyf: any[] = [];
            Object.keys(subsetMap).forEach((key) => {
                const i = +key;
                if (glyf[i].compound) {
                    compound2simpleglyf(i, ttf, true);
                }
                subGlyf.push(glyf[i]);
            });
            ttf.glyf = subGlyf;
            ttf.maxp.maxComponentElements = 0;
            ttf.maxp.maxComponentDepth = 0;
        }
    }

    /**
     * 清除非必须的表
     */
    cleanTables(ttf: any): void {
        delete ttf.readOptions;
        delete ttf.tables;
        delete ttf.hmtx;
        delete ttf.loca;
        if (ttf.post) {
            delete ttf.post.nameIndex;
            delete ttf.post.names;
        }

        delete ttf.subsetMap;

        if (!this.options.hinting) {
            delete ttf.fpgm;
            delete ttf.cvt;
            delete ttf.prep;
            ttf.glyf.forEach((glyf: any) => {
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
            ttf.glyf.forEach((glyf: any, index: number) => {
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
     */
    read(buffer: ArrayBuffer): any {
        this.ttf = this.readBuffer(buffer);
        this.resolveGlyf(this.ttf);
        this.cleanTables(this.ttf);
        return this.ttf;
    }

    dispose(): void {
        this.ttf = undefined;
        this.options = {};
    }

}
