/**
 * @file DOM解析器，兼容node端和浏览器端
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable no-undef */
const browserDOMParser = typeof window !== 'undefined' && window.DOMParser
    ? window.DOMParser
    : null;

let cachedNodeDOMParser;
let hasResolvedNodeDOMParser = false;

export function getDOMParser() {
    if (browserDOMParser) {
        return browserDOMParser;
    }

    if (!hasResolvedNodeDOMParser) {
        hasResolvedNodeDOMParser = true;

        if (typeof require === 'function') {
            try {
                cachedNodeDOMParser = require('@xmldom/xmldom').DOMParser;
            }
            catch (exp) {
                cachedNodeDOMParser = null;
            }
        }
        else {
            cachedNodeDOMParser = null;
        }
    }

    return cachedNodeDOMParser;
}

export default browserDOMParser;
