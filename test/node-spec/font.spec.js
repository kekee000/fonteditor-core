/**
 * @file font
 * @author mengke01(kekee000@gmail.com)
 */

const assert = require('assert');
const fs = require('fs');
const {createFont, Font, woff2} = require('./fonteditor-core');
const md5 = require('./util').md5;

function readttf(file) {
    return fs.readFileSync(file);
}

describe('font', function () {

    this.timeout(2000);
    before(function (done) {
        woff2.init().then(() => done());
    });


    it('write ttf', function () {
        let buffer = readttf(__dirname + '/../data/bebas.ttf');
        let font = createFont(buffer, {
            type: 'ttf'
        });
        assert.ok(font.data.name.fontFamily === 'Bebas', 'test read ttf');

        let font2 = createFont(buffer, {
            type: 'ttf'
        });
        let ttfBuffer = font.write();
        let ttfBuffer2 = font2.write();
        assert.ok(md5(ttfBuffer) === md5(ttfBuffer2), 'test write stable');
    });

    it('write ttf', function () {
        let buffer = readttf(__dirname + '/../data/bebas.ttf');
        let font = createFont(buffer, {
            type: 'ttf'
        });
        assert.ok(font.data.name.fontFamily === 'Bebas', 'test read ttf');

        let font2 = createFont(buffer, {
            type: 'ttf'
        });
        let ttfBuffer = font.write();
        let ttfBuffer2 = font2.write();
        assert.ok(md5(ttfBuffer) === md5(ttfBuffer2), 'test write stable');
    });

    it('write eot', function () {
        let buffer = readttf(__dirname + '/../data/bebas.ttf');
        let font = createFont(buffer, {
            type: 'ttf'
        });
        // 写eot
        let eotBuffer = font.write({
            type: 'eot'
        });
        assert.ok(eotBuffer.length, 'test write eot');
    });

    it('write woff', function () {
        let buffer = readttf(__dirname + '/../data/bebas.ttf');
        let font = createFont(buffer, {
            type: 'ttf'
        });
        // 写woff
        let woffBuffer = font.write({
            type: 'woff'
        });
        assert.ok(woffBuffer, 'test write woff');

        let font2 = createFont(buffer, {
            type: 'ttf'
        });

        let woffBuffer2 = font2.write({
            type: 'woff'
        });
        assert.ok(md5(woffBuffer) === md5(woffBuffer2), 'test write stable');
    });

    it('write woff2', function () {
        let buffer = readttf(__dirname + '/../data/bebas.ttf');
        let font = createFont(buffer, {
            type: 'ttf'
        });
        // 写woff
        let woffBuffer = font.write({
            type: 'woff2'
        });
        assert.ok(woffBuffer, 'test write woff2');

        let font2 = createFont(buffer, {
            type: 'ttf'
        });

        let woffBuffer2 = font2.write({
            type: 'woff2'
        });
        assert.ok(md5(woffBuffer) === md5(woffBuffer2), 'test write stable');
    });

    it('write svg', function () {
        let buffer = readttf(__dirname + '/../data/bebas.ttf');
        let font = createFont(buffer, {
            type: 'ttf'
        });
        // 写svg
        let svg = font.write({
            type: 'svg'
        });
        assert.ok(svg.length, 'test write svg');

        buffer = Buffer.from([65, 66, 67]);
        assert.ok(Font.toBase64(buffer) === 'QUJD', 'test buffer to toBase64');
        buffer = new Int8Array([65, 66, 67]);
        assert.ok(Font.toBase64(buffer.buffer) === 'QUJD', 'test arraybuffer to toBase64');
    });

});
