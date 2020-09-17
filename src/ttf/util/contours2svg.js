/**
 * @file 将ttf字形转换为svg路径`d`
 * @author mengke01(kekee000@gmail.com)
 */

import contour2svg from './contour2svg';

/**
 * contours轮廓转svgpath
 *
 * @param {Array} contours 轮廓list
 * @param {number} precision 精确度
 * @return {string} path字符串
 */
export default function contours2svg(contours, precision) {

    if (!contours.length) {
        return '';
    }

    return contours.map((contour) => contour2svg(contour, precision)).join('');
}
