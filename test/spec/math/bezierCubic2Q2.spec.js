/**
 * @file bezierCubic2Q2
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import bezierCubic2Q2 from 'fonteditor-core/math/bezierCubic2Q2';

const p0 = {
    x: 50,
    y: 50
};

const c0 = {
    x: 80,
    y: 60
};

const c1 = {
    x: 60,
    y: 80
};

const p1 = {
    x: 100,
    y: 100
};

describe('Cubic bezier to quadratic bezier', function () {


    it('test c0=p0, c1 = p1sa', function () {
        let result = bezierCubic2Q2(p0, p0, p1, p1);
        assert.deepEqual(result[0], [
            {
                x: 50,
                y: 50
            },
            {
                x: 75,
                y: 75
            },
            {
                x: 100,
                y: 100
            }
        ]);
        assert.equal(result[1], null);
    });


    it('normal', function () {
        let result = bezierCubic2Q2(p0, c0, c1, p1);

        assert.equal(result.length, 2);

        assert.deepEqual(result[0][1], {
            x: 69.0625,
            y: 57.8125
        });

        assert.deepEqual(result[0][2], {
            x: 71.25,
            y: 71.25
        });

        assert.deepEqual(result[0][2], result[1][0]);

        assert.deepEqual(result[1][1], {
            x: 73.4375,
            y: 84.6875
        });
    });
});
