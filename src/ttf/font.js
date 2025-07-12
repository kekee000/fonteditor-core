/**
 * @file 字体管理对象，处理字体相关的读取、查询、转换
 *
 * @author mengke01(kekee000@gmail.com)
 */

import bufferTool from '../nodejs/buffer';

import getEmptyttfObject from './getEmptyttfObject';
import TTF from './ttf';

import woff2ttf from './woff2ttf';
import otf2ttfobject from './otf2ttfobject';
import eot2ttf from './eot2ttf';
import svg2ttfobject from './svg2ttfobject';
import TTFReader from './ttfreader';

import TTFWriter from './ttfwriter';
import ttf2eot from './ttf2eot';
import ttf2woff from './ttf2woff';
import ttf2svg from './ttf2svg';
import ttf2symbol from './ttf2symbol';
import ttftowoff2 from './ttftowoff2';
import woff2tottf from './woff2tottf';

import ttf2base64 from './ttf2base64';
import eot2base64 from './eot2base64';
import woff2base64 from './woff2base64';
import svg2base64 from './svg2base64';
import bytes2base64 from './util/bytes2base64';
import woff2tobase64 from './woff2tobase64';

import optimizettf from './util/optimizettf';

// 必须是nodejs环境下的Buffer对象才能触发buffer转换
const SUPPORT_BUFFER =
  typeof process === 'object' &&
  typeof process.versions === 'object' &&
  typeof process.versions.node !== 'undefined' &&
  typeof Buffer === 'function';

