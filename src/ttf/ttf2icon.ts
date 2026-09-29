/**
 * @file ttf转icon
 * @author mengke01(kekee000@gmail.com)
 */

import TTFReader from './ttfreader';
import error from './error';
import config from './data/default';
import {getSymbolId} from './ttf2symbol';
import {TTFObject} from './ttf-types';

export interface TTF2IconOptions {
    /** 字体相关的信息 */
    metadata?: string;
    /** icon 前缀 */
    iconPrefix?: string;
}

export interface IconInfo {
    code: string;
    codeName: string;
    name: string;
    id: string;
}

export interface IconObject {
    fontFamily: string;
    iconPrefix: string;
    glyfList: IconInfo[];
}

/**
 * listUnicode
 *
 * @param unicode unicode
 * @return unicode string
 */
function listUnicode(unicode: number[]) {
    return unicode.map((u) => '\\' + u.toString(16)).join(',');
}

/**
 * ttf数据结构转icon数据结构
 *
 * @param ttf ttfObject对象
 * @param options 选项
 * @return icon obj
 */
function ttfobject2icon(ttf: TTFObject, options: TTF2IconOptions = {}): IconObject {

    const glyfList: IconInfo[] = [];

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
 * @param ttfBuffer ttf缓冲数组或者ttfObject对象
 * @param options 选项
 *
 * @return icon object
 */
export default function ttf2icon(ttfBuffer: ArrayBuffer | TTFObject, options: TTF2IconOptions = {}): IconObject {
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
