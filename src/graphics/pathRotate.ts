/**
 * @file 路径旋转
 * @author mengke01(kekee000@gmail.com)
 */

import {Point} from './util';

/**
 * 对path坐标进行调整
 *
 * @param contour 坐标点
 * @param angle 角度
 * @param centerX x偏移
 * @param centerY y偏移
 *
 * @return contour 坐标点
 */
export default function pathRotate(contour: Point[], angle: number, centerX: number, centerY: number) {
    angle = angle === undefined ? 0 : angle;
    const x = centerX || 0;
    const y = centerY || 0;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    let px;
    let py;
    let p;

    // x1=cos(angle)*x-sin(angle)*y;
    // y1=cos(angle)*y+sin(angle)*x;
    for (let i = 0, l = contour.length; i < l; i++) {
        p = contour[i];
        px = cos * (p.x - x) - sin * (p.y - y);
        py = cos * (p.y - y) + sin * (p.x - x);
        p.x = px + x;
        p.y = py + y;
    }

    return contour;
}
