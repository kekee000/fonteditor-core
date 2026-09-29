/**
 * @file matrix
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {mul, multiply} from 'fonteditor-core/graphics/matrix';

describe('matrix mul and multiply', function () {

    it('mul identity by default', function () {
        assert.deepEqual(mul(), [1, 0, 0, 1]);
        assert.deepEqual(mul([1, 0, 0, 1], [1, 0, 0, 1]), [1, 0, 0, 1]);
    });

    it('mul 4 element rotate matrix', function () {
        // scale x2 combined with identity
        assert.deepEqual(mul([2, 0, 0, 2], [1, 0, 0, 1]), [2, 0, 0, 2]);
    });

    it('mul 6 element translate matrix', function () {
        assert.deepEqual(mul([1, 0, 0, 1, 0, 0], [1, 0, 0, 1, 5, 7]), [1, 0, 0, 1, 5, 7]);
    });

    it('multiply chains matrices', function () {
        const result = multiply([1, 0, 0, 1], [1, 0, 0, 1], [2, 0, 0, 2]);
        assert.deepEqual(result, [2, 0, 0, 2]);
    });

    it('multiply single matrix returns itself', function () {
        assert.deepEqual(multiply([2, 0, 0, 3]), [2, 0, 0, 3]);
    });
});
