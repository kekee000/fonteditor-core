/**
 * @file computeBoundingBox
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import * as computeBoundingBox from 'fonteditor-core/graphics/computeBoundingBox';

const p0 = {
    x: 50,
    y: 50,
    onCurve: true
};

const c0 = {
    x: 80,
    y: 60
};

const c1 = {
    x: 200,
    y: 200
};

const p1 = {
    x: 100,
    y: 100,
    onCurve: true
};

describe('compute bounds', function () {

    it('test computeBounding', function () {

        let result = computeBoundingBox.computeBounding([]);
        assert.equal(result, false);

        result = computeBoundingBox.computeBounding([p0]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 0,
            height: 0
        });

        result = computeBoundingBox.computeBounding([p0, p1]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 50,
            height: 50
        });


        result = computeBoundingBox.computeBounding([p0, c1, p1]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 150,
            height: 150
        });
    });


    it('test quadraticBezier', function () {

        let result = computeBoundingBox.quadraticBezier(p0, p0, p0);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 0,
            height: 0
        });

        result = computeBoundingBox.quadraticBezier(p0, p0, p1);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 50,
            height: 50
        });

        result = computeBoundingBox.quadraticBezier(p0, c0, p1);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 50,
            height: 50
        });

        result = computeBoundingBox.quadraticBezier(p0, c1, p1);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 90,
            height: 90
        });
    });

    it('test computePath', function () {
        let result = computeBoundingBox.computePath([p0]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 0,
            height: 0
        });

        result = computeBoundingBox.computePath([p0, p1]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 50,
            height: 50
        });


        result = computeBoundingBox.computePath([p0, c1, p1]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 90,
            height: 90
        });
    });


    it('test computePathBox', function () {

        let result = computeBoundingBox.computePathBox([]);
        assert.equal(result, false);

        result = computeBoundingBox.computePathBox([p0]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 0,
            height: 0
        });

        result = computeBoundingBox.computePathBox([p0, p1]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 50,
            height: 50
        });


        result = computeBoundingBox.computePathBox([p0, c1, p1]);
        assert.deepEqual(result, {
            x: 50,
            y: 50,
            width: 150,
            height: 150
        });
    });

});
