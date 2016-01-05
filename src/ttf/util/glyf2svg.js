/**
 * @file glyf转换svg
 * @author mengke01(kekee000@gmail.com)
 *
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */


define(
    function (require) {

        var contours2svg = require('./contours2svg');
        var transformGlyfContours = require('./transformGlyfContours');


        /**
         * glyf转换svg
         *
         * @param {Object} glyf 解析后的glyf结构
         * @param {Object} ttf ttf对象
         * @return {string} svg文本
         */
        function glyf2svg(glyf, ttf) {

            if (!glyf) {
                return '';
            }

            var pathArray = [];

            if (!glyf.compound) {
                if (glyf.contours && glyf.contours.length) {
                    pathArray.push(contours2svg(glyf.contours));
                }

            }
            else {
                var contoursList = {};
                transformGlyfContours(glyf, -1, ttf, contoursList);
                if (contoursList[-1]) {
                    pathArray.push(contours2svg(contoursList[-1]));
                }
            }

            return pathArray.join(' ');
        }

        return glyf2svg;
    }
);
