/**
 * @file ttf转icon
 * @author mengke01(kekee000@gmail.com)
 */

import TTFReader from './ttfreader';
import error from './error';
import config from './data/default';
import {getSymbolId} from './ttf2symbol';

/**
 * listUnicode
 *
 * @param  {Array} unicode unicode
 * @return {string}         unicode string
 */
function listUnicode(unicode) {
    return unicode.map((u) => '\\' + u.toString(16)).join(',');
}

/**
 * ttf数据结构转icon数据结构
 *
 * @param {ttfObject} ttf ttfObject对象
 * @param {Object} options 选项
 * @param {Object} options.metadata 字体相关的信息
 * @param {Object} options.iconPrefix icon 前缀
 * @return {Object} icon obj
 */
function ttfobject2icon(ttf, options = {}) {

    const glyfList = [];

    // glyf 信息
    const filtered = ttf.glyf.filter((g) => g.name !== '.notdef'
            && g.name !== '.null'
            && g.name !== 'nonmarkingreturn'
            && g.unicode && g.unicode.length);

    filtered.forEach((g, i) => {
        glyfList.push({
            code: '&#x' + g.unicode[0].toString(16) + ';',
            codeName: listUnicode(g.unicode),
            name: g.name,
            id: getSymbolId(g, i)
        });
    });

    return {
        fontFamily: ttf.name.fontFamily || config.name.fontFamily,
        iconPrefix: options.iconPrefix || 'icon',
        glyfList
    };

}


/**
 * ttf格式转换成icon
 *
 * @param {ArrayBuffer|ttfObject} ttfBuffer ttf缓冲数组或者ttfObject对象
 * @param {Object} options 选项
 * @param {Object} options.metadata 字体相关的信息
 *
 * @return {Object} icon object
 */
export default function ttf2icon(ttfBuffer, options = {}) {
    // 读取ttf二进制流
    if (ttfBuffer instanceof ArrayBuffer) {
        const reader = new TTFReader();
        const ttfObject = reader.read(ttfBuffer);
        reader.dispose();

        return ttfobject2icon(ttfObject, options);
    }
    // 读取ttfObject
    else if (ttfBuffer.version && ttfBuffer.glyf) {

        return ttfobject2icon(ttfBuffer, options);
    }

    error.raise(10101);
}
