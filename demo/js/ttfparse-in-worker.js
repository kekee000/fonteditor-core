/**
 * @file ttfparse.js
 * @author mengke01
 * @date
 * @description
 * ttf解析函数入口
 */

import TTFReader from 'fonteditor-core/ttf/ttfreader';
import ajaxFile from 'fonteditor-core/common/ajaxFile';

const worker = new Worker("../js/worker.js");


function printResult(ttfData) {
    const result = `glyphs: ${ttfData.glyf.length};
ttfData keys:

- ${Object.keys(ttfData).join('\n- ')}

see detail in DevTools - console.
`
    $('#parse-result').val(result);
}


function onUpFileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        worker.postMessage({
            type: file.name.match(/(?<=\.)(ttf|svg|woff2?|eot|otf)$/)[1],
            binaryData: e.target.result
        });
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
        worker.onmessage = (e) => {
            const ttfData = e.data;
            printResult(ttfData);
        };

        let upFile = document.getElementById('upload-file');
        upFile.addEventListener('change', onUpFileChange);

        ajaxFile({
            type: 'binary',
            url: './test/tt0586m.ttf',
            onSuccess(binaryData) {
                worker.postMessage({
                    type: 'ttf',
                    binaryData
                });
            },
            onError() {
                console.error('error read file');
            }
        });


    }
};

entry.init();
