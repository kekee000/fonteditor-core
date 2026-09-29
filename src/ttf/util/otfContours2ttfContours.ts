/**
 * @file otf轮廓转ttf轮廓
 * @author mengke01(kekee000@gmail.com)
 */

import bezierCubic2Q2 from '../../math/bezierCubic2Q2';
import pathCeil from '../../graphics/pathCeil';
import {Contour, Point} from '../ttf-types';

/**
 * 转换轮廓
 *
 * @param otfContour otf轮廓
 * @return           ttf轮廓
 */
function transformContour(otfContour: Contour) {
    const contour = [];
    let prevPoint: Point;
    let curPoint: Point;
    let nextPoint: Point;
    let nextNextPoint: Point;

    contour.push(prevPoint = otfContour[0]);
    for (let i = 1, l = otfContour.length; i < l; i++) {
        curPoint = otfContour[i];

        if (curPoint.onCurve) {
            contour.push(curPoint);
            prevPoint = curPoint;
        }
        // 三次bezier曲线
        else {
            nextPoint = otfContour[i + 1];
            nextNextPoint = i === l - 2 ? otfContour[0] : otfContour[i + 2];
            const bezierArray = bezierCubic2Q2(prevPoint, curPoint, nextPoint, nextNextPoint);
            bezierArray[0][2].onCurve = true;
            contour.push(bezierArray[0][1]);
            contour.push(bezierArray[0][2]);

            // 第二个曲线
            if (bezierArray[1]) {
                bezierArray[1][2].onCurve = true;
                contour.push(bezierArray[1][1]);
                contour.push(bezierArray[1][2]);
            }

            prevPoint = nextNextPoint;
            i += 2;
        }
    }

    return pathCeil(contour);
}


/**
 * otf轮廓转ttf轮廓
 *
 * @param  otfContours otf轮廓数组
 * @return ttf轮廓
 */
export default function otfContours2ttfContours(otfContours: Contour[]) {
    if (!otfContours || !otfContours.length) {
        return otfContours;
    }
    const contours = [];
    for (let i = 0, l = otfContours.length; i < l; i++) {

        // 这里可能由于转换错误导致空轮廓，需要去除
        if (otfContours[i][0]) {
            contours.push(transformContour(otfContours[i]));
        }
    }

    return contours;
}
