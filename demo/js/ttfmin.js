/**
 * @file ttf字体缩减示例
 * @author mengke01(kekee000@gmail.com)
 */

import TTFReader from 'fonteditor-core/ttf/ttfreader';
import TTFWriter from 'fonteditor-core/ttf/ttfwriter';
import ttf2base64 from 'fonteditor-core/ttf/ttf2base64';
import TTF from 'fonteditor-core/ttf/ttf';
import * as lang from 'fonteditor-core/common/lang';
import string from 'fonteditor-core/common/string';

let curttfData = null;


function onUpFileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        let ttfReader = new TTFReader({
            hinting: true,
            kerning: true,
        });
        curttfData = ttfReader.read(e.target.result);
        console.log(curttfData);
        ttfmin();
    };

    reader.onerror = function (e) {
        console.error(e);
    };

    reader.readAsArrayBuffer(file);
}


function setFont(data, dom) {
    let tpl = '@font-face {'
        + 'font-family: \'${family}\';'
        + 'src: url(${data}) format(\'truetype\');}';
    $(dom).get(0).innerHTML = string.format(tpl, data);
}


function ttfmin() {

    if (!curttfData) {
        return;
    }

    let text = $('#text').val();
    let ttf = new TTF(lang.clone(curttfData));

    let indexList = ttf.findGlyf({
        unicode: text.split('').map(function (u) {
            return u.charCodeAt(0);
        })
    });

    if (indexList.length) {
        let glyfList = ttf.getGlyf(indexList);
        glyfList.unshift(ttf.getGlyfByIndex(0));
        ttf.get().glyf = glyfList;
    }
    else {
        ttf.get().glyf = [ttf.getGlyfByIndex(0)];
    }

    let family = 'font-with-hitting';
    ttf.get().name.fontFamily = family;
    let writer = new TTFWriter({
        hinting: true,
        kerning: true,
    });
    let buffer = writer.write(ttf.get());
    setFont({
        family: family,
        data: ttf2base64(buffer)
    }, '#' + family);



    family = 'font-without-hitting';
    ttf.get().name.fontFamily = family;
    writer = new TTFWriter({
        hinting: false
    });
    buffer = writer.write(ttf.get());
    setFont({
        family: family,
        data: ttf2base64(buffer)
    }, '#' + family);

    $('.ttf-text').html(text);
}


let entry = {

    /**
     * 初始化
     */
    init() {
        document.getElementById('upload-file').addEventListener('change', onUpFileChange);
        document.getElementById('text').addEventListener('change', ttfmin);
        document.getElementById('font-size').addEventListener('change', function (e) {
            $('.ttf-text').css({
                fontSize: e.target.value + 'px'
            });
        });
    }
};

entry.init();
