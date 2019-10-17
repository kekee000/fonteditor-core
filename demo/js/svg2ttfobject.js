/**
 * @file svg2ttfobject.js
 * @author mengke01
 * @date
 * @description
 * svg转ttfobject
 */

import svg2ttfobject from 'fonteditor-core/ttf/svg2ttfobject';
import ttf2base64 from 'fonteditor-core/ttf/ttf2base64';
import TTFWriter from 'fonteditor-core/ttf/ttfwriter';

let entry = {

    /**
     * 初始化
     */
    init() {

        $.ajax({
            url: './test/fonteditor.svg',
            dataType: 'text'
        }).done(function (data) {

            let ttfObject = svg2ttfobject(data);
            let writer = new TTFWriter();

            let ttfBuffer = writer.write(ttfObject);
            let base64str = ttf2base64(ttfBuffer);

            let saveBtn = $('.saveas');
            saveBtn.attr('href', base64str);
            saveBtn.attr('download', 'save.ttf');
            console.log(ttfObject);
        });

    }
};

entry.init();
