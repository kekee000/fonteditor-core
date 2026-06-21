/**
 * @file 将ttf字形转换为svg路径`d`
 * @author mengke01(kekee000@gmail.com)
 */

import {Contour} from '../ttf-types';
import contour2svg from './contour2svg';

/**
 * contours轮廓转svgpath
 *
 * @param contours 轮廓list
 * @param precision 精确度
 * @return path字符串
 */
export default function contours2svg(contours: Contour[], precision?: number) {

    if (!contours.length) {
        return '';
    }

    return contours.map((contour) => contour2svg(contour, precision)).join('');
}
