/**
 * @file ttf2svg
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import TTFReader from 'fonteditor-core/ttf/ttfreader';
import ttf2svg from 'fonteditor-core/ttf/ttf2svg';
import svg2ttfobject from 'fonteditor-core/ttf/svg2ttfobject';

describe('ttf 转 svg', function () {

    let fontObject = new TTFReader().read(require('testdata/baiduHealth.ttf'));
    let svg = ttf2svg(fontObject);
    let ttf = svg2ttfobject(svg);

    it('test genrate svg font', function () {
        assert.ok(svg.length > 1000);
    });

    it('test read svg font', function () {
        assert.equal(ttf.from, 'svgfont');
        assert.equal(ttf.name.fontFamily, 'baiduHealth');

        assert.equal(ttf.head.unitsPerEM, fontObject.head.unitsPerEM);
        assert.equal(ttf.head.xMax, fontObject.head.xMax);
        assert.equal(ttf.head.yMax, fontObject.head.yMax);

        assert.equal(ttf.hhea.ascent, fontObject.hhea.ascent);
        assert.equal(ttf.hhea.descent, fontObject.hhea.descent);

        assert.equal(ttf.glyf.length, 14);
        assert.equal(ttf.glyf[3].contours.length, 3);
        assert.equal(ttf.glyf[3].unicode[0], 57357);
    });
});