class Font {
    /**
     * 字体对象构造函数
     *
     * @param {ArrayBuffer|Buffer|string|Document} buffer  字体数据
     * @param {Object} options  读取参数
     */
    constructor(buffer, options = { type: 'ttf' }) {
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
     * Create a Font instance
     *
     * @param {ArrayBuffer|Buffer|string|Document} buffer  字体数据
     * @param {Object} options  读取参数
     * @return {Font}
     */
    static create(buffer, options) {
        return new Font(buffer, options);
    }

    /**
     * 设置一个空的 ttfObject 对象
     *
     * @return {Font}
     */
    readEmpty() {
        this.data = getEmptyttfObject();
        return this;
    }

    /**
     * 读取字体数据
     *
     * @param {ArrayBuffer|Buffer|string|Document} buffer  字体数据
     * @param {Object} options  读取参数
     * @param {string} options.type 字体类型
     *
     * ttf, woff , eot 读取配置
     * @param {boolean} options.hinting 是否保留 hinting 信息
     * @param {boolean} options.kerning 是否保留 kerning 信息
     * @param {boolean} options.compound2simple 复合字形转简单字形
     *
     * woff 读取配置
     * @param {Function} options.inflate 解压相关函数
     *
     * svg 读取配置
     * @param {boolean} options.combinePath 是否合并成单个字形，仅限于普通svg导入
     * @return {Font}
     */
    read(buffer, options) {
    // nodejs buffer
        if (SUPPORT_BUFFER) {
            if (buffer instanceof Buffer) {
                buffer = bufferTool.toArrayBuffer(buffer);
            }
        }

        if (options.type === 'ttf') {
            this.data = new TTFReader(options).read(buffer);
        } else if (options.type === 'otf') {
            this.data = otf2ttfobject(buffer, options);
        } else if (options.type === 'eot') {
            buffer = eot2ttf(buffer, options);
            this.data = new TTFReader(options).read(buffer);
        } else if (options.type === 'woff') {
            buffer = woff2ttf(buffer, options);
            this.data = new TTFReader(options).read(buffer);
        } else if (options.type === 'woff2') {
            buffer = woff2tottf(buffer, options);
            this.data = new TTFReader(options).read(buffer);
        } else if (options.type === 'svg') {
            this.data = svg2ttfobject(buffer, options);
        } else {
            throw new Error('not support font type' + options.type);
        }

        this.type = options.type;
        return this;
    }

    /**
     * 写入字体数据
     *
     * @param {Object} options  写入参数
     * @param {string} options.type   字体类型, 默认 ttf
     * @param {boolean} options.toBuffer nodejs 环境中返回 Buffer 对象, 默认 true
     *
     * ttf 字体参数
     * @param {boolean} options.hinting 是否保留 hinting 信息
     * @param {boolean} options.kerning 是否保留 kerning 信息
     * svg,woff 字体参数
     * @param {Object} options.metadata 字体相关的信息
     *
     * woff 字体参数
     * @param {Function} options.deflate 压缩相关函数
     * @return {Buffer|ArrayBuffer|string}
     */
    write(options = {}) {
        if (!options.type) {
            options.type = this.type;
        }

        let buffer = null;
        if (options.type === 'ttf') {
            buffer = new TTFWriter(options).write(this.data);
        } else if (options.type === 'eot') {
            buffer = new TTFWriter(options).write(this.data);
            buffer = ttf2eot(buffer, options);
        } else if (options.type === 'woff') {
            buffer = new TTFWriter(options).write(this.data);
            buffer = ttf2woff(buffer, options);
        } else if (options.type === 'woff2') {
            buffer = new TTFWriter(options).write(this.data);
            buffer = ttftowoff2(buffer, options);
        } else if (options.type === 'svg') {
            buffer = ttf2svg(this.data, options);
        } else if (options.type === 'symbol') {
            buffer = ttf2symbol(this.data, options);
        } else {
            throw new Error('not support font type' + options.type);
        }

        if (SUPPORT_BUFFER) {
            if (false !== options.toBuffer && buffer instanceof ArrayBuffer) {
                buffer = bufferTool.toBuffer(buffer);
            }
        }

        return buffer;
    }

    /**
     * 转换成 base64编码
     *
     * @param {Object} options  写入参数
     * @param {string} options.type   字体类型, 默认 ttf
     * 其他 options参数, 参考 write
     * @see write
     *
     * @param {ArrayBuffer=} buffer  如果提供了buffer数据则使用 buffer数据, 否则转换现有的 font
     * @return {string}
     */
    toBase64(options, buffer) {
        if (!options.type) {
            options.type = this.type;
        }

        if (buffer) {
            if (SUPPORT_BUFFER) {
                if (buffer instanceof Buffer) {
                    buffer = bufferTool.toArrayBuffer(buffer);
                }
            }
        } else {
            options.toBuffer = false;
            buffer = this.write(options);
        }

        let base64Str;
        if (options.type === 'ttf') {
            base64Str = ttf2base64(buffer);
        } else if (options.type === 'eot') {
            base64Str = eot2base64(buffer);
        } else if (options.type === 'woff') {
            base64Str = woff2base64(buffer);
        } else if (options.type === 'woff2') {
            base64Str = woff2tobase64(buffer);
        } else if (options.type === 'svg') {
            base64Str = svg2base64(buffer);
        } else if (options.type === 'symbol') {
            base64Str = svg2base64(buffer, 'image/svg+xml');
        } else {
            throw new Error('not support font type' + options.type);
        }

        return base64Str;
    }

    /**
     * 设置 font 对象
     *
     * @param {Object} data font的ttfObject对象
     * @return {this}
     */
    set(data) {
        this.data = data;
        return this;
    }

    /**
     * 获取 font 数据
     *
     * @return {Object} ttfObject 对象
     */
    get() {
        return this.data;
    }

    /**
     * 对字形数据进行优化
     *
     * @param  {Object} out  输出结果
     * @param  {boolean|Object} out.result `true` 或者有问题的地方
     * @return {Font}
     */
    optimize(out) {
        const result = optimizettf(this.data);
        if (out) {
            out.result = result;
        }
        return this;
    }

    /**
     * 将字体中的复合字形转为简单字形
     *
     * @return {this}
     */
    compound2simple() {
        const ttfHelper = this.getHelper();
        ttfHelper.compound2simple();
        this.data = ttfHelper.get();
        return this;
    }

    /**
     * 对字形按照unicode编码排序
     *
     * @return {this}
     */
    sort() {
        const ttfHelper = this.getHelper();
        ttfHelper.sortGlyf();
        this.data = ttfHelper.get();
        return this;
    }

    /**
     * 查找相关字形
     *
     * @param  {Object} condition 查询条件
     * @param  {Array|number} condition.unicode unicode编码列表或者单个unicode编码
     * @param  {string} condition.name glyf名字，例如`uniE001`, `uniE`
     * @param  {Function} condition.filter 自定义过滤器
     * @example
     *     condition.filter(glyf) {
     *         return glyf.name === 'logo';
     *     }
     * @return {Array}  glyf字形列表
     */
    find(condition) {
        const ttfHelper = this.getHelper();
        const indexList = ttfHelper.findGlyf(condition);
        return indexList.length ? ttfHelper.getGlyf(indexList) : indexList;
    }

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
    merge(font, options) {
        const ttfHelper = this.getHelper();
        ttfHelper.mergeGlyf(font.get(), options);
        this.data = ttfHelper.get();
        return this;
    }

    /**
     * 获取 TTF helper 实例
     */
    getHelper() {
        return new TTF(this.data);
    }
}

/**
 * base64序列化buffer 数据
 *
 * @param {ArrayBuffer|Buffer|string} buffer 字体数据
 * @return {Font}
 */
Font.toBase64 = function (buffer) {
    if (typeof buffer === 'string') {
    // node 环境中没有 btoa 函数
        if (typeof btoa === 'undefined') {
            return Buffer.from(buffer, 'binary').toString('base64');
        }

        return btoa(buffer);
    }
    return bytes2base64(buffer);
};

function createFont(buffer, options) {
    return new Font(buffer, options);
}

export {Font, createFont};

export default Font;