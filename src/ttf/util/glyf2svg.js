/**
 * @file glyf转换svg，复合字形轮廓需要ttfObject支持
 * @author mengke01(kekee000@gmail.com)
 *
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */

import contours2svg from './contours2svg';
import transformGlyfContours from './transformGlyfContours';

/**
 * glyf转换svg
 *
 * @param {Object} glyf 解析后的glyf结构
 * @param {Object} ttf ttf对象
 * @return {string} svg文本
 */
export default function glyf2svg(glyf, ttf) {

    if (!glyf) {
        return '';
    }

    const pathArray = [];

    if (!glyf.compound) {
        if (glyf.contours && glyf.contours.length) {
            pathArray.push(contours2svg(glyf.contours));
        }

    }
    else {
        const contours = transformGlyfContours(glyf, ttf);
        if (contours && contours.length) {
            pathArray.push(contours2svg(contours));
        }
    }

    return pathArray.join(' ');
}
