/**
 * @file 路径相关的函数集合
 * @author mengke01(kekee000@gmail.com)
 */

import {Point, getPointHash} from './util';

/**
 * 对路径进行插值，补全省略的点
 *
 * @param path 路径
 * @return 路径
 */
export function interpolate(path: Point[]) {
    const newPath = [];
    for (let i = 0, l = path.length; i < l; i++) {
        const next = i === l - 1 ? 0 : i + 1;
        newPath.push(path[i]);
        // 插值
        if (!path[i].onCurve && !path[next].onCurve) {
            newPath.push({
                x: (path[i].x + path[next].x) / 2,
                y: (path[i].y + path[next].y) / 2,
                onCurve: true
            });
        }
    }

    return newPath;
}


/**
 * 去除路径中的插值点
 *
 * @param path 路径
 * @return 路径
 */
export function deInterpolate(path: Point[]) {
    const newPath = [];

    for (let i = 0, l = path.length; i < l; i++) {
        const next = i === l - 1 ? 0 : i + 1;
        const prev = i === 0 ? l - 1 : i - 1;
        // 插值
        if (
            !path[prev].onCurve && path[i].onCurve && !path[next].onCurve
            && Math.abs(2 * path[i].x - path[prev].x - path[next].x) < 0.001
            && Math.abs(2 * path[i].y - path[prev].y - path[next].y) < 0.001
        ) {
            continue;
        }

        newPath.push(path[i]);
    }

    return newPath;
}


/**
 * 判断路径的方向是否顺时针
 *
 * see:
 * http://debian.fmi.uni-sofia.bg/~sergei/cgsr/docs/clockwise.htm
 *
 * @param path 路径
 * @return {number} 0 无方向 1 clockwise, -1 counter clockwise
 */
export function isClockWise(path: Point[]) {

    if (path.length < 3) {
        return 0;
    }

    let zCount = 0;
    for (let i = 0, l = path.length; i < l; i++) {
        const cur = path[i];
        const prev = i === 0 ? path[l - 1] : path[i - 1];
        const next = i === l - 1 ? path[0] : path[i + 1];
        const z = (cur.x - prev.x) * (next.y - cur.y)
            - (cur.y - prev.y) * (next.x - cur.x);

        if (z < 0) {
            zCount--;
        }
        else if (z > 0) {
            zCount++;
        }
    }

    return zCount === 0
        ? 0
        : zCount < 0 ? 1 : -1;
}

/**
 * 获取路径哈希
 *
 * @param path 路径数组
 * @return {number} 哈希值
 */
export function getPathHash(path: Point[]) {
    let hash = 0;
    const seed = 131;

    path.forEach(p => {
        hash = 0x7FFFFFFF & (hash * seed + getPointHash(p) + (p.onCurve ? 1 : 0));
    });

    return hash;
}


/**
 * 移除重复点
 *
 * @param points 点集合
 * @return 移除后点集合
 */
export function removeOverlapPoints(points: Point[]) {
    const hash = {};
    const ret = [];
    for (let i = 0, l = points.length; i < l; i++) {
        const hashcode = points[i].x * 31 + points[i].y;
        if (!hash[hashcode]) {
            ret.push(points[i]);
            hash[hashcode] = 1;
        }
    }
    return ret;
}


interface LinkPoint extends Point {
    index: number;
    next: LinkPoint;
    prev: LinkPoint;
}

/**
 * 对path进行双向链表连接
 *
 * @param path 轮廓数组
 * @return path
 */
export function makeLink(path: LinkPoint[]) {
    for (let i = 0, l = path.length; i < l; i++) {
        const cur = path[i];
        const prev = i === 0 ? path[l - 1] : path[i - 1];
        const next = i === l - 1 ? path[0] : path[i + 1];
        cur.index = i;
        cur.next = next;
        cur.prev = prev;
    }

    return path;
}

/**
 * 对path进行缩放
 *
 * @param path 轮廓数组
 * @param ratio 缩放大小
 *
 * @return path
 */
export function scale(path: Point[], ratio: number) {
    for (let i = 0, l = path.length; i < l; i++) {
        const cur = path[i];
        cur.x *= ratio;
        cur.y *= ratio;
    }

    return path;
}


export function clone(path: Point[]) {
    return path ? path.map(p => {
        const newP: Point = {
            x: p.x,
            y: p.y
        };

        if (p.onCurve) {
            newP.onCurve = true;
        }

        return newP;
    }) : path;
}
