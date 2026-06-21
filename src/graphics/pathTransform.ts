/**
 * @file 对轮廓进行transform变换
 * @author mengke01(kekee000@gmail.com)
 *
 * 参考资料：
 * http://blog.csdn.net/henren555/article/details/9699449
 *
 *  |X|    |a      c       e|    |x|
 *  |Y| =  |b      d       f| *  |y|
 *  |1|    |0      0       1|    |1|
 *
 *  X = x * a + y * c + e
 *  Y = x * b + y * d + f
 */

import {Point} from './util';

/**
 * 图形仿射矩阵变换
 *
 * @param contour 轮廓点
 * @param a m11
 * @param b m12
 * @param c m21
 * @param d m22
 * @param e dx
 * @param f dy
 * @return contour 轮廓点
 */
export default function transform(contour: Point[], a: number, b: number, c: number, d: number, e: number, f: number) {
    let x;
    let y;
    let p;
    for (let i = 0, l = contour.length; i < l; i++) {
        p = contour[i];
        x = p.x;
        y = p.y;
        p.x = x * a + y * c + e;
        p.y = x * b + y * d + f;
    }
    return contour;
}
