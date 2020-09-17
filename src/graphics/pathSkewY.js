/**
 * @file 按Y轴平移变换, 变换中心为图像中心点
 * @author mengke01(kekee000@gmail.com)
 */
import {computePath} from './computeBoundingBox';

/**
 * path倾斜变换
 *
 * @param {Object} contour 坐标点
 * @param {number} angle 角度
 *
 * @return {Object} contour 坐标点
 */
export default function pathSkewY(contour, angle) {
    angle = angle === undefined ? 0 : angle;
    const x = computePath(contour).x;
    const tan = Math.tan(angle);
    let p;
    // y 平移
    for (let i = 0, l = contour.length; i < l; i++) {
        p = contour[i];
        p.y += tan * (p.x - x);
    }
    return contour;
}
