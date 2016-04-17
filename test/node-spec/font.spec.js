
var fs = require('fs');
var Font = require('./fonteditor-core').Font;
var assert = require('assert');

function readttf(file) {
    return fs.readFileSync(file);
}

function writettf(buffer) {
    var font = Font.create(buffer, {
        type: 'ttf'
    });

    assert(font.data.name.fontFamily === 'Bebas', 'test read ttf');


    var ttfBuffer = font.write();

    // 写ttf
    assert(ttfBuffer.length, 'test write ttf');

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

    // 写svg
    var svg = font.write({
        type: 'svg'
    });
    assert(svg.length, 'test write svg');

}

var buffer = readttf(__dirname + '/../data/bebas.ttf');

writettf(buffer);
