
var fs = require('fs');
var TTFReader = require('./fonteditor-core').TTFReader;
var TTFWriter = require('./fonteditor-core').TTFWriter;
var TTF = require('./fonteditor-core').TTF;

var util = require('./util');

function readttf(file) {
    var data = fs.readFileSync(file);
    var arrayBuffer = util.toArrayBuffer(data);
    return arrayBuffer;
}


function adjustttf(ttfObject) {
    var ttf = new TTF(ttfObject);

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


var arrayBuffer = readttf(__dirname + '/../data/bebas.ttf');

var ttfObject = new TTFReader().read(arrayBuffer);

ttfObject = adjustttf(ttfObject);

var ttfBuffer = new TTFWriter().write(ttfObject);


var assert = require('assert');

// test
assert(util.toBuffer(ttfBuffer).length, 'test adjust ttf');
