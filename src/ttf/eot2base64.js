/**
 * @file eot数组转base64编码
 * @author mengke01(kekee000@gmail.com)
 */
import bytes2base64 from './util/bytes2base64';

/**
 * eot数组转base64编码
 *
 * @param {Array} arrayBuffer ArrayBuffer对象
 * @return {string} base64编码
 */
export default function eot2base64(arrayBuffer) {
    return 'data:font/eot;charset=utf-8;base64,' + bytes2base64(arrayBuffer);
}
