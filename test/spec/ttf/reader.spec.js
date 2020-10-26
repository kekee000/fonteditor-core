/**
 * @file reader
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import Writer from 'fonteditor-core/ttf/writer';
import Reader from 'fonteditor-core/ttf/reader';

describe('read buffer', function () {
    let buffer = new ArrayBuffer(100);
    let writer = new Writer(buffer, 0, 100);
    let now = Math.round(new Date().getTime() / 1000) * 1000;

    // 基本类型
    writer.writeInt8(10);
    writer.writeInt16(2442);
    writer.writeInt32(-10);
    writer.writeUint8(10);
    writer.writeUint16(2442);
    writer.writeUint32(5375673);
    // 扩展类型
    writer.writeString('baidu');
    writer.writeFixed(12.36);
    writer.writeLongDateTime(now);
    writer.writeBytes([3, 4, 5]);



    it('test read basic datatype', function () {
        let reader = new Reader(buffer, 0, 100);
        assert.equal(reader.readInt8(), 10);
        assert.equal(reader.readInt16(), 2442);
        assert.equal(reader.readInt32(), -10);
        assert.equal(reader.readUint8(), 10);
        assert.equal(reader.readUint16(), 2442);
        assert.equal(reader.readUint32(), 5375673);
    });

    it('test read extend datatype', function () {
        let reader = new Reader(buffer, 0, 100);
        reader.seek(14);
        assert.equal(reader.readString(5), 'baidu');
        assert.equal(reader.readFixed().toFixed(2), 12.36);
        assert.equal(reader.readLongDateTime().getTime(), now);
        assert.deepEqual(reader.readBytes(3), [3, 4, 5]);
    });

});
