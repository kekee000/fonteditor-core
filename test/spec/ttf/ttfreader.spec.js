/**
 * @file ttfreader
 * @author mengke01(kekee000@gmail.com)
 */
import assert from 'assert';
import {readData} from '../data';
import TTFReader from 'fonteditor-core/ttf/ttfreader';

describe('读ttf数据', function () {

    let fontObject = new TTFReader().read(readData('baiduHealth.ttf'));

    it('test read ttf', function () {
        assert.equal(fontObject.version, 1);
        assert.equal(fontObject.numTables, 15);
        assert.equal(fontObject.rengeShift, 112);
        assert.equal(fontObject.searchRenge, 128);
    });

    it('test read ttf head', function () {
        assert.equal(fontObject.head.magickNumber, 1594834165);
        assert.equal(fontObject.head.unitsPerEm, 512);
        assert.equal(fontObject.head.checkSumAdjustment, 541516270);
    });

    it('test read ttf name', function () {
        assert.equal(fontObject.name.fontFamily, 'baiduHealth');
        assert.equal(fontObject.name.fontSubFamily, 'Regular');
        assert.equal(fontObject.name.fullName, 'baiduHealth');
    });


    it('test read ttf post', function () {
        assert.equal(fontObject.post.format, 2);
        assert.equal(fontObject.post.underlinePosition, 0);
        assert.equal(fontObject.post.underlineThickness, 0);
    });

    it('test read ttf hhea', function () {
        assert.equal(fontObject.hhea.advanceWidthMax, 682);
        assert.equal(fontObject.hhea.ascent, 480);
        assert.equal(fontObject.hhea.descent, -33);
    });

    it('test read ttf maxp', function () {
        assert.equal(fontObject.maxp.version, 1);
        assert.equal(fontObject.maxp.numGlyphs, 17);
    });

    it('test read ttf glyf', function () {
        assert.equal(fontObject.glyf[0].advanceWidth, 512);
        assert.equal(fontObject.glyf[0].leftSideBearing, 0);
        assert.equal(fontObject.glyf[0].name, '.notdef');
        assert.equal(fontObject.glyf[3].contours[0].length, 31);
        assert.equal(fontObject.glyf[16].compound, true);
        assert.equal(fontObject.glyf[16].glyfs.length, 2);
    });

    it('test read ttf cmap', function () {
        assert.equal(fontObject.cmap[0], 1);
        assert.equal(fontObject.cmap[57400], 16);
    });
});

describe('转换compound到simple', function () {

    let fontObject = new TTFReader({
        compound2simple: true
    }).read(readData('baiduHealth.ttf'));

    it('test read ttf glyf', function () {
        assert.equal(!!fontObject.glyf[16].compound, false);
        assert.equal(!!fontObject.glyf[16].glyfs, false);
        assert.equal(fontObject.glyf[16].contours.length, 4);
    });
});

describe('读ttf hinting数据', function () {
    let fontObject = new TTFReader({
        hinting: true
    }).read(readData('baiduHealth-hinting.ttf'));

    it('test read hinting', function () {
        assert.equal(fontObject.cvt.length, 24);
        assert.equal(fontObject.fpgm.length, 371);
        assert.equal(fontObject.prep.length, 204);
        assert.equal(fontObject.gasp.length, 8);
    });

});

describe('ttf subset', function () {
    let fontObject = new TTFReader({
        subset: [
            65, 0xe003, 0xe00d
        ]
    }).read(readData('baiduHealth.ttf'));

    it('test read subset', function () {
        assert.equal(fontObject.glyf.length, 3);
        assert.equal(fontObject.glyf[0].name, '.notdef');
        assert.equal(fontObject.glyf[1].unicode[0], 0xe003);
        assert.equal(fontObject.glyf[2].unicode[0], 0xe00d);
        assert.equal(fontObject.subsetMap, null);
    });
});

describe('ttf subset with compound', function () {
    let fontObject = new TTFReader({
        subset: [
            65, 0x21, 0x22
        ]
    }).read(readData('wingdings3.ttf'));

    it('test read hinting', function () {
        assert.equal(fontObject.glyf.length, 3);
        assert.equal(fontObject.glyf[0].name, '.notdef');
        assert.equal(fontObject.glyf[1].unicode[0], 0x21);
        assert.equal(fontObject.glyf[1].compound, null);
        assert.equal(fontObject.glyf[2].unicode[0], 0x22);
        assert.equal(fontObject.glyf[2].contours.length, 1);
        assert.equal(fontObject.glyf[2].compound, null);
        assert.equal(fontObject.subsetMap, null);
    });
});

describe('读错误ttf数据', function () {

    it('test read version error', function () {
        assert.throws(function () {
            new TTFReader().read(new Uint8Array([0, 1, 0, 0, 25, 4, 11]).buffer);
        });
    });

    it('test read range error', function () {
        assert.throws(function () {
            new TTFReader().read(new Uint8Array([0, 1, 0, 0, 0, 10, 11, 45, 8]).buffer);
        });
    });
});
