/**
 * @file glyf.js
 * @author mengke01
 * @date
 * @description
 * glyf canvas 绘制
 */

import TTFReader from 'fonteditor-core/ttf/ttfreader';
import TTF from 'fonteditor-core/ttf/ttf';
import ttf2base64 from 'fonteditor-core/ttf/ttf2base64';
import ajaxFile from 'fonteditor-core/common/ajaxFile';
import * as lang from 'fonteditor-core/common/lang';

import setFontface from './setFontface';
import glyf2canvas from './glyf2canvas';

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

    let glyf = lang.clone(ttf.getGlyfByCode(charcode));
    if (glyf.compound) {
        glyf.glyfs.forEach(g => {
            g.glyf = ttf.getGlyfByIndex(g.glyphIndex);
        });
    }

    let canvas = $('#glyf-canvas').get(0);
    let ctx = canvas.getContext('2d');

    // 调整大小
    let width =  glyf.xMax - glyf.xMin;
    let height =  glyf.yMax - glyf.yMin;
    let scale = 1;
    if (ttf.ttf.head.unitsPerEm > 512) {
        scale = 512 / ttf.ttf.head.unitsPerEm;
        width = width * scale;
        height = height * scale;
    }

    ctx.clearRect(0, 0, 600, 600);

    glyf2canvas(glyf, ctx, {
        stroke: 0,
        scale: scale,
        strokeStyle: 'green',
        fillStyle: 'green'
    });
}


function onUpFileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        let binaryData = e.target.result;
        setFont(binaryData);

        let ttfReander = new TTFReader();
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

                let ttfReander = new TTFReader();
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
