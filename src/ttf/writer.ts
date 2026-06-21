/**
 * @file 数据写入器
 * @author mengke01(kekee000@gmail.com)
 */

import error from './error';

// 检查数组支持情况
if (typeof ArrayBuffer === 'undefined' || typeof DataView === 'undefined') {
    throw new Error('not support ArrayBuffer and DataView');
}

// 数据类型
const dataType: Record<string, number> = {
    Int8: 1,
    Int16: 2,
    Int32: 4,
    Uint8: 1,
    Uint16: 2,
    Uint32: 4,
    Float32: 4,
    Float64: 8
};


class Writer {

    offset: number;
    length: number;
    littleEndian: boolean;
    view: DataView;
    _offset?: number;

    writeInt8(value: number, offset?: number, littleEndian?: boolean): this {
        return this.write('Int8', value, offset, littleEndian);
    }

    writeInt16(value: number, offset?: number, littleEndian?: boolean): this {
        return this.write('Int16', value, offset, littleEndian);
    }

    writeInt32(value: number, offset?: number, littleEndian?: boolean): this {
        return this.write('Int32', value, offset, littleEndian);
    }

    writeUint8(value: number, offset?: number, littleEndian?: boolean): this {
        return this.write('Uint8', value, offset, littleEndian);
    }

    writeUint16(value: number, offset?: number, littleEndian?: boolean): this {
        return this.write('Uint16', value, offset, littleEndian);
    }

    writeUint32(value: number, offset?: number, littleEndian?: boolean): this {
        return this.write('Uint32', value, offset, littleEndian);
    }

    writeFloat32(value: number, offset?: number, littleEndian?: boolean): this {
        return this.write('Float32', value, offset, littleEndian);
    }

    writeFloat64(value: number, offset?: number, littleEndian?: boolean): this {
        return this.write('Float64', value, offset, littleEndian);
    }

    constructor(buffer: ArrayBuffer | ArrayLike<number>, offset?: number, length?: number, littleEndian?: boolean) {
        const bufferLength = (buffer as ArrayBuffer).byteLength || (buffer as ArrayLike<number>).length;
        this.offset = offset || 0;
        this.length = length || (bufferLength - this.offset);
        this.littleEndian = littleEndian || false;
        this.view = new DataView(buffer as ArrayBuffer, this.offset, this.length);
    }

    write(type: string, value: number, offset?: number, littleEndian?: boolean): this {

        if (undefined === offset) {
            offset = this.offset;
        }

        if (undefined === littleEndian) {
            littleEndian = this.littleEndian;
        }

        if (undefined === dataType[type]) {
            return (this as any)['write' + type](value, offset, littleEndian);
        }

        const size = dataType[type];
        this.offset = offset + size;
        (this.view as any)['set' + type](offset, value, littleEndian);
        return this;
    }

    writeBytes(value: ArrayBuffer | ArrayLike<number>, length?: number, offset?: number): this {

        length = length || (value as ArrayBuffer).byteLength || (value as ArrayLike<number>).length;
        let i: number;

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
                this.view.setUint8(offset + i, view.getUint8(i));
            }
        }
        else {
            const arr = value as ArrayLike<number>;
            for (i = 0; i < length; ++i) {
                this.view.setUint8(offset + i, arr[i]);
            }
        }

        this.offset = offset + length;

        return this;
    }

    writeEmpty(length: number, offset?: number): this {

        if (length < 0) {
            error.raise(10002, this.length, length);
        }

        if (undefined === offset) {
            offset = this.offset;
        }

        for (let i = 0; i < length; ++i) {
            this.view.setUint8(offset + i, 0);
        }

        this.offset = offset + length;

        return this;
    }

    writeString(str: string = '', length?: number, offset?: number): this {

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
                this.writeUint16(charCode);
            }
            else {
                this.writeUint8(charCode);
            }
        }

        this.offset = offset + length;

        return this;
    }

    writeChar(value: string, offset?: number): this {
        return this.writeString(value, undefined, offset);
    }

    writeFixed(value: number, offset?: number): this {
        if (undefined === offset) {
            offset = this.offset;
        }
        this.writeInt32(Math.round(value * 65536), offset);
        return this;
    }

    writeLongDateTime(value: Date | number | string, offset?: number): this {

        if (undefined === offset) {
            offset = this.offset;
        }

        // new Date(1970, 1, 1).getTime() - new Date(1904, 1, 1).getTime();
        const delta = -2077545600000;

        let timeMs: number;
        if (typeof value === 'undefined') {
            timeMs = delta;
        }
        else if (value && typeof (value as Date).getTime === 'function') {
            timeMs = (value as Date).getTime();
        }
        else if (typeof value === 'number') {
            timeMs = value;
        }
        else if (/^\d+$/.test(String(value))) {
            timeMs = +value;
        }
        else {
            timeMs = Date.parse(String(value));
        }

        const time = Math.round((timeMs - delta) / 1000);
        this.writeUint32(0, offset);
        this.writeUint32(time, offset + 4);

        return this;
    }

    seek(offset?: number): this {
        if (undefined === offset) {
            this.offset = 0;
            return this;
        }

        if (offset < 0 || offset > this.length) {
            error.raise(10002, this.length, offset);
        }

        this._offset = this.offset;
        this.offset = offset;

        return this;
    }

    head(): this {
        this.offset = this._offset || 0;
        return this;
    }

    getBuffer(): ArrayBuffer {
        return this.view.buffer as ArrayBuffer;
    }

    dispose(): void {
        (this as any).view = null;
    }
}

export default Writer;
