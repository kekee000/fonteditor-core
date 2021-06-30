/**
 * @file woff2 enc and dec
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {readData} from '../data';
import {default as ttftowoff2, ttftowoff2async} from 'fonteditor-core/ttf/ttftowoff2';
import {default as woff2tottf, woff2tottfasync} from 'fonteditor-core/ttf/woff2tottf';
import main from 'fonteditor-core/main';
import TTFReader from 'fonteditor-core/ttf/ttfreader';

describe('woff2', function () {
    this.timeout(2000);
    before(function (done) {
        main.woff2.init().then(() => done());
    });

    it('ttftowoff2 woff2tottf', function () {
        let result = ttftowoff2(readData('bebas.ttf'));
        assert.ok(result.byteLength);

        result = woff2tottf(result);
        assert.ok(result.byteLength);
        let fontObject = new TTFReader().read(result);
        assert.equal(fontObject.version, 1);
        assert.equal(fontObject.numTables, 16);
    });

    it('ttftowoff2 woff2tottf with compound', function () {
        let result = ttftowoff2(readData('baiduHealth.ttf'));
        assert.ok(result.byteLength);

        result = woff2tottf(result);
        assert.ok(result.byteLength);
        let fontObject = new TTFReader().read(result);
        assert.equal(fontObject.version, 1);
        assert.equal(fontObject.numTables, 14);
    });

    it('ttftowoff2async', function (done) {
        ttftowoff2async(readData('bebas.ttf')).then(function (result) {
            assert.ok(result.byteLength);
            return woff2tottf(result);
        })
            .then(function (result) {
                assert.ok(result.byteLength);
                let fontObject = new TTFReader().read(result);
                assert.equal(fontObject.version, 1);
                assert.equal(fontObject.numTables, 16);
                done();
            });
    });

    it('woff2tottfasync', function (done) {
        woff2tottfasync(readData('bebas.woff2')).then(function (result) {
            assert.ok(result.byteLength);
            let fontObject = new TTFReader().read(result);
            assert.equal(fontObject.version, 1);
            assert.equal(fontObject.numTables, 16);
            done();
        });
    });

    it('ttftowoff2async with compound', function (done) {
        ttftowoff2async(readData('baiduHealth.ttf')).then(function (result) {
            assert.ok(result.byteLength);
            return woff2tottfasync(result);
        })
            .then(function (result) {
                assert.ok(result.byteLength);
                let fontObject = new TTFReader().read(result);
                assert.equal(fontObject.version, 1);
                assert.equal(fontObject.numTables, 14);
                done();
            });
    });

    it('woff2tottfasync compound', function (done) {
        woff2tottfasync(readData('baiduHealth.woff2')).then(function (result) {
            assert.ok(result.byteLength);
            let fontObject = new TTFReader().read(result);
            assert.equal(fontObject.version, 1);
            assert.equal(fontObject.numTables, 14);
            done();
        });
    });
});
