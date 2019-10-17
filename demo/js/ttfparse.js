/**
 * @file ttfparse.js
 * @author mengke01
 * @date
 * @description
 * ttf解析函数入口
 */

import TTFReader from 'fonteditor-core/ttf/ttfreader';
import TTF from 'fonteditor-core/ttf/ttf';
import ajaxFile from 'fonteditor-core/common/ajaxFile';

function onUpFileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {

        let ttfReader = new TTFReader({
            hinting: true
            // subset: [65, 0x160, 0x161, 0x162]
        });
        let ttfData = ttfReader.read(e.target.result);
        console.log(ttfData);

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
            url: './test/tt0586m.ttf',
            onSuccess(binaryData) {
                let ttfReader = new TTFReader({
                    // hinting: true,
                    subset: [65, 0x160, 0x161, 0x162]
                });
                let ttfData = ttfReader.read(binaryData);
                console.log(ttfData);
            },
            onError() {
                console.error('error read file');
            }
        });


    }
};

entry.init();
