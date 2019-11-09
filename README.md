# fonteditor-core

**FontEditor core functions**

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][npm-url]

## Feature

- sfnt parse
- read, write, transform fonts
  - ttf (read and write)
  - woff (read and write)
  - woff2 (read and write)
  - eot (read and write)
  - svg (read and write)
  - otf (only read)
- ttf glyph adjust
- svg to glyph

## Usage

```js

// read font file
const Font = require('fonteditor-core').Font;
const fs = require('fs');

let buffer = fs.readFileSync('font.ttf');
// read font data
let font = Font.create(buffer, {
  type: 'ttf', // support ttf, woff, woff2, eot, otf, svg
  subset: [65, 66], // only read `a`, `b` glyf
  hinting: true, // save font hinting
  compound2simple: true, // transform ttf compound glyf to simple
  inflate: null, // inflate function for woff
  combinePath: false, // for svg path
});
let fontObject = font.get();
console.log(Object.keys(fontObject));

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

// write font file
let buffer = font.write({
  type: 'woff', // support ttf, woff, woff2, eot, svg
  hinting: true, // save font hinting
  deflate: null, // deflate function for woff
  support: {head: {}, hhea: {}} // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
});
// fs.writeFileSync('font.woff', buffer);

// to base64 str
font.toBase64({
  type: 'ttf' // support ttf, woff, woff2, eot, svg
});

// optimize glyf
font.optimize()

// compound2simple
font.compound2simple()

// sort glyf
font.sort()

// find glyf
let result = font.find({
  unicode: [65]
});
let result = font.find({
  filter: function (glyf) {
    return glyf.name == 'icon'
  }
});

// merge another font object
font.merge(font1, {
  scale: 1
});

```

### woff2

Notice: woff2 use wasm build of google woff2, before read and write `woff2`,
you should first call `woff2.init()`.

```javascript
const Font = require('fonteditor-core').Font;
const woff2 = require('fonteditor-core').woff2;

woff2.init().then(() => {
  // read
  let font = Font.create(buffer, {
    type: 'woff2'
  });
  // write
  font.write({type: 'woff2'});
});

```



## Demo

```
npm run dev
```

## build

```
npm run build
```

## test

```
npm run test
```

## support

Node.js:>= 8.0

Browser: Chrome, Safari

## Related

- [fonteditor](https://github.com/ecomfe/fonteditor)
- [fontmin](https://github.com/ecomfe/fontmin)
- [fonteditor online](http://fontstore.baidu.com/editor)

## License

MIT © Fonteditor

[downloads-image]: http://img.shields.io/npm/dm/fonteditor-core.svg
[npm-url]: https://npmjs.org/package/fonteditor-core
[npm-image]: http://img.shields.io/npm/v/fonteditor-core.svg

[travis-url]: https://travis-ci.org/kekee000/fonteditor-core
[travis-image]: http://img.shields.io/travis/kekee000/fonteditor-core.svg
