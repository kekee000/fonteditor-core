/**
 * @file woff2ttfobject.js
 * @author mengke01
 * @date
 * @description
 * woff 转ttf
 */

define(
    function(require) {
        var compress = window.brotli.compress;
        var decompress = window.brotli.decompress;

        var ajaxFile = require('common/ajaxFile');
        var woff2ttfobject = require('ttf/woff2ttfobject');
        var TTFReader = require('ttf/ttfreader');

        var ttf2base64 = require('ttf/ttf2base64');


        function write() {

            ajaxFile({
                type: 'binary',
                url: './test/icomoon.woff2',
                onSuccess: function(buffer) {

                    var ttfBuffer = woff2ttfobject(buffer, {
                        decompress: decompress,
                        compress: compress
                    });

                    console.log(ttfBuffer);

                    // var saveBtn = $('.saveas');
                    // saveBtn.attr('href', ttf2base64(ttfBuffer));
                    // saveBtn.attr('download', 'save.woff');

                    // var ttfReader = new TTFReader();
                    // var ttfData = ttfReader.read(ttfBuffer);
                    // console.log(ttfData);
                },
                onError: function() {
                    console.error('error read file');
                }
            });
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                write();
            }
        };

        entry.init();

        return entry;
    }
);
