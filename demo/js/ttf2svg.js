/**
 * @file ttf2woff.js
 * @author mengke01
 * @date
 * @description
 * ttf2woff 转换
 */

import ajaxFile from 'fonteditor-core/common/ajaxFile';
import ttf2svg from 'fonteditor-core/ttf/ttf2svg';
import svg2base64 from 'fonteditor-core/ttf/svg2base64';
import TTFReader from 'fonteditor-core/ttf/ttfreader';
import TTF from 'fonteditor-core/ttf/ttf';

// 设置字体
function setFont(base64str) {
    let str = ''
        + '@font-face {'
        + 'font-family:\'truetype\';'
        + 'src:url('
        +   base64str
        + ') format(\'svg\');'
        + '}';
    document.getElementById('font-face').innerHTML = str;
}
        // 查看ttf glyf
function showTTFGlyf(ttfData) {
    let ttf = new TTF(ttfData);
    let codes = ttf.codes();

    let str = '';
    // 获取unicode字符
    codes.forEach(function (item) {
        str += '<li data-code="' + item + '">'
            + '<span class="i-font">' + String.fromCharCode(item) + '</span>'
            +   (item > 255 ? '\\u' + Number(item).toString(16) : item)
            + '</li>';
    });
    $('#font-list').html(str);
}



function write() {
    ajaxFile({
        type: 'binary',
        url: './test/fonteditor.ttf',
        onSuccess(buffer) {

            let svgBuffer = ttf2svg(buffer, {
                metadata: 'fonteditor V0.1'
            });

            let base64str = svg2base64(svgBuffer);
            setFont(base64str);


            let saveBtn = $('.saveas');
            saveBtn.attr('href', base64str);
            saveBtn.attr('download', 'save.svg');

            let ttfReader = new TTFReader();
            let ttfData = ttfReader.read(buffer);
            showTTFGlyf(ttfData);

        },
        onError() {
            console.error('error read file');
        }
    });
}

let entry = {

    /**
     * 初始化
     */
    init() {
        write();
    }
};

entry.init();
