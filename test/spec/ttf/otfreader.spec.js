/**
 * @file otfreader
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {readData} from '../data';
import OTFReader from 'fonteditor-core/ttf/otfreader';

describe('读otf数据', function () {

    let fontObject = new OTFReader().read(readData('BalladeContour.otf'));

    it('test read otf', function () {
        assert.equal(fontObject.version, 'OTTO');
        assert.equal(fontObject.numTables, 9);
        assert.equal(fontObject.rengeShift, 16);
        assert.equal(fontObject.searchRenge, 128);
    });

    it('test read otf head', function () {
        assert.equal(fontObject.head.magickNumber, 1594834165);
        assert.equal(fontObject.head.unitsPerEm, 1000);
        assert.equal(fontObject.head.checkSumAdjustment, 2157456233);
    });

    it('test read otf name', function () {
        assert.equal(fontObject.name.fontFamily, 'Ballade Contour');
        assert.equal(fontObject.name.fontSubFamily, 'Regular');
        assert.equal(fontObject.name.fullName, 'BalladeContour');
    });


    it('test read otf post', function () {
        assert.equal(fontObject.post.format, 3);
        assert.equal(fontObject.post.underlinePosition, -75);
        assert.equal(fontObject.post.underlineThickness, 50);
    });

    it('test read otf hhea', function () {
        assert.equal(fontObject.hhea.advanceWidthMax, 1081);
        assert.equal(fontObject.hhea.ascent, 758);
        assert.equal(fontObject.hhea.descent, -146);
    });

    it('test read otf maxp', function () {
        assert.equal(fontObject.maxp.version, 0.3125);
        assert.equal(fontObject.maxp.numGlyphs, 47);
    });

    it('test read otf glyf', function () {
        assert.equal(fontObject.glyf[0].advanceWidth, 500);
        assert.equal(fontObject.glyf[3].contours[0].length, 96);
    });

    it('test read otf CFF', function () {
        assert.equal(!!fontObject.CFF, true);
        assert.equal(fontObject.CFF.defaultWidthX, 500);
        assert.equal(fontObject.CFF.nominalWidthX, 708);
        assert.equal(fontObject.CFF.topDict.uniqueId, 308228);
        assert.equal(fontObject.CFF.topDict.familyName, 'Ballade Contour');
        assert.equal(fontObject.CFF.topDict.weight, 'Normal');
        assert.equal(fontObject.CFF.topDict.underlineThickness, 50);
        assert.equal(fontObject.CFF.topDict.underlinePosition, -100);
    });

    it('test read otf subset', function () {
        let fontObject = new OTFReader({
            subset: [0x31, 0x32, 0xe001]
        }).read(readData('BalladeContour.otf'));
        assert.equal(fontObject.glyf.length, 3);
        assert.equal(fontObject.glyf[0].name, '.notdef');
        assert.equal(fontObject.glyf[1].unicode[0], 0x31);
        assert.equal(fontObject.glyf[2].unicode[0], 0x32);
        assert.equal(fontObject.subsetMap, null);
    });

});


describe('读错误otf数据', function () {

    it('test read version error', function () {
        assert.throws(function () {
            new OTFReader().read(new Uint8Array([0, 1, 0, 0, 25, 4, 11]).buffer);
        });
    });

    it('test read range error', function () {
        assert.throws(function () {
            new OTFReader().read(new Uint8Array([0, 1, 0, 0, 0, 10, 11, 45, 8]).buffer);
        });
    });
});
