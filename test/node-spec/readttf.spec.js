/**
 * @file readttf
 * @author mengke01(kekee000@gmail.com)
 */
const assert = require('assert');
const fs = require('fs');
const {TTFReader} = require('./fonteditor-core');
const util = require('./util');



function readttf(file) {
    const data = fs.readFileSync(file);
    const buffer = util.toArrayBuffer(data);
    const ttfObject = new TTFReader().read(buffer);
    return ttfObject;
}

describe('readttf', function () {
    it('readttf', function () {
        const fontObject = readttf(__dirname + '/../data/bebas.ttf');
        // test
        assert.ok(fontObject.name.fontFamily === 'Bebas', 'test readotf');
    });
});
