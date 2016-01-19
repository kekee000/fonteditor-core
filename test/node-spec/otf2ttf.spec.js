
var fs = require('fs');
var OTFReader = require('./fonteditor-core').OTFReader;
var otf2ttfobject = require('./fonteditor-core').otf2ttfobject;
var TTFWriter = require('./fonteditor-core').TTFWriter;
var util = require('./util');



function readotf(file) {
    var data = fs.readFileSync(file);
    var buffer = util.toArrayBuffer(data);
    var fontObject  = new OTFReader().read(buffer);
    return fontObject;
}

var fontObject = readotf(__dirname + '/../data/BalladeContour.otf');
var ttfBuffer = new TTFWriter().write(otf2ttfobject(fontObject));

var assert = require('assert');

// test
assert(util.toBuffer(ttfBuffer).length, 'test otf2ttf');

