/**
 * @file svg字符串转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        /**
         * svg字符串转base64编码
         *
         * @param {string} svg svg对象
         * @param {string} scheme  头部
         * @return {string} base64编码
         */
        function svg2base64(svg, scheme) {
            scheme = scheme || 'font/svg';
            return 'data:' + scheme + ';charset=utf-8;base64,' + btoa(svg);
        }

        return svg2base64;
    }
);
