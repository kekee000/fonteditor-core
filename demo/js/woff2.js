/**
 * @file woff2.js
 * @author mengke01
 * @date
 * @description
 * ttf解析函数入口
 */

import TTFReader from 'fonteditor-core/ttf/ttfreader';
import ajaxFile from 'fonteditor-core/common/ajaxFile';
import {ttftowoff2async} from 'fonteditor-core/ttf/ttftowoff2';
import {woff2tottfasync} from 'fonteditor-core/ttf/woff2tottf';

function onUpFileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        transcode(e.target.result);
    };

    reader.onerror = function (e) {
        console.error(e);
    };

    reader.readAsArrayBuffer(file);
}

function transcode(binaryData) {
    console.log('ttfsize', binaryData.byteLength);
    ttftowoff2async(binaryData, {wasmUrl: '../woff2/woff2.wasm'})
        .then(buffer => {
            console.log('encode woff2size', buffer.byteLength);
            return woff2tottfasync(buffer, {wasmUrl: '../woff2/woff2.wasm'});
        })
        .then(buffer => {
            console.log('decode ttfsize', binaryData.byteLength);
            let ttfReader = new TTFReader({
                // hinting: true,
                subset: [65, 0x160, 0x161, 0x162]
            });
            let ttfData = ttfReader.read(buffer);
            console.log(ttfData);
        });        
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
            url: './test/tt0586m.ttf',
            onSuccess(binaryData) {
                transcode(binaryData);
            },
            onError() {
                console.error('error read file');
            }
        });


    }
};

entry.init();
