/**
 * @file oft2ttf
 * @author mengke01(kekee000@gmail.com)
 */
const assert = require('assert');
const fs = require('fs');
const {OTFReader, otf2ttfobject, TTFWriter} = require('./fonteditor-core');
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



