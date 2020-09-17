/**
 * @file otf格式转ttf格式对象
 * @author mengke01(kekee000@gmail.com)
 */

import error from './error';
import OTFReader from './otfreader';
import otfContours2ttfContours from './util/otfContours2ttfContours';
import {computePathBox} from '../graphics/computeBoundingBox';

/**
 * otf格式转ttf格式对象
 *
 * @param  {ArrayBuffer|otfObject} otfBuffer 原始数据或者解析后的otf数据
 * @param  {Object} options   参数
 * @return {Object}          ttfObject对象
 */
export default function otf2ttfobject(otfBuffer, options) {
    let otfObject;
    if (otfBuffer instanceof ArrayBuffer) {
        const otfReader = new OTFReader(options);
        otfObject = otfReader.read(otfBuffer);
        otfReader.dispose();
    }
    else if (otfBuffer.head && otfBuffer.glyf && otfBuffer.cmap) {
        otfObject = otfBuffer;
    }
    else {
        error.raise(10111);
    }

    // 转换otf轮廓
    otfObject.glyf.forEach((g) => {
        g.contours = otfContours2ttfContours(g.contours);
        const box = computePathBox(...g.contours);
        if (box) {
            g.xMin = box.x;
            g.xMax = box.x + box.width;
            g.yMin = box.y;
            g.yMax = box.y + box.height;
            g.leftSideBearing = g.xMin;
        }
        else {
            g.xMin = 0;
            g.xMax = 0;
            g.yMin = 0;
            g.yMax = 0;
            g.leftSideBearing = 0;
        }
    });

    otfObject.version = 0x1;

    // 修改maxp相关配置
    otfObject.maxp.version = 1.0;
    otfObject.maxp.maxZones = otfObject.maxp.maxTwilightPoints ? 2 : 1;

    delete otfObject.CFF;
    delete otfObject.VORG;

    return otfObject;
}
