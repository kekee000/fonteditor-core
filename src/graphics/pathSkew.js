/**
 * @file path倾斜变换
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * path倾斜变换
 *
 * @param {Object} contour 坐标点
 * @param {number} angle 角度
 * @param {number} offsetX x偏移
 * @param {number} offsetY y偏移
 *
 * @return {Object} contour 坐标点
 */
export default function pathSkew(contour, angle, offsetX, offsetY) {
    angle = angle === undefined ? 0 : angle;
    const x = offsetX || 0;
    const tan = Math.tan(angle);
    let p;
    let i;
    let l;

    // x 平移
    if (x === 0) {
        for (i = 0, l = contour.length; i < l; i++) {
            p = contour[i];
            p.x += tan * (p.y - offsetY);
        }
    }
    // y平移
    else {
        for (i = 0, l = contour.length; i < l; i++) {
            p = contour[i];
            p.y += tan * (p.x - offsetX);
        }
    }

    return contour;
}
