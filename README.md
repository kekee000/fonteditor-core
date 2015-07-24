# fonteditor-core 

**font editor core functions**

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][npm-url]

## Feature

- sfnt parse
- read, write, transform fonts (ttf, woff, eot, svg, otf)  
- ttf glyph adjust
- svg to glyph

## Usage

```js
// read font file
var fs = require('fs');
var bufferToArrayBuffer = require('b3b').bufferToArrayBuffer;
var fontBuffer = fs.readFileSync('font.ttf');
var fontArrayBuffer = bufferToArrayBuffer(fontBuffer);

// read font data
var TTFReader = require('fonteditor-core').TTFReader;
var ttfReader = new TTFReader({ hinting: true });
var fontData = ttfReader.read(fontArrayBuffer);

console.log(Object.keys(fontData));
/* => [ 'version',
  'numTables',
  'searchRenge',
  'entrySelector',
  'rengeShift',
  'head',
  'maxp',
  'glyf',
  'cmap',
  'name',
  'hhea',
  'post',
  'OS/2',
  'fpgm',
  'cvt',
  'prep'
]
*/

```

## Demo

```
edp webserver
```

open <http://127.0.0.1:9999/demo>

## Related

- [fonteditor](https://github.com/ecomfe/fonteditor)
- [fontmin](https://github.com/ecomfe/fontmin)
- [fonteditor online](http://font.baidu.com/)

## License

MIT © Fonteditor

[downloads-image]: http://img.shields.io/npm/dm/fonteditor-core.svg
[npm-url]: https://npmjs.org/package/fonteditor-core
[npm-image]: http://img.shields.io/npm/v/fonteditor-core.svg

[travis-url]: https://travis-ci.org/kekee000/fonteditor-core
[travis-image]: http://img.shields.io/travis/kekee000/fonteditor-core.svg
