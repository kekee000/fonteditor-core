/**
 * @file adjustttf
 * @author mengke01(kekee000@gmail.com)
 */
/* globals Int8Array */
const assert = require('assert');
const fs = require('fs');
const TTFReader = require('./fonteditor-core').TTFReader;
const TTFWriter = require('./fonteditor-core').TTFWriter;
const TTF = require('./fonteditor-core').TTF;
const util = require('./util');

function readttf(file) {
    let data = fs.readFileSync(file);
    let arrayBuffer = util.toArrayBuffer(data);
    return arrayBuffer;
}


function adjustttf(ttfObject) {
    let ttf = new TTF(ttfObject);

    // 设置unicode编码
    ttf.setUnicode('$E001');

    // 翻转ttf
    ttf.adjustGlyf(null, {
        reverse: true,
        mirror: true,
        scale: 0.5
    });

    return ttf.ttf;
}

describe('adjustttf', function () {
    it('adjust ttf', function () {
        let arrayBuffer = readttf(__dirname + '/../data/bebas.ttf');
        let ttfObject = new TTFReader().read(arrayBuffer);
        ttfObject = adjustttf(ttfObject);
        let ttfBuffer = new TTFWriter().write(ttfObject);
        // test
        assert.ok(util.toBuffer(ttfBuffer).length, 'test adjust ttf');
    });
});

