/**
 * @file pathUtil
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {
    interpolate,
    deInterpolate,
    isClockWise,
    getPathHash,
    removeOverlapPoints,
    scale,
    clone
} from 'fonteditor-core/graphics/pathUtil';

describe('graphics pathUtil', function () {

    it('interpolate inserts midpoint between two off-curve points', function () {
        const path = [{x: 0, y: 0}, {x: 10, y: 0}];
        const result = interpolate(path);
        // two off-curve points => insert one interpolated on-curve point after each
        assert.equal(result.length, 4);
        assert.deepEqual(result[1], {x: 5, y: 0, onCurve: true});
    });

    it('interpolate keeps on-curve only path unchanged in length', function () {
        const path = [
            {x: 0, y: 0, onCurve: true},
            {x: 10, y: 0, onCurve: true}
        ];
        const result = interpolate(path);
        assert.equal(result.length, 2);
    });

    it('deInterpolate removes redundant interpolated points', function () {
        const path = interpolate([{x: 0, y: 0}, {x: 10, y: 0}]);
        const result = deInterpolate(path);
        assert.equal(result.length, 2);
    });

    it('isClockWise detects orientation and reverses sign', function () {
        const square = [
            {x: 0, y: 0},
            {x: 10, y: 0},
            {x: 10, y: 10},
            {x: 0, y: 10}
        ];
        const dir = isClockWise(square);
        assert.equal(dir, -1);
        assert.equal(isClockWise([...square].reverse()), 1);
    });

    it('isClockWise returns 0 for degenerate path', function () {
        assert.equal(isClockWise([{x: 0, y: 0}, {x: 1, y: 1}]), 0);
    });

    it('getPathHash is deterministic', function () {
        const path = [{x: 1, y: 2}, {x: 3, y: 4, onCurve: true}];
        assert.equal(typeof getPathHash(path), 'number');
        assert.equal(getPathHash(path), getPathHash(path));
    });

    it('removeOverlapPoints removes duplicated coordinates', function () {
        const points = [{x: 1, y: 1}, {x: 1, y: 1}, {x: 2, y: 2}];
        const result = removeOverlapPoints(points);
        assert.equal(result.length, 2);
    });

    it('scale multiplies coordinates in place', function () {
        const path = [{x: 1, y: 2}, {x: 3, y: 4}];
        const result = scale(path, 2);
        assert.strictEqual(result, path);
        assert.deepEqual(result, [{x: 2, y: 4}, {x: 6, y: 8}]);
    });

    it('clone copies points preserving onCurve', function () {
        const path = [{x: 1, y: 2, onCurve: true}, {x: 3, y: 4}];
        const result = clone(path);
        assert.notStrictEqual(result, path);
        assert.notStrictEqual(result[0], path[0]);
        assert.deepEqual(result, [{x: 1, y: 2, onCurve: true}, {x: 3, y: 4}]);
    });
});
