/**
 * @file oft2ttf
 * @author mengke01(kekee000@gmail.com)
 */
const assert = require('assert');
const fs = require('fs');
const OTFReader = require('./fonteditor-core').OTFReader;
const otf2ttfobject = require('./fonteditor-core').otf2ttfobject;
const TTFWriter = require('./fonteditor-core').TTFWriter;
const util = require('./util');

function readotf(file) {
    let data = fs.readFileSync(file);
    let buffer = util.toArrayBuffer(data);
    let fontObject = new OTFReader().read(buffer);
    return fontObject;
}

describe('otf2ttf', function () {
    it('otf2ttf', function () {
        let fontObject = readotf(__dirname + '/../data/BalladeContour.otf');
        let ttfBuffer = new TTFWriter().write(otf2ttfobject(fontObject));
        // test
        assert.ok(util.toBuffer(ttfBuffer).length, 'test otf2ttf');
    });
});



