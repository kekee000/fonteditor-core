/**
 * @file util
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import {
    ceil,
    ceilPoint,
    isPointInBound,
    isPointOverlap,
    getPointHash
} from 'fonteditor-core/graphics/util';

describe('graphics util', function () {

    it('ceil rounds near-integer values', function () {
        assert.equal(ceil(5.000001), 5);
        assert.equal(ceil(4.999999), 5);
        assert.equal(ceil(1.234567), 1.23457);
    });

    it('ceilPoint rounds point coordinates in place', function () {
        const p = {x: 5.000001, y: 9.999999};
        const result = ceilPoint(p);
        assert.strictEqual(result, p);
        assert.equal(p.x, 5);
        assert.equal(p.y, 10);
    });

    it('isPointInBound checks inclusion', function () {
        const bound = {x: 0, y: 0, width: 100, height: 100};
        assert.equal(isPointInBound(bound, {x: 50, y: 50}), true);
        assert.equal(isPointInBound(bound, {x: 0, y: 0}), true);
        assert.equal(isPointInBound(bound, {x: 100, y: 100}), true);
        assert.equal(isPointInBound(bound, {x: 101, y: 50}), false);
        assert.equal(isPointInBound(bound, {x: -1, y: 50}), false);
    });

    it('isPointInBound with fixed rounding', function () {
        const bound = {x: 0, y: 0, width: 100, height: 100};
        assert.equal(isPointInBound(bound, {x: 100.000001, y: 50}, true), true);
    });

    it('isPointOverlap compares rounded coordinates', function () {
        assert.equal(isPointOverlap({x: 5, y: 5}, {x: 5.000001, y: 5}), true);
        assert.equal(isPointOverlap({x: 5, y: 5}, {x: 6, y: 5}), false);
    });

    it('getPointHash returns deterministic number', function () {
        assert.equal(getPointHash({x: 5, y: 5}), 65850);
        assert.equal(getPointHash({x: 5, y: 5}), getPointHash({x: 5, y: 5}));
        assert.notEqual(getPointHash({x: 5, y: 5}), getPointHash({x: 6, y: 5}));
    });
});
