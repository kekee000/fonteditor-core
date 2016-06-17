/**
 * @file ttf 转 svg symbol
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var string = require('../common/string');
        var TTFReader = require('./ttfreader');
        var contours2svg = require('./util/contours2svg');
        var pathsUtil = require('../graphics/pathsUtil');
        var unicode2xml = require('./util/unicode2xml');
        var error = require('./error');

        // xml 模板
        var XML_TPL = ''
            + '<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1"'
            +   ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
            +   '<defs>${symbolList}</defs>'
            + '</svg>';

        // symbol 模板
        var SYMBOL_TPL = ''
            + '<symbol id="${id}" viewBox="0 ${descent} ${unitsPerEm} ${unitsPerEm}">'
            +   '<path d="${d}"></path>'
            + '</symbol>';


        /**
         * 根据 glyf 获取 symbo 名称
         * 1. 有 `name` 属性则使用 name 属性
         * 2. 有 `unicode` 属性则取 unicode 第一个: 'uni' + unicode
         * 3. 使用索引号作为 id: 'symbol' + index
         *
         * @param  {Object} glyf  glyf 对象
         * @param  {number} index glyf 索引
         * @return {string}
         */
        function getSymbolId(glyf, index) {
            if (glyf.name) {
                return glyf.name;
            }

            if (glyf.unicode && glyf.unicode.length) {
                return 'uni-' + glyf.unicode[0];
            }
            return 'symbol-' + index;
        }

        /**
         * ttf数据结构转svg
         *
         * @param {ttfObject} ttf ttfObject对象
         * @param {Object} options 选项
         * @param {Object} options.metadata 字体相关的信息
         * @return {string} svg字符串
         */
        function ttfobject2symbol(ttf, options) {

            var xmlObject = {};
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = ttf.hhea.descent;
            // glyf 信息
            var symbolList = '';
            for (var i = 1, l = ttf.glyf.length; i < l; i++) {
                var glyf = ttf.glyf[i];
                // 筛选简单字形，并且有轮廓，有编码
                if (!glyf.compound && glyf.contours) {
                    var contours = pathsUtil.flip(glyf.contours);
                    var glyfObject = {
                        descent: descent,
                        unitsPerEm: unitsPerEm,
                        id: getSymbolId(glyf, i),
                        d: contours2svg(contours)
                    };
                    symbolList += string.format(SYMBOL_TPL, glyfObject);
                }
            }
            xmlObject.symbolList = symbolList;

            return string.format(XML_TPL, xmlObject);
        }


        /**
         * ttf格式转换成svg字体格式
         *
         * @param {ArrayBuffer|ttfObject} ttfBuffer ttf缓冲数组或者ttfObject对象
         * @param {Object} options 选项
         * @param {Object} options.metadata 字体相关的信息
         *
         * @return {string} svg字符串
         */
        function ttf2symbol(ttfBuffer, options) {

            options = options || {};

            // 读取ttf二进制流
            if (ttfBuffer instanceof ArrayBuffer) {
                var reader = new TTFReader();
                var ttfObject = reader.read(ttfBuffer);
                reader.dispose();

                return ttfobject2symbol(ttfObject, options);
            }
            // 读取ttfObject
            else if (ttfBuffer.version && ttfBuffer.glyf) {

                return ttfobject2symbol(ttfBuffer, options);
            }

            error.raise(10112);
        }

        ttf2symbol.getSymbolId = getSymbolId;
        return ttf2symbol;
    }
);
