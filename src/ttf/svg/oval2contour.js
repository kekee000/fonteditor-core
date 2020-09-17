/**
 * @file 椭圆转换成轮廓
 * @author mengke01(kekee000@gmail.com)
 */

import {computePath} from '../../graphics/computeBoundingBox';
import pathAdjust from '../../graphics/pathAdjust';
import circlePath from '../../graphics/path/circle';
import {clone} from '../../common/lang';

/**
 * 椭圆转换成轮廓
 *
 * @param {number} cx 椭圆中心点x
 * @param {number} cy 椭圆中心点y
 * @param {number} rx 椭圆x轴半径
 * @param {number} ry 椭圆y周半径
 * @return {Array} 轮廓数组
 */
export default function oval2contour(cx, cy, rx, ry) {

    if (undefined === ry) {
        ry = rx;
    }

    const bound = computePath(circlePath);
    const scaleX = (+rx) * 2 / bound.width;
    const scaleY = (+ry) * 2 / bound.height;
    const centerX = bound.width * scaleX / 2;
    const centerY = bound.height * scaleY / 2;
    const contour = clone(circlePath);
    pathAdjust(contour, scaleX, scaleY);
    pathAdjust(contour, 1, 1, +cx - centerX, +cy - centerY);

    return contour;
}
