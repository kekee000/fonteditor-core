/**
 * @file 对路径进行四舍五入
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 对path坐标进行调整
 *
 * @param {Array} contour 轮廓点数组
 * @param {number} point 四舍五入的点数
 * @return {Object} contour 坐标点
 */
export default function pathCeil(contour, point) {
    let p;
    for (let i = 0, l = contour.length; i < l; i++) {
        p = contour[i];
        if (!point) {
            p.x = Math.round(p.x);
            p.y = Math.round(p.y);
        }
        else {
            p.x = Number(p.x.toFixed(point));
            p.y = Number(p.y.toFixed(point));
        }
    }
    return contour;
}
