/**
 * @file svg节点转字形轮廓
 * @author mengke01(kekee000@gmail.com)
 */

import path2contours from './path2contours';
import oval2contour from './oval2contour';
import polygon2contour from './polygon2contour';
import rect2contour from './rect2contour';
import parseTransform from './parseTransform';
import contoursTransform from './contoursTransform';

// 支持的解析器集合
const support = {

    path: {
        parse: path2contours, // 解析器
        params: ['d'], // 参数列表
        contours: true // 是否是多个轮廓
    },

    circle: {
        parse: oval2contour,
        params: ['cx', 'cy', 'r']
    },

    ellipse: {
        parse: oval2contour,
        params: ['cx', 'cy', 'rx', 'ry']
    },

    rect: {
        parse: rect2contour,
        params: ['x', 'y', 'width', 'height']
    },

    polygon: {
        parse: polygon2contour,
        params: ['points']
    },

    polyline: {
        parse: polygon2contour,
        params: ['points']
    }
};

/**
 * svg节点转字形轮廓
 *
 * @param {Array} xmlNodes xml节点集合
 * @return {Array|false} 轮廓数组
 */
export default function svgnode2contours(xmlNodes) {
    let i;
    let length;
    let j;
    let jlength;
    let segment; // 当前指令
    let parsedSegments = []; // 解析后的指令

    if (xmlNodes.length) {
        for (i = 0, length = xmlNodes.length; i < length; i++) {
            let node = xmlNodes[i];
            let name = node.tagName;
            if (support[name]) {
                let supportParams = support[name].params;
                let params = [];
                for (j = 0, jlength = supportParams.length; j < jlength; j++) {
                    params.push(node.getAttribute(supportParams[j]));
                }

                segment = {
                    name: name,
                    params: params,
                    transform: parseTransform(node.getAttribute('transform'))
                };

                if (node.parentNode) {
                    let curNode = node.parentNode;
                    let transforms = segment.transform || [];
                    let transAttr;
                    let iterator = function (t) {
                        transforms.unshift(t);
                    };
                    while (curNode !== null && curNode.tagName !== 'svg') {
                        transAttr = curNode.getAttribute('transform');
                        if (transAttr) {
                            parseTransform(transAttr).reverse().forEach(iterator);
                        }
                        curNode = curNode.parentNode;
                    }

                    segment.transform = transforms.length ? transforms : null;
                }
                parsedSegments.push(segment);
            }
        }
    }

    if (parsedSegments.length) {
        let result = [];
        for (i = 0, length = parsedSegments.length; i < length; i++) {
            segment = parsedSegments[i];
            let parser = support[segment.name];
            let contour = parser.parse.apply(null, segment.params);
            if (contour && contour.length) {
                let contours = parser.contours ? contour : [contour];

                // 如果有变换则应用变换规则
                if (segment.transform) {
                    contours = contoursTransform(contours, segment.transform);
                }

                for (j = 0, jlength = contours.length; j < jlength; j++) {
                    result.push(contours[j]);
                }
            }
        }
        return result;
    }

    return false;
}
