/**
 * @file ttf2woff
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {readData} from '../data';
import TTFReader from 'fonteditor-core/ttf/ttfreader';
import ttf2woff from 'fonteditor-core/ttf/ttf2woff';
import woff2ttf from 'fonteditor-core/ttf/woff2ttf';
import pako from 'pako';
import { fstat } from 'fs';

describe('ttf 转 woff', function () {

    let woffBuffer = ttf2woff(readData('baiduHealth.ttf'));

    it('test woff format', function () {
        assert.ok(woffBuffer.byteLength > 1000);
        assert.ok(woffBuffer.byteLength < 10000);
    });

    it('test read woff', function () {
        let ttf = new TTFReader().read(woff2ttf(woffBuffer));

        assert.equal(ttf.version, 1);

        assert.equal(ttf.head.magickNumber, 1594834165);
        assert.equal(ttf.head.unitsPerEm, 512);

        assert.equal(ttf.post.format, 2);
        assert.equal(ttf.post.underlinePosition, 0);
        assert.equal(ttf.post.underlineThickness, 0);

        assert.equal(ttf.hhea.advanceWidthMax, 682);
        assert.equal(ttf.hhea.ascent, 480);
        assert.equal(ttf.hhea.descent, -33);

        assert.equal(ttf.maxp.version, 1);
        assert.equal(ttf.maxp.numGlyphs, 17);

        assert.equal(ttf.glyf[0].advanceWidth, 512);
        assert.equal(ttf.glyf[0].leftSideBearing, 0);
        assert.equal(ttf.glyf[0].name, '.notdef');
        assert.equal(ttf.glyf[3].contours[0].length, 31);
        assert.equal(ttf.glyf[16].compound, true);
        assert.equal(ttf.glyf[16].glyfs.length, 2);

        assert.equal(ttf.cmap[0], 1);
        assert.equal(ttf.cmap[57400], 16);
    });
});


describe('ttf 转 woff with deflate', function () {

    let woffBuffer = ttf2woff(readData('baiduHealth.ttf'), {
        deflate: pako.deflate
    });

    it('test woff format', function () {
        assert.ok(woffBuffer.byteLength > 1000);
        assert.ok(woffBuffer.byteLength < 10000);
    });
    require('fs').writeFileSync('baiduHealth-deflate.woff', Buffer.from(woffBuffer));
    it('test read woff', function () {
        let ttfBuffer = woff2ttf(woffBuffer, {
            inflate: pako.inflate
        });
        let ttf = new TTFReader().read(ttfBuffer);

        assert.equal(ttf.version, 1);

        assert.equal(ttf.head.magickNumber, 1594834165);
        assert.equal(ttf.head.unitsPerEm, 512);

        assert.equal(ttf.post.format, 2);
        assert.equal(ttf.post.underlinePosition, 0);
        assert.equal(ttf.post.underlineThickness, 0);

        assert.equal(ttf.hhea.advanceWidthMax, 682);
        assert.equal(ttf.hhea.ascent, 480);
        assert.equal(ttf.hhea.descent, -33);

        assert.equal(ttf.maxp.version, 1);
        assert.equal(ttf.maxp.numGlyphs, 17);

        assert.equal(ttf.glyf[0].advanceWidth, 512);
        assert.equal(ttf.glyf[0].leftSideBearing, 0);
        assert.equal(ttf.glyf[0].name, '.notdef');
        assert.equal(ttf.glyf[3].contours[0].length, 31);
        assert.equal(ttf.glyf[16].compound, true);
        assert.equal(ttf.glyf[16].glyfs.length, 2);

        assert.equal(ttf.cmap[0], 1);
        assert.equal(ttf.cmap[57400], 16);
    });
});
