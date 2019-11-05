/**
 * @file pathAdjust
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {clone} from 'fonteditor-core/common/lang';
import pathAdjust from 'fonteditor-core/graphics/pathAdjust';

const path = [
    {
        x: 50,
        y: 50
    },
    {
        x: 100,
        y: 100
    }
];

describe('调整路径', function () {

    it('test default', function () {

        let result = pathAdjust(clone(path));
        assert.deepEqual(result, [
            {
                x: 50,
                y: 50
            },
            {
                x: 100,
                y: 100
            }
        ]);

        result = pathAdjust(clone(path), 1, 1);
        assert.deepEqual(result, [
            {
                x: 50,
                y: 50
            },
            {
                x: 100,
                y: 100
            }
        ]);

        result = pathAdjust(clone(path), 1, 1, 0, 0);
        assert.deepEqual(result, [
            {
                x: 50,
                y: 50
            },
            {
                x: 100,
                y: 100
            }
        ]);
    });

    it('test scale', function () {

        let result = pathAdjust(clone(path), 2, 2);
        assert.deepEqual(result, [
            {
                x: 100,
                y: 100
            },
            {
                x: 200,
                y: 200
            }
        ]);

        result = pathAdjust(clone(path), 0.5, 1);
        assert.deepEqual(result, [
            {
                x: 25,
                y: 50
            },
            {
                x: 50,
                y: 100
            }
        ]);

        result = pathAdjust(clone(path), 1, 2, 0, 0);
        assert.deepEqual(result, [
            {
                x: 50,
                y: 100
            },
            {
                x: 100,
                y: 200
            }
        ]);
    });


    it('test offset', function () {

        let result = pathAdjust(clone(path), 1, 1, 10, 10);
        assert.deepEqual(result, [
            {
                x: 60,
                y: 60
            },
            {
                x: 110,
                y: 110
            }
        ]);

        result = pathAdjust(clone(path), 2, 2, 10, 10);
        assert.deepEqual(result, [
            {
                x: 120,
                y: 120
            },
            {
                x: 220,
                y: 220
            }
        ]);
    });

});
