/**
 * @file getArc.js
 * @author mengke01
 * @date
 * @description
 * svg转ttfobject
 */

import contour2svg from 'fonteditor-core/ttf/util/contour2svg';
import getArc from 'fonteditor-core/graphics/getArc';

const entry = {

    /**
     * 初始化
     */
    init() {

        // 300,200 A150,50 0 1,0 450,50
        let path = getArc(150, 150, 0, 1, 0, {x: 275, y:125}, {x:125, y:150});
        console.log(path[0]);
        $('#path').attr('d', contour2svg(path));
    }
};

entry.init();
