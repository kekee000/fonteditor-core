/**
 * @file ttf2eot.js
 * @author mengke01
 * @date
 * @description
 * ttf2eot 转换
 */

import ajaxFile from 'fonteditor-core/common/ajaxFile';
import eot2ttf from 'fonteditor-core/ttf/eot2ttf';
import ttf2base64 from 'fonteditor-core/ttf/ttf2base64';
import TTFReader from 'fonteditor-core/ttf/ttfreader';
import TTF from 'fonteditor-core/ttf/ttf';

// 设置字体
function setFont(base64str) {
    let str = ''
        + '@font-face {'
        + 'font-family:\'truetype\';'
        + 'src:url('
        +   base64str
        + ') format(\'truetype\');'
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

function readeot() {
    ajaxFile({
        type: 'binary',
        url: './test/fonteditor.eot',
        onSuccess(buffer) {


            let ttfBuffer = eot2ttf(buffer);
            let ttfReader = new TTFReader();
            let ttfData = ttfReader.read(ttfBuffer);
            let base64str = ttf2base64(ttfBuffer);
            setFont(base64str);
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
        readeot();
    }
};

entry.init();
