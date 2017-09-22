/**
 * @file ttf读取器
 * @author mengke01(kekee000@gmail.com)
 *
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */


define(
    function (require) {
        var Directory = require('./table/directory');
        var supportTables = require('./table/support');
        var Reader = require('./reader');
        var postName = require('./enum/postName');
        var error = require('./error');
        var compound2simpleglyf = require('./util/compound2simpleglyf');


        /**
         * 初始化
         *
         * @param {ArrayBuffer} buffer buffer对象
         * @return {Object} ttf对象
         */
        function read(buffer) {

            var reader = new Reader(buffer, 0, buffer.byteLength, false);

            var ttf = {};

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

            // searchRenge
            ttf.searchRenge = reader.readUint16();

            // entrySelector
            ttf.entrySelector = reader.readUint16();

            // rengeShift
            ttf.rengeShift = reader.readUint16();

            ttf.tables = new Directory(reader.offset).read(reader, ttf);

            if (!ttf.tables.glyf || !ttf.tables.head || !ttf.tables.cmap || !ttf.tables.hmtx) {
                error.raise(10204);
            }

            ttf.readOptions = this.options;

            // 读取支持的表数据
            Object.keys(supportTables).forEach(function (tableName) {

                if (ttf.tables[tableName]) {
                    var offset = ttf.tables[tableName].offset;
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
         * @param {Object} ttf ttf对象
         */
        function resolveGlyf(ttf) {

            var codes = ttf.cmap;
            var glyf = ttf.glyf;
            var subsetMap = ttf.readOptions.subset ? ttf.subsetMap : null; // 当前ttf的子集列表

            // unicode
            Object.keys(codes).forEach(function (c) {
                var i = codes[c];
                if (subsetMap && !subsetMap[i]) {
                    return;
                }
                if (!glyf[i].unicode) {
                    glyf[i].unicode = [];
                }
                glyf[i].unicode.push(+c);
            });

            // advanceWidth
            ttf.hmtx.forEach(function (item, i) {
                if (subsetMap && !subsetMap[i]) {
                    return;
                }
                glyf[i].advanceWidth = item.advanceWidth;
                glyf[i].leftSideBearing = item.leftSideBearing;
            });

            // format = 2 的post表会携带glyf name信息
            if (ttf.post && 2 === ttf.post.format) {
                var nameIndex = ttf.post.nameIndex;
                var names = ttf.post.names;
                nameIndex.forEach(function (nameIndex, i) {
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
                var subGlyf = [];
                Object.keys(subsetMap).forEach(function (i) {
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
         * @param {Object} ttf ttf对象
         */
        function cleanTables(ttf) {
            delete ttf.readOptions;
            delete ttf.tables;
            delete ttf.hmtx;
            delete ttf.loca;
            delete ttf.post;
            delete ttf.subsetMap;

            // 不携带hinting信息则删除hint相关表
            if (!this.options.hinting) {
                delete ttf.fpgm;
                delete ttf.cvt;
                delete ttf.prep;

                ttf.glyf.forEach(function (glyf) {
                    delete glyf.instructions;
                });
            }

            // 复合字形转简单字形
            if (this.options.compound2simple && ttf.maxp.maxComponentElements) {
                ttf.glyf.forEach(function (glyf, index) {
                    if (glyf.compound) {
                        compound2simpleglyf(index, ttf, true);
                    }
                });
                ttf.maxp.maxComponentElements = 0;
                ttf.maxp.maxComponentDepth = 0;
            }
        }


        /**
         * ttf读取器的构造函数
         *
         * @param {Object} options 写入参数
         * @param {boolean} options.hinting 保留hinting信息
         * @param {boolean} options.compound2simple 复合字形转简单字形
         * @constructor
         */
        function TTFReader(options) {
            options = options || {};
            options.subset = options.subset || [];       // 子集
            options.hinting = options.hinting || false; // 不保留hints信息
            options.compound2simple = options.compound2simple || false; // 复合字形转简单字形

            this.options = options;
        }

        /**
         * 获取解析后的ttf文档
         * @param {ArrayBuffer} buffer buffer对象
         *
         * @return {Object} ttf文档
         */
        TTFReader.prototype.read = function (buffer) {
            this.ttf = read.call(this, buffer);
            resolveGlyf.call(this, this.ttf);
            cleanTables.call(this, this.ttf);
            return this.ttf;
        };

        /**
         * 注销
         */
        TTFReader.prototype.dispose = function () {
            delete this.ttf;
            delete this.options;
        };

        return TTFReader;
    }
);
