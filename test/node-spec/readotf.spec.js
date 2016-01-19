
var fs = require('fs');
var OTFReader = require('./fonteditor-core').OTFReader;
var util = require('./util');



function readotf(file) {
    var data = fs.readFileSync(file);
    var buffer = util.toArrayBuffer(data);
    var fontObject  = new OTFReader().read(buffer);
    return fontObject;
}

var fontObject = readotf(__dirname + '/../data/BalladeContour.otf');

var assert = require('assert');

// test
assert(fontObject.name.fontFamily === 'Ballade Contour', 'test readotf');
