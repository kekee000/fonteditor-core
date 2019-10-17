/**
 * @file setFontface.js
 * @author mengke01
 * @date
 * @description
 * 设置fontface
 */


/**
 * 设置fontface的ttf字体
 *
 * @param {name} name 字体名
 * @param {string} ttfBase64 base64字体
 * @param {string} styleId domId
 */
export default function setFontface(name, ttfBase64, styleId) {
    let str = ''
        + '@font-face {'
        + 'font-family:\'' + name + '\';'
        + 'src:url('
        + ttfBase64
        + ') format(\'truetype\');'
        + '}';
    document.getElementById(styleId).innerHTML = str;
}
