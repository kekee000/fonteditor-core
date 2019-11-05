/**
 * @file writettf
 * @author mengke01(kekee000@gmail.com)
 */
const assert = require('assert');
const fs = require('fs');
const TTFReader = require('./fonteditor-core').TTFReader;
const TTFWriter = require('./fonteditor-core').TTFWriter;
const ttf2eot = require('./fonteditor-core').ttf2eot;
const ttf2woff = require('./fonteditor-core').ttf2woff;
const ttf2svg = require('./fonteditor-core').ttf2svg;
const util = require('./util');

function readttf(file) {
    let data = fs.readFileSync(file);
    let arrayBuffer = util.toArrayBuffer(data);
    return arrayBuffer;
}

describe('readoft', function () {
    it('readoft', function () {
        let buffer = readttf(__dirname + '/../data/bebas.ttf');
        let ttfObject  = new TTFReader().read(buffer);

        assert(ttfObject.name.fontFamily === 'Bebas', 'test read ttf');
        assert(JSON.stringify(ttfObject), 'test writettf');


        let ttfBuffer = new TTFWriter().write(ttfObject);

        // 写ttf
        assert(util.toBuffer(ttfBuffer).length, 'test write ttf');

        // 写eot
        let eotBuffer = ttf2eot(buffer);
        assert(util.toBuffer(eotBuffer).length, 'test write eot');

        // 写woff
        let woffBuffer = ttf2woff(buffer);
        assert(util.toBuffer(woffBuffer).length, 'test write woff');

        // 写svg
        let svg = ttf2svg(ttfObject);
        assert(svg.length, 'test write svg');
    });
});


