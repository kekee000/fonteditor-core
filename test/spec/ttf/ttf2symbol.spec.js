/**
 * @file ttf2symbol
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {readData} from '../data';
import TTFReader from 'fonteditor-core/ttf/ttfreader';
import ttf2symbol from 'fonteditor-core/ttf/ttf2symbol';

describe('ttf to symbol', function () {

    let fontObject = new TTFReader().read(readData('baiduHealth.ttf'));
    let svg = ttf2symbol(fontObject);

    it('test genrate svg symbol', function () {
        assert.ok(svg.length > 1000);
        assert.equal(svg.match(/<symbol\s/g).length, 14);
    });
});
