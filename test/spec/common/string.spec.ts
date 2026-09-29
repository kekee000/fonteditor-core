/**
 * @file string
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import string from 'fonteditor-core/common/string';

describe('common string', function () {

    it('decodeHTML decodes entities', function () {
        assert.equal(string.decodeHTML('&lt;a&gt;&amp;&quot;'), '<a>&"');
        assert.equal(string.decodeHTML('&#65;&#66;'), 'AB');
    });

    it('encodeHTML encodes special characters', function () {
        assert.equal(string.encodeHTML('<>&"\''), '&lt;&gt;&amp;&quot;&#39;');
    });

    it('getLength counts non-ascii as two', function () {
        assert.equal(string.getLength('abc'), 3);
        assert.equal(string.getLength('ab中'), 4);
    });

    it('format replaces template placeholders', function () {
        assert.equal(string.format('${x}', {x: 5}), '5');
        assert.equal(string.format('${a.b}', {a: {b: 7}}), '7');
        assert.equal(string.format('${z}', {}), '');
    });

    it('pad fills string to size', function () {
        assert.equal(string.pad(5, 3), '005');
        assert.equal(string.pad(7, 2, 'x'), 'x7');
        assert.equal(string.pad('12345', 3), '345');
    });

    it('hashcode is deterministic and distinguishes strings', function () {
        assert.equal(string.hashcode(''), 0);
        assert.equal(string.hashcode('abc'), string.hashcode('abc'));
        assert.notEqual(string.hashcode('a'), string.hashcode('b'));
    });
});
