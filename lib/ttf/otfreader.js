"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _directory = _interopRequireDefault(require("./table/directory"));
var _supportOtf = _interopRequireDefault(require("./table/support-otf"));
var _reader = _interopRequireDefault(require("./reader"));
var _error = _interopRequireDefault(require("./error"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @file otf字体读取
 * @author mengke01(kekee000@gmail.com)
 */
var OTFReader = exports.default = /*#__PURE__*/function () {
  /**
   * OTF读取函数
   *
   * @param {Object} options 写入参数
   * @constructor
   */
  function OTFReader() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, OTFReader);
    options.subset = options.subset || [];
    this.options = options;
  }

  /**
   * 初始化
   *
   * @param {ArrayBuffer} buffer buffer对象
   * @return {Object} ttf对象
   */
  return _createClass(OTFReader, [{
    key: "readBuffer",
    value: function readBuffer(buffer) {
      var reader = new _reader.default(buffer, 0, buffer.byteLength, false);
      var font = {};

      // version
      font.version = reader.readString(0, 4);
      if (font.version !== 'OTTO') {
        _error.default.raise(10301);
      }

      // num tables
      font.numTables = reader.readUint16();
      if (font.numTables <= 0 || font.numTables > 100) {
        _error.default.raise(10302);
      }

      // searchRange
      font.searchRange = reader.readUint16();

      // entrySelector
      font.entrySelector = reader.readUint16();

      // rangeShift
      font.rangeShift = reader.readUint16();
      font.tables = new _directory.default(reader.offset).read(reader, font);
      if (!font.tables.head || !font.tables.cmap || !font.tables.CFF) {
        _error.default.raise(10302);
      }
      font.readOptions = this.options;

      // 读取支持的表数据
      Object.keys(_supportOtf.default).forEach(function (tableName) {
        if (font.tables[tableName]) {
          var offset = font.tables[tableName].offset;
          font[tableName] = new _supportOtf.default[tableName](offset).read(reader, font);
        }
      });
      if (!font.CFF.glyf) {
        _error.default.raise(10303);
      }
      reader.dispose();
      return font;
    }

    /**
     * 关联glyf相关的信息
     *
     * @param {Object} font font对象
     */
  }, {
    key: "resolveGlyf",
    value: function resolveGlyf(font) {
      var codes = font.cmap;
      var glyf = font.CFF.glyf;
      var subsetMap = font.readOptions.subset ? font.subsetMap : null; // 当前ttf的子集列表
      // unicode
      Object.keys(codes).forEach(function (c) {
        var i = codes[c];
        if (subsetMap && !subsetMap[i]) {
          return;
        }
        if (!glyf[i].unicode) {
          glyf[i].unicode = [];
        }
        glyf[i].unicode.push(+c);
      });

      // leftSideBearing
      font.hmtx.forEach(function (item, i) {
        if (subsetMap && !subsetMap[i]) {
          return;
        }
        glyf[i].advanceWidth = glyf[i].advanceWidth || item.advanceWidth || 0;
        glyf[i].leftSideBearing = item.leftSideBearing;
      });

      // 设置了subsetMap之后需要选取subset中的字形
      if (subsetMap) {
        var subGlyf = [];
        Object.keys(subsetMap).forEach(function (i) {
          subGlyf.push(glyf[+i]);
        });
        glyf = subGlyf;
      }
      font.glyf = glyf;
    }

    /**
     * 清除非必须的表
     *
     * @param {Object} font font对象
     */
  }, {
    key: "cleanTables",
    value: function cleanTables(font) {
      delete font.readOptions;
      delete font.tables;
      delete font.hmtx;
      delete font.post.glyphNameIndex;
      delete font.post.names;
      delete font.subsetMap;

      // 删除无用的表
      var cff = font.CFF;
      delete cff.glyf;
      delete cff.charset;
      delete cff.encoding;
      delete cff.gsubrs;
      delete cff.gsubrsBias;
      delete cff.subrs;
      delete cff.subrsBias;
    }

    /**
     * 获取解析后的ttf文档
     *
     * @param {ArrayBuffer} buffer buffer对象
     *
     * @return {Object} ttf文档
     */
  }, {
    key: "read",
    value: function read(buffer) {
      this.font = this.readBuffer(buffer);
      this.resolveGlyf(this.font);
      this.cleanTables(this.font);
      return this.font;
    }

    /**
     * 注销
     */
  }, {
    key: "dispose",
    value: function dispose() {
      delete this.font;
      delete this.options;
    }
  }]);
}();