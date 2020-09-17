/**
 * @file 路径组变化函数
 * @author mengke01(kekee000@gmail.com)
 */

import {computePath} from './computeBoundingBox';
import pathAdjust from './pathAdjust';
import pathRotate from './pathRotate';

/**
 * 翻转路径
 *
 * @param {Array} paths 路径数组
 * @param {number} xScale x翻转
 * @param {number} yScale y翻转
 * @return {Array} 变换后的路径
 */
function mirrorPaths(paths, xScale, yScale) {
    const {x, y, width, height} = computePath(...paths);

    if (xScale === -1) {
        paths.forEach(p => {
            pathAdjust(p, -1, 1, -x, 0);
            pathAdjust(p, 1, 1, x + width, 0);
            p.reverse();
        });

    }

    if (yScale === -1) {
        paths.forEach(p => {
            pathAdjust(p, 1, -1, 0, -y);
            pathAdjust(p, 1, 1, 0, y + height);
            p.reverse();
        });
    }

    return paths;
}



export default {

    /**
     * 旋转路径
     *
     * @param {Array} paths 路径数组
     * @param {number} angle 弧度
     * @return {Array} 变换后的路径
     */
    rotate(paths, angle) {
        if (!angle) {
            return paths;
        }

        const bound = computePath(...paths);

        const cx = bound.x + (bound.width) / 2;
        const cy = bound.y + (bound.height) / 2;

        paths.forEach(p => {
            pathRotate(p, angle, cx, cy);
        });

        return paths;
    },

    /**
     * 路径组变换
     *
     * @param {Array} paths 路径数组
     * @param {number} x x 方向缩放
     * @param {number} y y 方向缩放
     * @return {Array} 变换后的路径
     */
    move(paths, x, y) {
        const bound = computePath(...paths);
        paths.forEach(path => {
            pathAdjust(path, 1, 1, x - bound.x, y - bound.y);
        });

        return paths;
    },

    mirror(paths) {
        return mirrorPaths(paths, -1, 1);
    },

    flip(paths) {
        return mirrorPaths(paths, 1, -1);
    }
};
