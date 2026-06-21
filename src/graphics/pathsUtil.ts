/**
 * @file 路径组变化函数
 * @author mengke01(kekee000@gmail.com)
 */

import {computePath} from './computeBoundingBox';
import pathAdjust from './pathAdjust';
import pathRotate from './pathRotate';
import {Point} from './util';

/**
 * 翻转路径
 *
 * @param paths 路径数组
 * @param xScale x翻转
 * @param yScale y翻转
 * @return 变换后的路径
 */
function mirrorPaths(paths: Point[][], xScale: number, yScale: number) {
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
     * @param paths 路径数组
     * @param angle 弧度
     * @return 变换后的路径
     */
    rotate(paths: Point[][], angle: number) {
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
     * @param paths 路径数组
     * @param x x 方向缩放
     * @param y y 方向缩放
     * @return 变换后的路径
     */
    move(paths: Point[][], x: number, y: number) {
        const bound = computePath(...paths);
        paths.forEach(path => {
            pathAdjust(path, 1, 1, x - bound.x, y - bound.y);
        });

        return paths;
    },

    mirror(paths: Point[][]) {
        return mirrorPaths(paths, -1, 1);
    },

    flip(paths: Point[][]) {
        return mirrorPaths(paths, 1, -1);
    }
};
