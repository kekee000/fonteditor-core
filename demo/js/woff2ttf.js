/**
 * @file woff2ttf.js
 * @author mengke01
 * @date
 * @description
 * woff 转ttf
 */

import ajaxFile from 'fonteditor-core/common/ajaxFile';
import woff2ttf from 'fonteditor-core/ttf/woff2ttf';
import TTFReader from 'fonteditor-core/ttf/ttfreader';
import ttf2base64 from 'fonteditor-core/ttf/ttf2base64';

const inflate = window.pako.inflate;

function write() {

    ajaxFile({
        type: 'binary',
        url: 'test/fonteditor.woff',
        onSuccess(buffer) {
            let ttfBuffer = woff2ttf(buffer, {
                inflate
            });

            let saveBtn = $('.saveas');
            saveBtn.attr('href', ttf2base64(ttfBuffer));
            saveBtn.attr('download', 'save.woff');

            let ttfReader = new TTFReader();
            let ttfData = ttfReader.read(ttfBuffer);
            console.log(ttfData);
        },
        onError() {
            console.error('error read file');
        }
    });
}

const entry = {

    /**
     * 初始化
     */
    init() {
        write();
    }
};

entry.init();
