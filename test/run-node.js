// read font file
var fs = require('fs');
var bufferToArrayBuffer = require('b3b').bufferToArrayBuffer;
var path = require('path');
var fontBuffer = fs.readFileSync(path.resolve(__dirname, 'data/bebas.ttf'));
var fontArrayBuffer = bufferToArrayBuffer(fontBuffer);

// read font data
var TTFReader = require('../node/main').TTFReader;
var ttfReader = new TTFReader({
    hinting: true
});
var fontData = ttfReader.read(fontArrayBuffer);

console.log(Object.keys(fontData));
