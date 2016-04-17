/**
 * @file 主函数
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        return {
            Font: require('./ttf/font'),
            TTF: require('./ttf/ttf'),
            TTFReader: require('./ttf/ttfreader'),
            TTFWriter: require('./ttf/ttfwriter'),
            ttf2eot: require('./ttf/ttf2eot'),
            eot2ttf: require('./ttf/eot2ttf'),
            ttf2woff: require('./ttf/ttf2woff'),
            woff2ttf: require('./ttf/woff2ttf'),
            ttf2svg: require('./ttf/ttf2svg'),
            svg2ttfobject: require('./ttf/svg2ttfobject'),
            Reader: require('./ttf/reader'),
            Writer: require('./ttf/writer'),
            OTFReader: require('./ttf/otfreader'),
            otf2ttfobject: require('./ttf/otf2ttfobject'),
            ttf2base64: require('./ttf/ttf2base64'),
            ttf2icon: require('./ttf/ttf2icon')
        };
    }
);
