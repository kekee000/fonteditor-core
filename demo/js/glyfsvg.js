/**
 * @file glyfsvg.js
 * @author mengke01
 * @date
 * @description
 * glyf 查看
 */

import TTFreader from 'fonteditor-core/ttf/ttfreader';
import TTF from 'fonteditor-core/ttf/ttf';
import ttf2base64 from 'fonteditor-core/ttf/ttf2base64';
import ajaxFile from 'fonteditor-core/common/ajaxFile';
import glyf2svg from 'fonteditor-core/ttf/util/glyf2svg';
import * as lang from 'fonteditor-core/common/lang';

import setFontface from './setFontface';


let ttf = null;

// 设置字体
function setFont(arrayBuffer) {
    let base64 = ttf2base64(arrayBuffer);
    setFontface('truetype', base64, 'font-face');
}


// 查看ttf glyf
function showTTFGlyf(ttfData) {

    ttf = new TTF(ttfData);
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

    $('#font-list li:nth-child(4)').click();
}

function showGlyf(charcode) {

    let tpl = ''
        + '<svg class="glyf">'
        + ' <g>'
        +   '<path class="path" d="M 0,0" />'
        +   '</g>'
        +  '</svg>';
    let svg = $(tpl);
    let glyf = lang.clone(ttf.getGlyfByCode(charcode));

    if (glyf.compound) {
        return;
    }

    // 调整大小
    let width =  glyf.xMax;
    let height =  glyf.yMax - glyf.yMin;
    let scale = 1;

    if (ttf.ttf.head.unitsPerEm > 512) {
        scale = 512 / ttf.ttf.head.unitsPerEm;
        width = width * scale;
        height = height * scale;
    }

    let path = glyf2svg(glyf, {
        scale
    });

    if (path) {
        svg.css({
            width,
            height
        });
        svg.attr('viewbox', '0 0 ' + width + ' ' + height);
        svg.find('.path').attr('d', path);
    }

    $('#svg-view').html(svg);
}


function onUpFileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        let binaryData = e.target.result;
        setFont(binaryData);
        let ttfReander = new TTFreader();
        let ttfData = ttfReander.read(binaryData);
        showTTFGlyf(ttfData);
    };

    reader.onerror = function (e) {
        console.error(e);
    };
    reader.readAsArrayBuffer(file);
}

let entry = {

    /**
     * 初始化
     */
    init() {
        let upFile = document.getElementById('upload-file');
        upFile.addEventListener('change', onUpFileChange);

        ajaxFile({
            type: 'binary',
            url: './test/baiduHealth.ttf',
            onSuccess(binaryData) {
                setFont(binaryData);

                let ttfReander = new TTFreader();
                let ttfData = ttfReander.read(binaryData);
                showTTFGlyf(ttfData);
            },
            onError() {
                console.error('error read file');
            }
        });


        $('#font-list').delegate('li', 'click', function (e) {
            $('#font-list li').removeClass('selected');
            $(this).addClass('selected');
            showGlyf(+$(this).attr('data-code'));
        });
    }
};

entry.init();
