const assert = require('assert');
const fs = require('fs');
const OTFReader = require('./fonteditor-core').OTFReader;
const util = require('./util');

function readotf(file) {
    var data = fs.readFileSync(file);
    var buffer = util.toArrayBuffer(data);
    var fontObject = new OTFReader().read(buffer);
    return fontObject;
}

describe('readotf', function () {
    it('readotf', function () {
        let fontObject = readotf(__dirname + '/../data/BalladeContour.otf');
        // test
        assert.ok(fontObject.name.fontFamily === 'Ballade Contour', 'test readotf');
    });
});

