/**
 * @file 计算曲线包围盒
 * @author mengke01(kekee000@gmail.com)
 *
 * modify from:
 * zrender
 * https://github.com/ecomfe/zrender/blob/master/src/tool/computeBoundingBox.js
 */
import pathIterator from './pathIterator';

/**
 * 计算包围盒
 *
 * @param {Array} points 点集
 * @return {Object} bounding box
 */
function computeBoundingBox(points) {

    if (points.length === 0) {
        return false;
    }

    let left = points[0].x;
    let right = points[0].x;
    let top = points[0].y;
    let bottom = points[0].y;

    for (let i = 1; i < points.length; i++) {
        const p = points[i];

        if (p.x < left) {
            left = p.x;
        }

        if (p.x > right) {
            right = p.x;
        }

        if (p.y < top) {
            top = p.y;
        }

        if (p.y > bottom) {
            bottom = p.y;
        }
    }

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
    };
}

/**
 * 计算二阶贝塞尔曲线的包围盒
 * http://pissang.net/blog/?p=91
 *
 * @param {Object} p0 p0
 * @param {Object} p1 p1
 * @param {Object} p2 p2
 * @return {Object} bound对象
 */
function computeQuadraticBezierBoundingBox(p0, p1, p2) {
    // Find extremities, where derivative in x dim or y dim is zero
    let tmp = (p0.x + p2.x - 2 * p1.x);
    // p1 is center of p0 and p2 in x dim
    let t1;
    if (tmp === 0) {
        t1 = 0.5;
    }
    else {
        t1 = (p0.x - p1.x) / tmp;
    }

    tmp = (p0.y + p2.y - 2 * p1.y);
    // p1 is center of p0 and p2 in y dim
    let t2;
    if (tmp === 0) {
        t2 = 0.5;
    }
    else {
        t2 = (p0.y - p1.y) / tmp;
    }

    t1 = Math.max(Math.min(t1, 1), 0);
    t2 = Math.max(Math.min(t2, 1), 0);

    const ct1 = 1 - t1;
    const ct2 = 1 - t2;

    const x1 = ct1 * ct1 * p0.x + 2 * ct1 * t1 * p1.x + t1 * t1 * p2.x;
    const y1 = ct1 * ct1 * p0.y + 2 * ct1 * t1 * p1.y + t1 * t1 * p2.y;

    const x2 = ct2 * ct2 * p0.x + 2 * ct2 * t2 * p1.x + t2 * t2 * p2.x;
    const y2 = ct2 * ct2 * p0.y + 2 * ct2 * t2 * p1.y + t2 * t2 * p2.y;

    return computeBoundingBox(
        [
            p0,
            p2,
            {
                x: x1,
                y: y1
            },
            {
                x: x2,
                y: y2
            }
        ]
    );
}

/**
 * 计算曲线包围盒
 *
 * @private
 * @param {...Array} args 坐标点集, 支持多个path
 * @return {Object} {x, y, width, height}
 */
function computePathBoundingBox(...args) {

    const points = [];
    const iterator = function (c, p0, p1, p2) {
        if (c === 'L') {
            points.push(p0);
            points.push(p1);
        }
        else if (c === 'Q') {
            const bound = computeQuadraticBezierBoundingBox(p0, p1, p2);

            points.push(bound);
            points.push({
                x: bound.x + bound.width,
                y: bound.y + bound.height
            });
        }
    };

    if (args.length === 1) {
        pathIterator(args[0], (c, p0, p1, p2) => {
            if (c === 'L') {
                points.push(p0);
                points.push(p1);
            }
            else if (c === 'Q') {
                const bound = computeQuadraticBezierBoundingBox(p0, p1, p2);

                points.push(bound);
                points.push({
                    x: bound.x + bound.width,
                    y: bound.y + bound.height
                });
            }
        });
    }
    else {
        for (let i = 0, l = args.length; i < l; i++) {
            pathIterator(args[i], iterator);
        }
    }

    return computeBoundingBox(points);
}


/**
 * 计算曲线点边界
 *
 * @private
 * @param {...Array} args path对象, 支持多个path
 * @return {Object} {x, y, width, height}
 */
export function computePathBox(...args) {
    let points = [];
    if (args.length === 1) {
        points = args[0];
    }
    else {
        for (let i = 0, l = args.length; i < l; i++) {
            Array.prototype.splice.apply(points, [points.length, 0].concat(args[i]));
        }
    }
    return computeBoundingBox(points);
}

export const computeBounding = computeBoundingBox;
export const quadraticBezier = computeQuadraticBezierBoundingBox;
export const computePath = computePathBoundingBox;
