/**
 * @file DOM解析器，兼容node端和浏览器端
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable no-undef, fecs-no-require */
export default typeof exports !== 'undefined'
    ? require('xmldom').DOMParser
    : window.DOMParser;
