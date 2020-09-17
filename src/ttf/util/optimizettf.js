/**
 * @file 对ttf对象进行优化，查找错误，去除冗余点
 * @author mengke01(kekee000@gmail.com)
 */

import reduceGlyf from './reduceGlyf';
import pathCeil from '../../graphics/pathCeil';

/**
 * 对ttf对象进行优化
 *
 * @param  {Object} ttf ttf对象
 * @return {true|Object} 错误信息
 */
export default function optimizettf(ttf) {

    const checkUnicodeRepeat = {}; // 检查是否有重复代码点
    const repeatList = [];

    ttf.glyf.forEach((glyf, index) => {
        if (glyf.unicode) {
            glyf.unicode = glyf.unicode.sort();

            // 将glyf的代码点按小到大排序
            glyf.unicode.sort((a, b) => a - b).forEach((u) => {
                if (checkUnicodeRepeat[u]) {
                    repeatList.push(index);
                }
                else {
                    checkUnicodeRepeat[u] = true;
                }
            });

        }

        if (!glyf.compound && glyf.contours) {
            // 整数化
            glyf.contours.forEach((contour) => {
                pathCeil(contour);
            });
            // 缩减glyf
            reduceGlyf(glyf);
        }

        // 整数化
        glyf.xMin = Math.round(glyf.xMin || 0);
        glyf.xMax = Math.round(glyf.xMax || 0);
        glyf.yMin = Math.round(glyf.yMin || 0);
        glyf.yMax = Math.round(glyf.yMax || 0);
        glyf.leftSideBearing = Math.round(glyf.leftSideBearing || 0);
        glyf.advanceWidth = Math.round(glyf.advanceWidth || 0);
    });

    // 过滤无轮廓字体，如果存在复合字形不进行过滤
    if (!ttf.glyf.some((a) => a.compound)) {
        ttf.glyf = ttf.glyf.filter((glyf, index) => index === 0 || glyf.contours && glyf.contours.length);
    }

    if (!repeatList.length) {
        return true;
    }

    return {
        repeat: repeatList
    };
}
