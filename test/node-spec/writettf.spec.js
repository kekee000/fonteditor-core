
var fs = require('fs');
var TTFReader = require('./fonteditor-core').TTFReader;
var TTFWriter = require('./fonteditor-core').TTFWriter;
var ttf2eot = require('./fonteditor-core').ttf2eot;
var ttf2woff = require('./fonteditor-core').ttf2woff;
var ttf2svg = require('./fonteditor-core').ttf2svg;
var assert = require('assert');

var util = require('./util');

function readttf(file) {
    var data = fs.readFileSync(file);
    var arrayBuffer = util.toArrayBuffer(data);
    return arrayBuffer;
}

function writettf(buffer) {

    var ttfObject  = new TTFReader().read(buffer);

    assert(ttfObject.name.fontFamily === 'Bebas', 'test writettf');
    assert(JSON.stringify(ttfObject), 'test writettf');


    var ttfBuffer = new TTFWriter().write(ttfObject);

    // 写ttf
    assert(util.toBuffer(ttfBuffer).length, 'test writettf');

    // 写eot
    var eotBuffer = ttf2eot(buffer);
    assert(util.toBuffer(eotBuffer).length, 'test writettf');

    // 写woff
    var woffBuffer = ttf2woff(buffer);
    assert(util.toBuffer(woffBuffer).length, 'test writettf');

    // 写svg
    var svg = ttf2svg(ttfObject);
    assert(svg.length, 'test writettf');

}

var arrayBuffer = readttf(__dirname + '/../data/bebas.ttf');

writettf(arrayBuffer);
