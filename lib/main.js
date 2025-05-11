"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Font", {
  enumerable: true,
  get: function get() {
    return _font.Font;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "woff2", {
  enumerable: true,
  get: function get() {
    return _index.default;
  }
});
var _font = require("./ttf/font");
var _ttf = _interopRequireDefault(require("./ttf/ttf"));
var _ttfreader = _interopRequireDefault(require("./ttf/ttfreader"));
var _ttfwriter = _interopRequireDefault(require("./ttf/ttfwriter"));
var _ttf2eot = _interopRequireDefault(require("./ttf/ttf2eot"));
var _eot2ttf = _interopRequireDefault(require("./ttf/eot2ttf"));
var _ttf2woff = _interopRequireDefault(require("./ttf/ttf2woff"));
var _woff2ttf = _interopRequireDefault(require("./ttf/woff2ttf"));
var _ttf2svg = _interopRequireDefault(require("./ttf/ttf2svg"));
var _svg2ttfobject = _interopRequireDefault(require("./ttf/svg2ttfobject"));
var _reader = _interopRequireDefault(require("./ttf/reader"));
var _writer = _interopRequireDefault(require("./ttf/writer"));
var _otfreader = _interopRequireDefault(require("./ttf/otfreader"));
var _otf2ttfobject = _interopRequireDefault(require("./ttf/otf2ttfobject"));
var _ttf2base = _interopRequireDefault(require("./ttf/ttf2base64"));
var _ttf2icon = _interopRequireDefault(require("./ttf/ttf2icon"));
var _ttftowoff = _interopRequireDefault(require("./ttf/ttftowoff2"));
var _woff2tottf = _interopRequireDefault(require("./ttf/woff2tottf"));
var _index = _interopRequireDefault(require("../woff2/index.mjs"));
var _buffer = _interopRequireDefault(require("./nodejs/buffer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @file ESM entry point for Next.js and modern bundlers
 * @author mengke01(kekee000@gmail.com)
 * @author pumpkinzomb
 */
// Font 클래스를 직접 임포트
// Named exports for ESM
// Export all modules as default
var _default = exports.default = {
  Font: _font.Font,
  TTF: _ttf.default,
  TTFReader: _ttfreader.default,
  TTFWriter: _ttfwriter.default,
  ttf2eot: _ttf2eot.default,
  eot2ttf: _eot2ttf.default,
  ttf2woff: _ttf2woff.default,
  woff2ttf: _woff2ttf.default,
  ttf2svg: _ttf2svg.default,
  svg2ttfobject: _svg2ttfobject.default,
  Reader: _reader.default,
  Writer: _writer.default,
  OTFReader: _otfreader.default,
  otf2ttfobject: _otf2ttfobject.default,
  ttf2base64: _ttf2base.default,
  ttf2icon: _ttf2icon.default,
  ttftowoff2: _ttftowoff.default,
  woff2tottf: _woff2tottf.default,
  woff2: _index.default,
  toArrayBuffer: _buffer.default.toArrayBuffer,
  toBuffer: _buffer.default.toBuffer
};