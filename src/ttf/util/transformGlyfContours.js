/**
 * @file 转换复合字形的contours，以便于显示
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var pathCeil = require('../../graphics/pathCeil');
    var pathTransform = require('../../graphics/pathTransform');
    var lang = require('../../common/lang');


    /**
     * 转换复合字形轮廓，结果保存在contoursList中
     *
     * @param  {Object} glyf glyf对象
     * @param  {number} index glyf对象当前的index
     * @param  {Object} ttf ttfObject对象
     * @param  {Object} contoursList 保存转换中间生成的contours
     */
    function transformGlyfContours(glyf, index, ttf, contoursList) {

        if (!glyf.glyfs) {
            return glyf;
        }

        var compoundContours = [];
         glyf.glyfs.forEach(function (g) {
            var glyph = ttf.glyf[g.glyphIndex];

            if (!glyph) {
                return;
            }

            // 递归转换contours
            if (glyph.compound && !contoursList[g.glyphIndex]) {
                transformGlyfContours(glyph, g.glyphIndex, ttf, contoursList);
            }

            // 这里需要进行matrix变换，需要复制一份
            var contours = lang.clone(glyph.compound ? (contoursList[g.glyphIndex] || []) : glyph.contours);
            var transform = g.transform;
            for (var i = 0, l = contours.length; i < l; i++) {
                pathTransform(
                    contours[i],
                    transform.a,
                    transform.b,
                    transform.c,
                    transform.d,
                    transform.e,
                    transform.f
                );
                compoundContours.push(pathCeil(contours[i]));
            }
        });

        contoursList[index] = compoundContours;
    }

    return transformGlyfContours;
});
