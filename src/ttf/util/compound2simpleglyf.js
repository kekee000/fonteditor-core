/**
 * @file ttf复合字形转简单字形
 * @author mengke01(kekee000@gmail.com)
 */


import transformGlyfContours from './transformGlyfContours';
import compound2simple from './compound2simple';

/**
 * ttf复合字形转简单字形
 *
 * @param  {Object|number} glyf glyf对象或者glyf索引
 * @param  {Object} ttf ttfObject对象
 * @param  {boolean} recrusive 是否递归的进行转换，如果复合字形为嵌套字形，则转换每一个复合字形
 * @return {Object} 转换后的对象
 */
export default function compound2simpleglyf(glyf, ttf, recrusive) {

    let glyfIndex;
    // 兼容索引和对象传入
    if (typeof glyf === 'number') {
        glyfIndex = glyf;
        glyf = ttf.glyf[glyfIndex];
    }
    else {
        glyfIndex = ttf.glyf.indexOf(glyf);
        if (-1 === glyfIndex) {
            return glyf;
        }
    }

    if (!glyf.compound || !glyf.glyfs) {
        return glyf;
    }

    const contoursList = {};
    transformGlyfContours(glyf, ttf, contoursList, glyfIndex);

    if (recrusive) {
        Object.keys(contoursList).forEach((index) => {
            compound2simple(ttf.glyf[index], contoursList[index]);
        });
    }
    else {
        compound2simple(glyf, contoursList[glyfIndex]);
    }

    return glyf;
}
