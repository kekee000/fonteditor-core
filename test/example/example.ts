/* eslint-disable no-unused-vars */
import utils, {Font, woff2} from 'fonteditor-core';
import fs from 'fs';

const baseDir = __dirname;

const buffer = fs.readFileSync(`${baseDir}/../data/wingdings3.ttf`);
// read font data, support ArrayBuffer | Buffer | string
const font = Font.create(buffer, {
    // support ttf, woff, woff2, eot, otf, svg
    type: 'ttf',
    // only read 0x21, 0x22 glyphs
    subset: [0x21, 0x22],
    // save font hinting
    hinting: true,
    // transform ttf compound glyph to simple
    compound2simple: true,
    // inflate function for woff
    inflate: undefined,
    // for svg path
    combinePath: false,
});
const fontObject = font.get();
console.log(Object.keys(fontObject));


fs.writeFileSync(`${baseDir}/output/font.eot`, utils.toBuffer(utils.ttf2eot(utils.toArrayBuffer(buffer))));
{
    woff2.init().then(() => {
        const font = Font.create(buffer, {
            type: 'ttf'
        });
        // write font file
        const out = font.write({
            type: 'woff2',
            toBuffer: true,
            writeZeroContoursGlyfData: true,
        });
        fs.writeFileSync(`${baseDir}/output/font.woff`, out);
    });
}

{
    // write font file
    const buffer = font.write({
        // support ttf, woff, woff2, eot, svg
        type: 'woff',
        // save font hinting
        hinting: true,
        // deflate function for woff, eg. pako.deflate
        deflate: undefined,
        // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
        support: { head: {}, hhea: {} },
        toBuffer: true,
    });
    fs.writeFileSync(`${baseDir}/output/font.woff`, buffer);
}

{
    // write font file
    const svg = font.write({
        // support ttf, woff, woff2, eot, svg
        type: 'svg',
        // save font hinting
        hinting: true,
        // deflate function for woff, eg. pako.deflate
        deflate: undefined,
        // for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
        support: { head: {}, hhea: {} },
    });
    fs.writeFileSync(`${baseDir}/output/font.svg`, svg);
}

{
    // to base64 str
    const base64 = font.toBase64({
        // support ttf, woff, woff2, eot, svg
        type: 'ttf'
    });
    console.log(base64);
}

// optimize glyphs
font.optimize();

// compound2simple
font.compound2simple();

// sort glyphs
font.sort();

{
    // find glyphs
    const result = font.find({
        unicode: [0x21]
    });
    console.log(result);
}
{
    const result = font.find({
        filter: function (glyf) {
            return glyf.name === 'exclam';
        }
    });
    console.log(result);
}
{
    const font1 = Font.create();
    // merge another font object
    font.merge(font1, {
        scale: 1
    });
}
