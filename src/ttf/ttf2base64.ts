/**
 * @file ttf数组转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

import bytes2base64 from './util/bytes2base64';

/**
 * ttf数组转base64编码
 *
 * @param arrayBuffer ArrayBuffer对象
 * @return base64编码
 */
export default function ttf2base64(arrayBuffer: ArrayBuffer) {
    return 'data:font/ttf;charset=utf-8;base64,' + bytes2base64(arrayBuffer);
}
