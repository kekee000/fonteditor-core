const assert = require('assert');
const fs = require('fs');
const {OTFReader} = require('./fonteditor-core');
const util = require('./util');

function readotf(file) {
    const data = fs.readFileSync(file);
    const buffer = util.toArrayBuffer(data);
    const fontObject = new OTFReader().read(buffer);
    return fontObject;
}

describe('readotf', function () {
    it('readotf', function () {
        const fontObject = readotf(__dirname + '/../data/BalladeContour.otf');
        // test
        assert.ok(fontObject.name.fontFamily === 'Ballade Contour', 'test readotf');
    });
});
