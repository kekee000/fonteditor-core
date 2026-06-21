/**
 * @file oft2ttf
 * @author mengke01(kekee000@gmail.com)
 */
const assert = require('assert');
const fs = require('fs');
const {OTFReader, otf2ttfobject, TTFWriter} = require('./fonteditor-core');
const util = require('./util');

function readotf(file) {
    const data = fs.readFileSync(file);
    const buffer = util.toArrayBuffer(data);
    const fontObject = new OTFReader().read(buffer);
    return fontObject;
}

describe('otf2ttf', function () {
    it('otf2ttf', function () {
        const fontObject = readotf(__dirname + '/../data/BalladeContour.otf');
        const ttfBuffer = new TTFWriter().write(otf2ttfobject(fontObject));
        // test
        assert.ok(util.toBuffer(ttfBuffer).length, 'test otf2ttf');
    });
});
