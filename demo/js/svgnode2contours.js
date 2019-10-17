/**
 * @file svgnode2contours.js
 * @author mengke01
 * @date
 * @description
 * svg转ttfobject
 */

import ajaxFile from 'fonteditor-core/common/ajaxFile';
import svgnode2contours from 'fonteditor-core/ttf/svg/svgnode2contours';
import contours2svg from 'fonteditor-core/ttf/util/contours2svg';

let entry = {

    /**
     * 初始化
     */
    init() {

        ajaxFile({
            type: 'xml',
            url: './test/svgnodes.svg',
            onSuccess(xml) {

                let contours = svgnode2contours(xml.getElementsByTagName('*'));
                let path = contours2svg(contours);

                $('#path').attr('d', path);
                $('#origin').html(xml.documentElement.outerHTML);
            },
            onError() {
                console.error('error read file');
            }
        });
    }
};

entry.init();
