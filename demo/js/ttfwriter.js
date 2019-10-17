/**
 * @file ttfwriter.js
 * @author mengke01
 * @date
 * @description
 * ttfwriter 入口
 */

import TTFReader from 'fonteditor-core/ttf/ttfreader';
import TTFWriter from 'fonteditor-core/ttf/ttfwriter';
import ttf2base64 from 'fonteditor-core/ttf/ttf2base64';

let entry = {

    /**
     * 初始化
     */
    init() {
        $.getJSON('./data/baiduHealth.json', function (ttf) {

            let reader = new TTFReader();
            let writer = new TTFWriter();
            let buffer = writer.write(ttf);

            let ttfData = reader.read(buffer);

            console.log(ttfData);

            let base64str = ttf2base64(buffer);
            let saveBtn = $('.saveas');
            saveBtn.attr('href', base64str);
            saveBtn.attr('download', 'save.ttf');
        });
    }
};

entry.init();
