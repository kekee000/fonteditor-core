/**
 * @file glyf.js
 * @author mengke01
 * @date
 * @description
 * glyf canvas 绘制
 */
import OTFReader from 'fonteditor-core/ttf/otfreader';
import TTF from 'fonteditor-core/ttf/ttf';
import otf2base64 from 'fonteditor-core/ttf/otf2base64';
import ajaxFile from 'fonteditor-core/common/ajaxFile';
import * as lang from 'fonteditor-core/common/lang';

import otfGlyf2Canvas from './otfGlyf2Canvas';
import setFontface from './setFontface';

let ttf = null;

// 设置字体
function setFont(arrayBuffer) {
    let base64 = otf2base64(arrayBuffer);
    setFontface('truetype', base64, 'font-face');
}

// 查看ttf glyf
function showOTFGlyf(otfData) {
    ttf = new TTF(otfData);
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

    let canvas = $('#glyf-canvas').get(0);
    let ctx = canvas.getContext('2d');

    // 调整大小
    ctx.clearRect(0, 0, 600, 600);

    otfGlyf2Canvas(glyf, ctx, {
        stroke: 0,
        scale: 600 / ttf.ttf.head.unitsPerEm,
        height: ttf.ttf.head.unitsPerEm + ttf.ttf.hhea.descent,
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

        let otfReader = new OTFReader({
            // subset: [0x31, 0x32, 0x33]
        });
        let data = otfReader.read(binaryData);
        console.log(data);
        showOTFGlyf(data);
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
            url: './test/BalladeContour.otf',
            onSuccess(binaryData) {
                setFont(binaryData);

                let otfReader = new OTFReader({
                    // subset: [0x31, 0x32, 0x33]
                });
                let data = otfReader.read(binaryData);
                console.log(data);
                showOTFGlyf(data);
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
