/**
 * @file 单元测试入口
 * @author mengke01(kekee000@gmail.com)
 */
import assert from 'assert';
import fonteditor from 'fonteditor-core/main';


describe('main', function () {
    it('entries', function () {
        assert.ok(fonteditor.Font, 'exports');
        assert.ok(fonteditor.TTF, 'exports');
        assert.ok(fonteditor.TTFReader, 'exports');
        assert.ok(fonteditor.TTFWriter, 'exports');
        assert.ok(fonteditor.ttf2eot, 'exports');
        assert.ok(fonteditor.eot2ttf, 'exports');
        assert.ok(fonteditor.ttf2woff, 'exports');
        assert.ok(fonteditor.woff2ttf, 'exports');
        assert.ok(fonteditor.ttf2svg, 'exports');
        assert.ok(fonteditor.svg2ttfobject, 'exports');
        assert.ok(fonteditor.Reader, 'exports');
        assert.ok(fonteditor.Writer, 'exports');
        assert.ok(fonteditor.OTFReader, 'exports');
        assert.ok(fonteditor.otf2ttfobject, 'exports');
        assert.ok(fonteditor.ttf2base64, 'exports');
        assert.ok(fonteditor.ttf2icon, 'exports');
        assert.ok(fonteditor.ttftowoff2, 'exports');
        assert.ok(fonteditor.woff2tottf, 'exports');
        assert.ok(fonteditor.woff2, 'exports');
        assert.ok(fonteditor.woff2.init, 'exports');
    });
});

