/**
 * @file 多边形转换成轮廓
 * @author mengke01(kekee000@gmail.com)
 */

import parseParams from './parseParams';

/**
 * 多边形转换成轮廓
 *
 * @param {Array} points 多边形点集合
 * @return {Array} contours
 */
export default function polygon2contour(points) {

    if (!points || !points.length) {
        return null;
    }

    const contours = [];
    const segments = parseParams(points);
    for (let i = 0, l = segments.length; i < l; i += 2) {
        contours.push({
            x: segments[i],
            y: segments[i + 1],
            onCurve: true
        });
    }

    return contours;
}
