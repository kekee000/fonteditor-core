/**
 * @file 调整路径缩放和平移
 * @author mengke01(kekee000@gmail.com)
 */
import {Point} from './util';

/**
 * 对path坐标进行调整
 *
 * @param contour 坐标点
 * @param scaleX x缩放比例
 * @param scaleY y缩放比例
 * @param offsetX x偏移
 * @param offsetY y偏移
 *
 * @return contour 坐标点
 */
export default function pathAdjust(contour: Point[], scaleX?: number, scaleY?: number, offsetX?: number, offsetY?: number) {
    scaleX = scaleX === undefined ? 1 : scaleX;
    scaleY = scaleY === undefined ? 1 : scaleY;
    const x = offsetX || 0;
    const y = offsetY || 0;
    let p;
    for (let i = 0, l = contour.length; i < l; i++) {
        p = contour[i];
        p.x = scaleX * (p.x + x);
        p.y = scaleY * (p.y + y);
    }
    return contour;
}
