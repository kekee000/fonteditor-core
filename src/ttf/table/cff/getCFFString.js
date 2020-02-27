/**
 * @file 获取cff字符串
 * @author mengke01(kekee000@gmail.com)
 */

import cffStandardStrings from './cffStandardStrings';

/**
 * 根据索引获取cff字符串
 *
 * @param  {Object} strings 标准cff字符串索引
 * @param  {number} index   索引号
 * @return {number}         字符串索引
 */
export default function getCFFString(strings, index) {
    if (index <= 390) {
        index = cffStandardStrings[index];
    }
    // Strings below index 392 are standard CFF strings and are not encoded in the font.
    else {
        index = strings[index - 391];
    }

    return index;
}
