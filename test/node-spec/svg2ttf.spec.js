/**
 * @file svg2ttf
 * @author mengke01(kekee000@gmail.com)
 */
const assert = require('assert');
const fs = require('fs');
const TTFWriter = require('./fonteditor-core').TTFWriter;
const svg2ttfobject = require('./fonteditor-core').svg2ttfobject;
const util = require('./util');
const DOMParser = require('@xmldom/xmldom').DOMParser;

function getEmpty() {
    let data = fs.readFileSync(__dirname + '/empty.json');
    return JSON.parse(data);
}

describe('svg2ttf', function () {
    it('svg2ttf', function () {

        let svg = fs.readFileSync(__dirname + '/../data/iconmoon.svg', 'utf-8');
        let emptyTTFObject = getEmpty();
        let ttfObject = svg2ttfobject(svg);
        assert.strictEqual(ttfObject.glyf.length, 3, 'glyf length');
        emptyTTFObject.glyf = ttfObject.glyf;
        let ttfBuffer = new TTFWriter().write(emptyTTFObject);
        // test
        assert.ok(util.toBuffer(ttfBuffer).length, 'test svg2ttf');
    });

    it('xmldocument to ttf', function () {

        const svgText = fs.readFileSync(__dirname + '/../data/iconmoon.svg', 'utf-8');
        const doc = new DOMParser().parseFromString(svgText, 'text/xml');
        let emptyTTFObject = getEmpty();
        let ttfObject = svg2ttfobject(doc);
        assert.strictEqual(ttfObject.glyf.length, 3, 'glyf length');
        emptyTTFObject.glyf = ttfObject.glyf;
        let ttfBuffer = new TTFWriter().write(emptyTTFObject);
        // test
        assert.ok(util.toBuffer(ttfBuffer).length, 'test svg2ttf');
    });
});
