/**
 * @file 主函数
 * @author mengke01(kekee000@gmail.com)
 */

import Font from './ttf/font';
import TTF from './ttf/ttf';
import TTFReader from './ttf/ttfreader';
import TTFWriter from './ttf/ttfwriter';
import ttf2eot from './ttf/ttf2eot';
import eot2ttf from './ttf/eot2ttf';
import ttf2woff from './ttf/ttf2woff';
import woff2ttf from './ttf/woff2ttf';
import ttf2svg from './ttf/ttf2svg';
import svg2ttfobject from './ttf/svg2ttfobject';
import Reader from './ttf/reader';
import Writer from './ttf/writer';
import OTFReader from './ttf/otfreader';
import otf2ttfobject from './ttf/otf2ttfobject';
import ttf2base64 from './ttf/ttf2base64';
import ttf2icon from './ttf/ttf2icon';
import ttftowoff2 from './ttf/ttftowoff2';
import woff2tottf from './ttf/woff2tottf';
import woff2 from '../woff2/index';

export {Font};
export {woff2};

const modules = {
    Font,
    TTF,
    TTFReader,
    TTFWriter,
    ttf2eot,
    eot2ttf,
    ttf2woff,
    woff2ttf,
    ttf2svg,
    svg2ttfobject,
    Reader,
    Writer,
    OTFReader,
    otf2ttfobject,
    ttf2base64,
    ttf2icon,
    ttftowoff2,
    woff2tottf,
    woff2
};

export default modules;

if (typeof exports !== 'undefined') {
    // eslint-disable-next-line import/no-commonjs
    module.exports = modules;
}
