/**
 * @file writer
 * @author mengke01(kekee000@gmail.com)
 */
import assert from 'assert';
import Writer from 'fonteditor-core/ttf/writer';
import Reader from 'fonteditor-core/ttf/reader';

describe('write basic datatypes', function () {

    let buffer = new ArrayBuffer(100);

    it('test write basic datatype', function () {
        let writer = new Writer(buffer, 0, 100);

        // 基本类型
        writer.writeInt8(10);
        writer.writeInt16(2442);
        writer.writeInt32(-10);
        writer.writeUint8(10);
        writer.writeUint16(2442);
        writer.writeUint32(5375673);

        writer.writeUint8(55.45444444);
        writer.writeUint16(55.45444444);
        writer.writeUint32(55.45444444);

        let reader = new Reader(buffer, 0, 100);

        assert.equal(reader.readInt8(), 10);
        assert.equal(reader.readInt16(), 2442);
        assert.equal(reader.readInt32(), -10);
        assert.equal(reader.readUint8(), 10);
        assert.equal(reader.readUint16(), 2442);
        assert.equal(reader.readUint32(), 5375673);

        assert.equal(reader.readUint8(), 55);
        assert.equal(reader.readUint16(), 55);
        assert.equal(reader.readUint32(), 55);
    });

    it('test write decimals', function () {
        let writer = new Writer(buffer, 0, 100);

        // 基本类型
        writer.writeInt8(-55.99999);
        writer.writeInt16(-55.99999);
        writer.writeInt32(-55.999999);

        writer.writeUint8(55.45444444);
        writer.writeUint16(55.45444444);
        writer.writeUint32(55.45444444);

        let reader = new Reader(buffer, 0, 100);


        assert.equal(reader.readInt8(), -55);
        assert.equal(reader.readInt16(), -55);
        assert.equal(reader.readInt32(), -55);

        assert.equal(reader.readUint8(), 55);
        assert.equal(reader.readUint16(), 55);
        assert.equal(reader.readUint32(), 55);
    });


    it('test write extend datatype', function () {
        let writer = new Writer(buffer, 0, 100);
        let now = Math.round(new Date().getTime() / 1000) * 1000;

        // 扩展类型
        writer.writeString('baidu');
        writer.writeFixed(12.36);
        writer.writeLongDateTime(now);
        writer.writeBytes([3, 4, 5]);

        let reader = new Reader(buffer, 0, 100);

        assert.equal(reader.readString(0, 5), 'baidu');
        assert.equal(reader.readFixed().toFixed(2), 12.36);
        assert.equal(reader.readLongDateTime().getTime(), now);
        assert.deepEqual(reader.readBytes(3), [3, 4, 5]);
    });

    it('test seek', function () {
        let writer = new Writer(buffer, 0, 100);
        // 测试seek
        writer.seek(50);
        writer.writeFixed(12.36);

        let reader = new Reader(buffer, 0, 100);
        reader.seek(50);
        assert.equal(reader.readFixed().toFixed(2), 12.36);
    });
});
