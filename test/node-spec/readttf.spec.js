
var fs = require('fs');
var TTFReader = require('./fonteditor-core').TTFReader;
var util = require('./util');



function readttf(file) {
    var data = fs.readFileSync(file);
    var buffer = util.toArrayBuffer(data);
    var ttfObject  = new TTFReader().read(buffer);
    return ttfObject;
}

var fontObject = readttf(__dirname + '/../data/bebas.ttf');

var assert = require('assert');

// test
assert(fontObject.name.fontFamily === 'Bebas', 'test readotf');
