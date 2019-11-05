/**
 * @file woff2数组转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

import bytes2base64 from './util/bytes2base64';

/**
 * woff数组转base64编码
 *
 * @param {Array} arrayBuffer ArrayBuffer对象
 * @return {string} base64编码
 */
export default function woff2tobase64(arrayBuffer) {
    return 'data:font/woff2;charset=utf-8;base64,' + bytes2base64(arrayBuffer);
}
