# fonteditor-core

**FontEditor core functions**

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

## Feature

Read and write sfnt font like ttf, woff, woff2, eot, svg, otf.

- sfnt parse
- read, write, transform fonts
  - ttf (read and write)
  - woff (read and write)
  - woff2 (read and write)
  - eot (read and write)
  - svg (read and write)
  - otf (only read and convert to ttf)
- ttf glyph adjust
- svg to glyph
- ESM compatibility for modern bundlers (Webpack, Rollup, Vite, Next.js, etc.)
- TypeScript support with type definitions

## Usage

```javascript
// read font file
import {createFont} from 'fonteditor-core';
import fs from 'fs';

const buffer = fs.readFileSync('font.ttf');
// read font data, support format:
// - for ttf, otf, woff, woff2, support ArrayBuffer, Buffer
// - for svg, support string or Document(parsed svg)
const font = createFont(buffer, {
    // support ttf, woff, woff2, eot, otf, svg
    type: 'ttf',
    // only read `a`, `b` glyphs
    subset: [65, 66],
    // read font hinting tables, default false
    hinting: true,
    // read font kerning tables, default false
    kerning: true,
    // transform ttf compound glyph to simple
    compound2simple: true,
    // inflate function for woff
    inflate: undefined,
    // for svg path
    combinePath: false,
});
const fontObject = font.get();
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
const buffer = font.write({
    // support ttf, woff, woff2, eot, svg
    type: 'woff',
    // save font hinting tables, default false
    hinting: false,
    // save font kerning tables, default false
    kerning: false,
    // write glyf data when simple glyph has no contours, default false
    writeZeroContoursGlyfData: false,
    // deflate function for woff, eg. pako.deflate
    deflate: undefined,
    // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
    support: {head: {}, hhea: {}}
});
fs.writeFileSync('font.woff', buffer);

// to base64 str
font.toBase64({
    // support ttf, woff, woff2, eot, svg
    type: 'ttf'
});

// optimize glyphs
font.optimize()

// compound2simple
font.compound2simple()

// sort glyphs
font.sort()

// find glyphs
const result = font.find({
  unicode: [65]
});

const result = font.find({
  filter: function (glyf) {
    return glyf.name === 'icon'
  }
});

// merge another font object
font.merge(font1, {
  scale: 1
});
```

### Modern ES Module Usage

This library supports both CommonJS and ES Modules. For detailed information on using with modern bundlers, please see [ESM_USAGE.md](./ESM_USAGE.md).

```javascript
// ESM import
import fonteditorCore, { createFont, woff2 } from 'fonteditor-core';

createFont(buffer, options);
```

### woff2

**Notice:** woff2 use wasm build of google woff2, before read and write `woff2`, we should first call `woff2.init()`.

```javascript
import {createFont, woff2} from 'fonteditor-core';

// in nodejs
woff2.init().then(() => {
    // read woff2
    const font =  createFont(buffer, {
      type: 'woff2'
    });
    // write woff2
    const buffer = font.write({type: 'woff2'});
});

// in browser
woff2.init('/assets/woff2.wasm').then(() => {
    // read woff2
    const font = createFont();
    // write woff2
    const arrayBuffer = font.write({type: 'woff2'});
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

Node.js:>= 12.0

Browser: Chrome, Safari

## Related

- [fonteditor](https://github.com/ecomfe/fonteditor)
- [fontmin](https://github.com/ecomfe/fontmin)
- [fonteditor online](https://kekee000.github.io/fonteditor/index.html)

## License

MIT © Fonteditor

[downloads-image]: http://img.shields.io/npm/dm/fonteditor-core.svg
[npm-url]: https://npmjs.org/package/fonteditor-core
[npm-image]: http://img.shields.io/npm/v/fonteditor-core.svg

[travis-url]: https://travis-ci.org/kekee000/fonteditor-core
[travis-image]: http://img.shields.io/travis/kekee000/fonteditor-core.svg
