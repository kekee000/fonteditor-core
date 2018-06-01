
var fs = require('fs');
var Font = require('./fonteditor-core').Font;
var assert = require('assert');
var md5 = require('./util').md5;

function readttf(file) {
    return fs.readFileSync(file);
}

function writettf(buffer) {
    var font = Font.create(buffer, {
        type: 'ttf'
    });
    var font2 = Font.create(buffer, {
        type: 'ttf'
    });

    assert(font.data.name.fontFamily === 'Bebas', 'test read ttf');


    var ttfBuffer = font.write();
    // 写ttf
    assert(ttfBuffer.length, 'test write ttf');


    var ttfBuffer2 = font2.write();
    setTimeout(function () {
        assert(md5(ttfBuffer) === md5(ttfBuffer2), 'test write stable');
    }, 10);

    // 写eot
    var eotBuffer = font.write({
        type: 'eot'
    });
    assert(eotBuffer.length, 'test write eot');

    // 写woff
    var woffBuffer = font.write({
        type: 'woff'
    });
    assert(woffBuffer, 'test write woff');

    var woffBuffer2 = font2.write({
        type: 'woff'
    });
    setTimeout(function () {
        assert(md5(woffBuffer) === md5(woffBuffer2), 'test write stable');
    }, 10);

    // 写svg
    var svg = font.write({
        type: 'svg'
    });
    assert(svg.length, 'test write svg');

    var buffer = new Buffer([65, 66, 67]);
    assert(Font.toBase64(buffer) === 'QUJD', 'test buffer to toBase64');
    var buffer = new Int8Array([65, 66, 67]);
    assert(Font.toBase64(buffer.buffer) === 'QUJD', 'test arraybuffer to toBase64');
}

var buffer = readttf(__dirname + '/../data/bebas.ttf');

writettf(buffer);
