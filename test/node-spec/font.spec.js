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
        const buffer = readttf(__dirname + '/../data/bebas.ttf');
        const font = createFont(buffer, {
            type: 'ttf'
        });
        assert.ok(font.data.name.fontFamily === 'Bebas', 'test read ttf');

        const font2 = createFont(buffer, {
            type: 'ttf'
        });
        const ttfBuffer = font.write();
        const ttfBuffer2 = font2.write();
        assert.ok(md5(ttfBuffer) === md5(ttfBuffer2), 'test write stable');
    });

    it('write ttf', function () {
        const buffer = readttf(__dirname + '/../data/bebas.ttf');
        const font = createFont(buffer, {
            type: 'ttf'
        });
        assert.ok(font.data.name.fontFamily === 'Bebas', 'test read ttf');

        const font2 = createFont(buffer, {
            type: 'ttf'
        });
        const ttfBuffer = font.write();
        const ttfBuffer2 = font2.write();
        assert.ok(md5(ttfBuffer) === md5(ttfBuffer2), 'test write stable');
    });

    it('write eot', function () {
        const buffer = readttf(__dirname + '/../data/bebas.ttf');
        const font = createFont(buffer, {
            type: 'ttf'
        });
        // 写eot
        const eotBuffer = font.write({
            type: 'eot'
        });
        assert.ok(eotBuffer.length, 'test write eot');
    });

    it('write woff', function () {
        const buffer = readttf(__dirname + '/../data/bebas.ttf');
        const font = createFont(buffer, {
            type: 'ttf'
        });
        // 写woff
        const woffBuffer = font.write({
            type: 'woff'
        });
        assert.ok(woffBuffer, 'test write woff');

        const font2 = createFont(buffer, {
            type: 'ttf'
        });

        const woffBuffer2 = font2.write({
            type: 'woff'
        });
        assert.ok(md5(woffBuffer) === md5(woffBuffer2), 'test write stable');
    });

    it('write woff2', function () {
        const buffer = readttf(__dirname + '/../data/bebas.ttf');
        const font = createFont(buffer, {
            type: 'ttf'
        });
        // 写woff
        const woffBuffer = font.write({
            type: 'woff2'
        });
        assert.ok(woffBuffer, 'test write woff2');

        const font2 = createFont(buffer, {
            type: 'ttf'
        });

        const woffBuffer2 = font2.write({
            type: 'woff2'
        });
        assert.ok(md5(woffBuffer) === md5(woffBuffer2), 'test write stable');
    });

    it('write svg', function () {
        let buffer = readttf(__dirname + '/../data/bebas.ttf');
        const font = createFont(buffer, {
            type: 'ttf'
        });
        // 写svg
        const svg = font.write({
            type: 'svg'
        });
        assert.ok(svg.length, 'test write svg');

        buffer = Buffer.from([65, 66, 67]);
        assert.ok(Font.toBase64(buffer) === 'QUJD', 'test buffer to toBase64');
        buffer = new Int8Array([65, 66, 67]);
        assert.ok(Font.toBase64(buffer.buffer) === 'QUJD', 'test arraybuffer to toBase64');
    });

});
