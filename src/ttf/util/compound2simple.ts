/**
 * @file 复合字形设置轮廓，转化为简单字形
 * @author mengke01(kekee000@gmail.com)
 */

import {Contour, Glyph} from '../ttf-types';

/**
 * 复合字形转简单字形
 *
 * @param glyf glyf对象
 * @param contours 轮廓数组
 * @return 转换后对象
 */
export default function compound2simple(glyf: Glyph, contours: Contour[]) {
    glyf.contours = contours;
    delete glyf.compound;
    delete glyf.glyfs;
    // 这里hinting信息会失效，删除hinting信息
    delete glyf.instructions;
    return glyf;
}
