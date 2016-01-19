
var fs = require('fs');
var TTFWriter = require('./fonteditor-core').TTFWriter;
var svg2ttfobject = require('./fonteditor-core').svg2ttfobject;

function getEmpty() {
    var data = fs.readFileSync(__dirname + '/empty.json');
    return JSON.parse(data);
}

var util = require('./util');


var svg = fs.readFileSync(__dirname + '/../data/iconmoon.svg');
var emptyTTFObject = getEmpty();
ttfObject = svg2ttfobject(String(svg));

emptyTTFObject.glyf = ttfObject.glyf;

var ttfBuffer = new TTFWriter().write(emptyTTFObject);

var assert = require('assert');

// test
assert(util.toBuffer(ttfBuffer).length, 'test svg2ttf');
