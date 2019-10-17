/**
 * @file svg2ttf
 * @author mengke01(kekee000@gmail.com)
 */
const assert = require('assert');
const fs = require('fs');
const TTFWriter = require('./fonteditor-core').TTFWriter;
const svg2ttfobject = require('./fonteditor-core').svg2ttfobject;
const util = require('./util');

function getEmpty() {
    let data = fs.readFileSync(__dirname + '/empty.json');
    return JSON.parse(data);
}

describe('svg2ttf', function () {
    it('svg2ttf', function () {

        let svg = fs.readFileSync(__dirname + '/../data/iconmoon.svg');
        let emptyTTFObject = getEmpty();
        let ttfObject = svg2ttfobject(String(svg));
        emptyTTFObject.glyf = ttfObject.glyf;
        let ttfBuffer = new TTFWriter().write(emptyTTFObject);
        // test
        assert.ok(util.toBuffer(ttfBuffer).length, 'test svg2ttf');
    });
});
