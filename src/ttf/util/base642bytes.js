/**
 * @file base64字符串转数组
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * base64字符串转数组
 *
 * @param  {string} base64 base64字符串
 * @return {Array}  数组
 */
export default function base642bytes(base64) {
    const str = atob(base64);
    const result = [];
    for (let i = 0, l = str.length; i < l; i++) {
        result.push(str[i].charCodeAt(0));
    }
    return result;
}
