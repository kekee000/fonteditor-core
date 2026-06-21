/**
 * @file otf2ttfobject
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {readData} from '../data';
import OTFReader from 'fonteditor-core/ttf/otfreader';
import otf2ttfobject from 'fonteditor-core/ttf/otf2ttfobject';

describe('otf to ttf object', function () {

    const fontObject = new OTFReader().read(readData('BalladeContour.otf'));
    const numGlyphs = fontObject.maxp.numGlyphs;
    const glyfContours = fontObject.glyf[3].contours.length;
    const glyfAdvanceWidth = fontObject.glyf[3].advanceWidth;
    const glyfLeftSideBearing = fontObject.glyf[3].leftSideBearing;


    const ttfObject = otf2ttfobject(fontObject);

    it('test otf2ttfobject', function () {
        assert.equal(ttfObject.version, 1);
        assert.equal(!!ttfObject.CFF, false);
        assert.equal(!!ttfObject.VORG, false);
        assert.equal(ttfObject.glyf.length, numGlyphs);
        assert.equal(ttfObject.glyf[3].contours.length, glyfContours);
        assert.equal(ttfObject.glyf[3].advanceWidth, glyfAdvanceWidth);
        assert.equal(ttfObject.glyf[3].leftSideBearing, glyfLeftSideBearing);
    });
});
