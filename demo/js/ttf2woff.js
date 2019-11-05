/**
 * @file ttf2woff.js
 * @author mengke01
 * @date
 * @description
 * ttf2woff 转换
 */

import ajaxFile from 'fonteditor-core/common/ajaxFile';
import ttf2woff from 'fonteditor-core/ttf/ttf2woff';
import woff2base64 from 'fonteditor-core/ttf/woff2base64';
import TTFReader from 'fonteditor-core/ttf/ttfreader';
import TTF from 'fonteditor-core/ttf/ttf';
const deflate = window.pako.deflate;

// 设置字体
function setFont(base64str) {
    let str = ''
        + '@font-face {'
        + 'font-family:\'truetype\';'
        + 'src:url('
        +   base64str
        + ') format(\'woff\');'
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

let ttf2woffoptions = {
    metadata: {
        vendor: {
            name: 'mk',
            url: 'http://www.baidu.com'
        },
        credit: {
            name: 'mk',
            url: 'http://www.baidu.com'
        },
        description: 'font editor ver 1.0',
        license: {
            url: 'http://www.baidu.com',
            id: 'id',
            text: 'font editor ver 1.0'
        },
        copyright: '"m;k"',
        trademark: 'trademark',
        licensee: 'http://www.baidu.com'
    }
};


function write() {
    ajaxFile({
        type: 'binary',
        url: './test/fonteditor.ttf',
        onSuccess(buffer) {

            let woffBuffer = ttf2woff(buffer, ttf2woffoptions);

            let base64str = woff2base64(woffBuffer);
            setFont(base64str);


            let saveBtn = $('.saveas');
            saveBtn.attr('href', base64str);
            saveBtn.attr('download', 'save.woff');



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

        ttf2woffoptions.deflate = deflate;
        write();
    }
};

entry.init();