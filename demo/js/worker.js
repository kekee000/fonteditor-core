/**
 * parse in web worker
 */

import TTFReader from 'fonteditor-core/ttf/ttfreader';
import svg2ttfobject from 'fonteditor-core/ttf/svg2ttfobject';

onmessage = (e) => {
    const {type, binaryData} = e.data;
    let ttfData;
    if (type === 'svg') {
        var decoder = new TextDecoder("utf-8");
        ttfData = svg2ttfobject(decoder.decode(binaryData));
    }
    else {
        let ttfReader = new TTFReader({
            hinting: true
        });
        ttfData = ttfReader.read(binaryData);
    }
    console.log('worker parsed', type, ttfData);
    postMessage(ttfData);
};