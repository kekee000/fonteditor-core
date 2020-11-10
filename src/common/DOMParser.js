/**
 * @file DOM解析器，兼容node端和浏览器端
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable no-undef */
export default typeof window !== 'undefined' && window.DOMParser
    ? window.DOMParser
    : require('xmldom').DOMParser;
