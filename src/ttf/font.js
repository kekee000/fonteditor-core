/**
 * @file 字体管理对象，处理字体相关的读取、查询、转换
 *
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {
    var lang = require('../common/lang');
    var bufferTool = require('../nodejs/buffer');

    var getEmptyttfObject = require('./getEmptyttfObject');
    var TTF = require('./ttf');

    var woff2ttf = require('./woff2ttf');
    var otf2ttfobject = require('./otf2ttfobject');
    var eot2ttf = require('./eot2ttf');
    var svg2ttfobject = require('./svg2ttfobject');
    var TTFReader = require('./ttfreader');

    var TTFWriter = require('./ttfwriter');
    var ttf2eot = require('./ttf2eot');
    var ttf2woff = require('./ttf2woff');
    var ttf2svg = require('./ttf2svg');

    var ttf2base64 = require('./ttf2base64');
    var eot2base64 = require('./eot2base64');
    var woff2base64 = require('./woff2base64');
    var svg2base64 = require('./svg2base64');
    var bytes2base64 = require('./util/bytes2base64');

    var optimizettf = require('./util/optimizettf');

    /**
     * 字体对象构造函数
     *
     * @param {ArrayBuffer|Buffer|string} buffer  字体数据
     * @param {Object} options  读取参数
     */
    function Font(buffer, options) {
        options = options || {
            type: 'ttf'
        };

        // 字形对象
        if (typeof buffer === 'object' && buffer.glyf) {
            this.set(buffer);
        }
        // buffer
        else if (buffer) {
            this.read(buffer, options);
        }
        // 空
        else {
            this.readEmpty();
        }
    }

    /**
     * 创建一个空的ttfObject对象
     *
     * @return {Font}
     */
    Font.prototype.readEmpty = function () {
        this.data = getEmptyttfObject();
        return this;
    };

    /**
     * 读取字体数据
     *
     * @param {ArrayBuffer|Buffer|string} buffer  字体数据
     * @param {Object} options  读取参数
     * @param {string} options.type 字体类型
     *
     * ttf, woff , eot 读取配置
     * @param {boolean} options.hinting 保留hinting信息
     * @param {boolean} options.compound2simple 复合字形转简单字形
     *
     * woff 读取配置
     * @param {Object} options.inflate 解压相关函数
     *
     * svg 读取配置
     * @param {boolean} options.combinePath 是否合并成单个字形，仅限于普通svg导入
     * @return {Font}
     */
    Font.prototype.read = function (buffer, options) {
        // nodejs buffer
        if (typeof Buffer === 'function') {
            if (buffer instanceof Buffer) {
                buffer = bufferTool.toArrayBuffer(buffer);
            }
        }

        if (options.type === 'ttf') {
            this.data = new TTFReader(options).read(buffer);
        }
        else if (options.type === 'otf') {
            this.data = otf2ttfobject(buffer, options);
        }
        else if (options.type === 'eot') {
            buffer = eot2ttf(buffer, options);
            this.data = new TTFReader(options).read(buffer);
        }
        else if (options.type === 'woff') {
            buffer = woff2ttf(buffer, options);
            this.data = new TTFReader(options).read(buffer);
        }
        else if (options.type === 'svg') {
            this.data = svg2ttfobject(buffer, options);
        }
        else {
            throw new Error('not support font type' + options.type);
        }

        this.type = options.type;
        return this;
    };

    /**
     * 写入字体数据
     *
     * @param {Object} options  写入参数
     * @param {string} options.type   字体类型, 默认 ttf
     * @param {boolean} options.toBuffer nodejs 环境中返回 Buffer 对象, 默认 true
     *
     * ttf 字体参数
     * @param {boolean} options.hinting 保留hinting信息
     *
     * svg,woff 字体参数
     * @param {Object} options.metadata 字体相关的信息
     *
     * woff 字体参数
     * @param {Object} options.deflate 压缩相关函数
     * @return {Buffer|ArrayBuffer|string}
     */
    Font.prototype.write = function (options) {
        options = options || {};
        if (!options.type) {
            options.type = this.type;
        }

        var buffer = null;
        if (options.type === 'ttf') {
            buffer = new TTFWriter(options).write(this.data);
        }
        else if (options.type === 'eot') {
            buffer = new TTFWriter(options).write(this.data);
            buffer = ttf2eot(buffer, options);
        }
        else if (options.type === 'woff') {
            buffer = new TTFWriter(options).write(this.data);
            buffer = ttf2woff(buffer, options);
        }
        else if (options.type === 'svg') {
            buffer = ttf2svg(this.data, options);
        }
        else {
            throw new Error('not support font type' + options.type);
        }

        if (typeof Buffer === 'function') {
            if (false !== options.toBuffer && buffer instanceof ArrayBuffer) {
                buffer = bufferTool.toBuffer(buffer);
            }
        }

        return buffer;
    };

    /**
     * 转换成 base64编码
     *
     * @param {Object} options  写入参数
     * @param {string} options.type   字体类型, 默认 ttf
     * 其他 options参数, 参考 write
     * @see Font.prototype.write
     *
     * @param {ArrayBuffer} buffer  如果提供了buffer数据则使用 buffer数据, 否则转换现有的 font
     * @return {Buffer|ArrayBuffer|string}
     */
    Font.prototype.toBase64 = function (options, buffer) {
        options = options || {};
        if (!options.type) {
            options.type = this.type;
        }

        if (buffer) {
            if (typeof Buffer === 'function') {
                if (buffer instanceof Buffer) {
                    buffer = bufferTool.toArrayBuffer(buffer);
                }
            }
        }
        else {
            options.toBuffer = false;
            buffer = this.write(options);
        }

        var base64Str;
        if (options.type === 'ttf') {
            base64Str = ttf2base64(buffer);
        }
        else if (options.type === 'eot') {
            base64Str = eot2base64(buffer);
        }
        else if (options.type === 'woff') {
            base64Str = woff2base64(buffer);
        }
        else if (options.type === 'svg') {
            base64Str = svg2base64(buffer);
        }
        else {
            throw new Error('not support font type' + options.type);
        }

        return base64Str;
    };

    /**
     * 设置 font 对象
     *
     * @return {Object} ttfObject 对象
     */
    Font.prototype.set = function (data) {
        this.data = data;
        return this;
    };

    /**
     * 获取 font 数据
     *
     * @return {Object} ttfObject 对象
     */
    Font.prototype.get = function () {
        return this.data;
    };

    /**
     * 对字形数据进行优化
     *
     * @param  {Object} out  输出结果
     * @param  {boolean|Object} out.result `true` 或者有问题的地方
     * @return {Font}
     */
    Font.prototype.optimize = function (out) {
        var result = optimizettf(this.data);
        if (out) {
            out.result = result;
        }
        return this;
    };

    /**
     * 将字体中的复合字形转为简单字形
     *
     * @return {this}
     */
    Font.prototype.compound2simple = function () {
        var ttf = new TTF(this.data);
        ttf.compound2simple();
        this.data = ttf.get();
        return this;
    };

    /**
     * 对字形按照unicode编码排序
     *
     * @return {this}
     */
    Font.prototype.sort = function () {
        var ttf = new TTF(this.data);
        ttf.sortGlyf();
        this.data = ttf.get();
        return this;
    };

    /**
     * 查找相关字形
     *
     * @param  {Object} condition 查询条件
     * @param  {Array|number} condition.unicode unicode编码列表或者单个unicode编码
     * @param  {string} condition.name glyf名字，例如`uniE001`, `uniE`
     * @param  {Function} condition.filter 自定义过滤器
     * @example
     *     condition.filter = function (glyf) {
     *         return glyf.name === 'logo';
     *     }
     * @return {Array}  glyf字形列表
     */
    Font.prototype.find = function (condition) {
        var ttf = new TTF(this.data);
        var indexList = ttf.findGlyf(condition);
        return indexList.length ? ttf.getGlyf(indexList) : indexList;
    };

    /**
     * 合并 font 到当前的 font
     *
     * @param {Object} font Font 对象
     * @param {Object} options 参数选项
     * @param {boolean} options.scale 是否自动缩放
     * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
     *                                     (和 options.scale 参数互斥)
     *
     * @return {Font}
     */
    Font.prototype.merge = function (font, options) {
        var ttf = new TTF(this.data);
        ttf.mergeGlyf(font.get(), options);
        this.data = ttf.get();
        return this;
    };

    /**
     * 读取字体数据
     *
     * @param {ArrayBuffer|Buffer|string} buffer 字体数据
     * @param {Object} options  读取参数
     * @return {Font}
     */
    Font.create = function (buffer, options) {
        return new Font(buffer, options);
    };

    /**
     * base64序列化buffer 数据
     *
     * @param {ArrayBuffer|Buffer|string} buffer 字体数据
     * @return {Font}
     */
    Font.toBase64 = function (buffer) {
        if (typeof buffer === 'string') {
            // node 环境中没有 btoa 函数
            if (!btoa) {
                return new Buffer(buffer, 'binary').toString('base64');
            }

            return btoa(buffer);
        }
        else {
            return bytes2base64(buffer);
        }
    };

    return Font;
});
