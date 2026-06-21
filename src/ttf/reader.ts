/**
 * @file 数据读取器
 * @author mengke01(kekee000@gmail.com)
 *
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
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

export default class Reader {

    offset: number;
    length: number;
    littleEndian: boolean;
    view: DataView;

    constructor(buffer: ArrayBuffer, offset?: number, length?: number, littleEndian?: boolean) {
        const bufferLength = buffer.byteLength;
        this.offset = offset || 0;
        this.length = length || (bufferLength - this.offset);
        this.littleEndian = littleEndian || false;

        this.view = new DataView(buffer, this.offset, this.length);
    }

    readInt8(offset?: number, littleEndian?: boolean): number {
        return this.read('Int8', offset, littleEndian);
    }

    readInt16(offset?: number, littleEndian?: boolean): number {
        return this.read('Int16', offset, littleEndian);
    }

    readInt32(offset?: number, littleEndian?: boolean): number {
        return this.read('Int32', offset, littleEndian);
    }

    readUint8(offset?: number, littleEndian?: boolean): number {
        return this.read('Uint8', offset, littleEndian);
    }

    readUint16(offset?: number, littleEndian?: boolean): number {
        return this.read('Uint16', offset, littleEndian);
    }

    readUint32(offset?: number, littleEndian?: boolean): number {
        return this.read('Uint32', offset, littleEndian);
    }

    readFloat32(offset?: number, littleEndian?: boolean): number {
        return this.read('Float32', offset, littleEndian);
    }

    readFloat64(offset?: number, littleEndian?: boolean): number {
        return this.read('Float64', offset, littleEndian);
    }

    read(type: string, offset?: number, littleEndian?: boolean): number {

        if (undefined === offset) {
            offset = this.offset;
        }

        if (undefined === littleEndian) {
            littleEndian = this.littleEndian;
        }

        // 扩展方法
        if (undefined === dataType[type]) {
            return (this as any)['read' + type](offset, littleEndian);
        }

        const size = dataType[type];
        this.offset = offset + size;
        return (this.view as any)['get' + type](offset, littleEndian);
    }

    readBytes(offset: number, length: number | null = null): number[] {

        if (length == null) {
            length = offset;
            offset = this.offset;
        }

        if (length < 0 || offset + length > this.length) {
            error.raise(10001, this.length, offset + length);
        }

        const buffer: number[] = [];
        for (let i = 0; i < length; ++i) {
            buffer.push(this.view.getUint8(offset + i));
        }

        this.offset = offset + length;
        return buffer;
    }

    readString(offset: number, length: number | null = null): string {

        if (length == null) {
            length = offset;
            offset = this.offset;
        }

        if (length < 0 || offset + length > this.length) {
            error.raise(10001, this.length, offset + length);
        }

        let value = '';
        for (let i = 0; i < length; ++i) {
            const c = this.readUint8(offset + i);
            value += String.fromCharCode(c);
        }

        this.offset = offset + length;

        return value;
    }

    readChar(offset: number): string {
        return this.readString(offset, 1);
    }

    readUint24(offset?: number): number {
        const [i, j, k] = this.readBytes(offset || this.offset, 3);
        return (i << 16) + (j << 8) + k;
    }

    readFixed(offset?: number): number {
        if (undefined === offset) {
            offset = this.offset;
        }
        const val = this.readInt32(offset, false) / 65536.0;
        return Math.ceil(val * 100000) / 100000;
    }

    readLongDateTime(offset?: number): Date {
        if (undefined === offset) {
            offset = this.offset;
        }

        // new Date(1970, 1, 1).getTime() - new Date(1904, 1, 1).getTime();
        const delta = -2077545600000;
        const time = this.readUint32(offset + 4, false);
        const date = new Date();
        date.setTime(time * 1000 + delta);
        return date;
    }

    seek(offset?: number): this {
        if (undefined === offset) {
            this.offset = 0;
            return this;
        }

        if (offset < 0 || offset > this.length) {
            error.raise(10001, this.length, offset);
        }

        this.offset = offset;

        return this;
    }

    dispose(): void {
        (this as any).view = null;
    }
}
