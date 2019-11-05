/**
 * @file svgimport.js
 * @author mengke01
 * @date
 * @description
 * svg转ttfobject
 */

import svg2ttfobject from 'fonteditor-core/ttf/svg2ttfobject';

let entry = {

    /**
     * 初始化
     */
    init() {

        $.ajax({
            url: './test/iconfont-chunvzuo.svg',
            dataType: 'text'
        }).done(function (data) {

            let ttfObject = svg2ttfobject(data);
            console.log(ttfObject);
        });

    }
};

entry.init();
