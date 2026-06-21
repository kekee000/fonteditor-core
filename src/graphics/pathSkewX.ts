/**
 * @file 按X轴平移变换, 变换中心为图像中心点
 * @author mengke01(kekee000@gmail.com)
 */
import {computePath} from './computeBoundingBox';
import {Point} from './util';

/**
 * path倾斜变换
 *
 * @param contour 坐标点
 * @param angle 角度
 *
 * @return contour 坐标点
 */
export default function pathSkewX(contour: Point[], angle: number) {
    angle = angle === undefined ? 0 : angle;
    const y = computePath(contour).y;
    const tan = Math.tan(angle);
    let p;
    // x 平移
    for (let i = 0, l = contour.length; i < l; i++) {
        p = contour[i];
        p.x += tan * (p.y - y);
    }
    return contour;
}
