/**
 * @file 数据写入器
 * @author mengke01(kekee000@gmail.com)
 */

import {curry} from '../common/lang';
import error from './error';

// 检查数组支持情况
if (typeof ArrayBuffer === 'undefined' || typeof DataView === 'undefined') {
    throw new Error('not support ArrayBuffer and DataView');
}

// 数据类型
const dataType = {
    Int8: 1,
    Int16: 2,
    Int32: 4,
    Uint8: 1,
    Uint16: 2,
    Uint32: 4,
    Float32: 4,
    Float64: 8
};


/**
 * 读取器
 *
 * @constructor
 * @param {Array.<byte>} buffer 缓冲数组
 * @param {number} offset 起始偏移
 * @param {number=} length 数组长度
 * @param {boolean=} littleEndian 是否小尾
 */
class Writer {
    constructor(buffer, offset, length, littleEndian) {
        const bufferLength = buffer.byteLength || buffer.length;
        this.offset = offset || 0;
        this.length = length || (bufferLength - this.offset);
        this.littleEndian = littleEndian || false;
        this.view = new DataView(buffer, this.offset, this.length);
    }

    /**
     * 读取指定的数据类型
     *
     * @param {string} type 数据类型
     * @param {number} value value值
     * @param {number=} offset 位移
     * @param {boolean=} littleEndian 是否小尾
     *
     * @return {this}
     */
    write(type, value, offset, littleEndian) {

        // 使用当前位移
        if (undefined === offset) {
            offset = this.offset;
        }

        // 使用小尾
        if (undefined === littleEndian) {
            littleEndian = this.littleEndian;
        }

        // 扩展方法
        if (undefined === dataType[type]) {
            return this['write' + type](value, offset, littleEndian);
        }

        const size = dataType[type];
        this.offset = offset + size;
        this.view['set' + type](offset, value, littleEndian);
        return this;
    }

    /**
     * 写入指定的字节数组
     *
     * @param {ArrayBuffer} value 写入值
     * @param {number=} length 数组长度
     * @param {number=} offset 起始偏移
     * @return {this}
     */
    writeBytes(value, length, offset) {

        length = length || value.byteLength || value.length;
        let i;

        if (!length) {
            return this;
        }

        if (undefined === offset) {
            offset = this.offset;
        }

        if (length < 0 || offset + length > this.length) {
            error.raise(10002, this.length, offset + length);
        }

        const littleEndian = this.littleEndian;
        if (value instanceof ArrayBuffer) {
            const view = new DataView(value, 0, length);
            for (i = 0; i < length; ++i) {
                this.view.setUint8(offset + i, view.getUint8(i, littleEndian), littleEndian);
            }
        }
        else {
            for (i = 0; i < length; ++i) {
                this.view.setUint8(offset + i, value[i], littleEndian);
            }
        }

        this.offset = offset + length;

        return this;
    }

    /**
     * 写空数据
     *
     * @param {number} length 长度
     * @param {number=} offset 起始偏移
     * @return {this}
     */
    writeEmpty(length, offset) {

        if (length < 0) {
            error.raise(10002, this.length, length);
        }

        if (undefined === offset) {
            offset = this.offset;
        }

        const littleEndian = this.littleEndian;
        for (let i = 0; i < length; ++i) {
            this.view.setUint8(offset + i, 0, littleEndian);
        }

        this.offset = offset + length;

        return this;
    }

    /**
     * 写入一个string
     *
     * @param {string} str 字符串
     * @param {number=} length 长度
     * @param {number=} offset 偏移
     *
     * @return {this}
     */
    writeString(str = '', length, offset) {

        if (undefined === offset) {
            offset = this.offset;
        }

        // eslint-disable-next-line no-control-regex
        length = length || str.replace(/[^\x00-\xff]/g, '11').length;

        if (length < 0 || offset + length > this.length) {
            error.raise(10002, this.length, offset + length);
        }

        this.seek(offset);

        for (let i = 0, l = str.length, charCode; i < l; ++i) {
            charCode = str.charCodeAt(i) || 0;
            if (charCode > 127) {
                // unicode编码可能会超出2字节,
                // 写入与编码有关系，此处不做处理
                this.writeUint16(charCode);
            }
            else {
                this.writeUint8(charCode);
            }
        }

        this.offset = offset + length;

        return this;
    }

    /**
     * 写入一个字符
     *
     * @param {string} value 字符
     * @param {number=} offset 偏移
     * @return {this}
     */
    writeChar(value, offset) {
        return this.writeString(value, offset);
    }

    /**
     * 写入fixed类型
     *
     * @param {number} value 写入值
     * @param {number=} offset 偏移
     * @return {number} float
     */
    writeFixed(value, offset) {
        if (undefined === offset) {
            offset = this.offset;
        }
        this.writeInt32(Math.round(value * 65536), offset);

        return this;
    }

    /**
     * 写入长日期
     *
     * @param {Date} value 日期对象
     * @param {number=} offset 偏移
     *
     * @return {Date} Date对象
     */
    writeLongDateTime(value, offset) {

        if (undefined === offset) {
            offset = this.offset;
        }

        // new Date(1970, 1, 1).getTime() - new Date(1904, 1, 1).getTime();
        const delta = -2077545600000;

        if (typeof value === 'undefined') {
            value = delta;
        }
        else if (typeof value.getTime === 'function') {
            value = value.getTime();
        }
        else if (/^\d+$/.test(value)) {
            value = +value;
        }
        else {
            value = Date.parse(value);
        }

        const time = Math.round((value - delta) / 1000);
        this.writeUint32(0, offset);
        this.writeUint32(time, offset + 4);

        return this;
    }

    /**
     * 跳转到指定偏移
     *
     * @param {number=} offset 偏移
     * @return {this}
     */
    seek(offset) {
        if (undefined === offset) {
            this.offset = 0;
        }

        if (offset < 0 || offset > this.length) {
            error.raise(10002, this.length, offset);
        }

        this._offset = this.offset;
        this.offset = offset;

        return this;
    }

    /**
     * 跳转到写入头部位置
     *
     * @return {this}
     */
    head() {
        this.offset = this._offset || 0;
        return this;
    }

    /**
     * 获取缓存的byte数组
     *
     * @return {ArrayBuffer}
     */
    getBuffer() {
        return this.view.buffer;
    }

    /**
     * 注销
     */
    dispose() {
        delete this.view;
    }
}

// 直接支持的数据类型
Object.keys(dataType).forEach(type => {
    Writer.prototype['write' + type] = curry(Writer.prototype.write, type);
});

export default Writer;
