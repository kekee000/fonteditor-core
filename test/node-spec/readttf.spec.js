/**
 * @file readttf
 * @author mengke01(kekee000@gmail.com)
 */
const assert = require('assert');
const fs = require('fs');
const {TTFReader} = require('./fonteditor-core');
const util = require('./util');



function readttf(file) {
    var data = fs.readFileSync(file);
    var buffer = util.toArrayBuffer(data);
    var ttfObject = new TTFReader().read(buffer);
    return ttfObject;
}

describe('readttf', function () {
    it('readttf', function () {
        let fontObject = readttf(__dirname + '/../data/bebas.ttf');
        // test
        assert.ok(fontObject.name.fontFamily === 'Bebas', 'test readotf');
    });
});


