"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Font = void 0;
var _buffer = _interopRequireDefault(require("../nodejs/buffer"));
var _getEmptyttfObject = _interopRequireDefault(require("./getEmptyttfObject"));
var _ttf = _interopRequireDefault(require("./ttf"));
var _woff2ttf = _interopRequireDefault(require("./woff2ttf"));
var _otf2ttfobject = _interopRequireDefault(require("./otf2ttfobject"));
var _eot2ttf = _interopRequireDefault(require("./eot2ttf"));
var _svg2ttfobject = _interopRequireDefault(require("./svg2ttfobject"));
var _ttfreader = _interopRequireDefault(require("./ttfreader"));
var _ttfwriter = _interopRequireDefault(require("./ttfwriter"));
var _ttf2eot = _interopRequireDefault(require("./ttf2eot"));
var _ttf2woff = _interopRequireDefault(require("./ttf2woff"));
var _ttf2svg = _interopRequireDefault(require("./ttf2svg"));
var _ttf2symbol = _interopRequireDefault(require("./ttf2symbol"));
var _ttftowoff = _interopRequireDefault(require("./ttftowoff2"));
var _woff2tottf = _interopRequireDefault(require("./woff2tottf"));
var _ttf2base = _interopRequireDefault(require("./ttf2base64"));
var _eot2base = _interopRequireDefault(require("./eot2base64"));
var _woff2base = _interopRequireDefault(require("./woff2base64"));
var _svg2base = _interopRequireDefault(require("./svg2base64"));
var _bytes2base = _interopRequireDefault(require("./util/bytes2base64"));
var _woff2tobase = _interopRequireDefault(require("./woff2tobase64"));
var _optimizettf = _interopRequireDefault(require("./util/optimizettf"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); } /**
 * @file 字体管理对象，处理字体相关的读取、查询、转换
 *
 * @author mengke01(kekee000@gmail.com)
 */
// 必须是nodejs环境下的Buffer对象才能触发buffer转换
var SUPPORT_BUFFER = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && _typeof(process.versions) === 'object' && typeof process.versions.node !== 'undefined' && typeof Buffer === 'function';
var Font = exports.Font = /*#__PURE__*/function () {
  /**
  * 字体对象构造函数
  *
  * @param {ArrayBuffer|Buffer|string|Document} buffer  字体数据
  * @param {Object} options  读取参数
  */
  function Font(buffer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      type: 'ttf'
    };
    _classCallCheck(this, Font);
    // 字形对象
    if (_typeof(buffer) === 'object' && buffer.glyf) {
      this.set(buffer);
    }
    // buffer
    else if (buffer) {
      this.read(buffer, options);
    }
    // 空
    else {
      this.readEmpty();
    }
  }

  /**
  * Create a Font instance
  *
  * @param {ArrayBuffer|Buffer|string|Document} buffer  字体数据
  * @param {Object} options  读取参数
  * @return {Font}
  */
  return _createClass(Font, [{
    key: "readEmpty",
    value:
    /**
    * 设置一个空的 ttfObject 对象
    *
    * @return {Font}
    */
    function readEmpty() {
      this.data = (0, _getEmptyttfObject.default)();
      return this;
    }

    /**
    * 读取字体数据
    *
    * @param {ArrayBuffer|Buffer|string|Document} buffer  字体数据
    * @param {Object} options  读取参数
    * @param {string} options.type 字体类型
    *
    * ttf, woff , eot 读取配置
    * @param {boolean} options.hinting 是否保留 hinting 信息
    * @param {boolean} options.kerning 是否保留 kerning 信息
    * @param {boolean} options.compound2simple 复合字形转简单字形
    *
    * woff 读取配置
    * @param {Function} options.inflate 解压相关函数
    *
    * svg 读取配置
    * @param {boolean} options.combinePath 是否合并成单个字形，仅限于普通svg导入
    * @return {Font}
    */
  }, {
    key: "read",
    value: function read(buffer, options) {
      // nodejs buffer
      if (SUPPORT_BUFFER) {
        if (buffer instanceof Buffer) {
          buffer = _buffer.default.toArrayBuffer(buffer);
        }
      }
      if (options.type === 'ttf') {
        this.data = new _ttfreader.default(options).read(buffer);
      } else if (options.type === 'otf') {
        this.data = (0, _otf2ttfobject.default)(buffer, options);
      } else if (options.type === 'eot') {
        buffer = (0, _eot2ttf.default)(buffer, options);
        this.data = new _ttfreader.default(options).read(buffer);
      } else if (options.type === 'woff') {
        buffer = (0, _woff2ttf.default)(buffer, options);
        this.data = new _ttfreader.default(options).read(buffer);
      } else if (options.type === 'woff2') {
        buffer = (0, _woff2tottf.default)(buffer, options);
        this.data = new _ttfreader.default(options).read(buffer);
      } else if (options.type === 'svg') {
        this.data = (0, _svg2ttfobject.default)(buffer, options);
      } else {
        throw new Error('not support font type' + options.type);
      }
      this.type = options.type;
      return this;
    }

    /**
    * 写入字体数据
    *
    * @param {Object} options  写入参数
    * @param {string} options.type   字体类型, 默认 ttf
    * @param {boolean} options.toBuffer nodejs 环境中返回 Buffer 对象, 默认 true
    *
    * ttf 字体参数
    * @param {boolean} options.hinting 是否保留 hinting 信息
    * @param {boolean} options.kerning 是否保留 kerning 信息
    * svg,woff 字体参数
    * @param {Object} options.metadata 字体相关的信息
    *
    * woff 字体参数
    * @param {Function} options.deflate 压缩相关函数
    * @return {Buffer|ArrayBuffer|string}
    */
  }, {
    key: "write",
    value: function write() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!options.type) {
        options.type = this.type;
      }
      var buffer = null;
      if (options.type === 'ttf') {
        buffer = new _ttfwriter.default(options).write(this.data);
      } else if (options.type === 'eot') {
        buffer = new _ttfwriter.default(options).write(this.data);
        buffer = (0, _ttf2eot.default)(buffer, options);
      } else if (options.type === 'woff') {
        buffer = new _ttfwriter.default(options).write(this.data);
        buffer = (0, _ttf2woff.default)(buffer, options);
      } else if (options.type === 'woff2') {
        buffer = new _ttfwriter.default(options).write(this.data);
        buffer = (0, _ttftowoff.default)(buffer, options);
      } else if (options.type === 'svg') {
        buffer = (0, _ttf2svg.default)(this.data, options);
      } else if (options.type === 'symbol') {
        buffer = (0, _ttf2symbol.default)(this.data, options);
      } else {
        throw new Error('not support font type' + options.type);
      }
      if (SUPPORT_BUFFER) {
        if (false !== options.toBuffer && buffer instanceof ArrayBuffer) {
          buffer = _buffer.default.toBuffer(buffer);
        }
      }
      return buffer;
    }

    /**
    * 转换成 base64编码
    *
    * @param {Object} options  写入参数
    * @param {string} options.type   字体类型, 默认 ttf
    * 其他 options参数, 参考 write
    * @see write
    *
    * @param {ArrayBuffer=} buffer  如果提供了buffer数据则使用 buffer数据, 否则转换现有的 font
    * @return {string}
    */
  }, {
    key: "toBase64",
    value: function toBase64(options, buffer) {
      if (!options.type) {
        options.type = this.type;
      }
      if (buffer) {
        if (SUPPORT_BUFFER) {
          if (buffer instanceof Buffer) {
            buffer = _buffer.default.toArrayBuffer(buffer);
          }
        }
      } else {
        options.toBuffer = false;
        buffer = this.write(options);
      }
      var base64Str;
      if (options.type === 'ttf') {
        base64Str = (0, _ttf2base.default)(buffer);
      } else if (options.type === 'eot') {
        base64Str = (0, _eot2base.default)(buffer);
      } else if (options.type === 'woff') {
        base64Str = (0, _woff2base.default)(buffer);
      } else if (options.type === 'woff2') {
        base64Str = (0, _woff2tobase.default)(buffer);
      } else if (options.type === 'svg') {
        base64Str = (0, _svg2base.default)(buffer);
      } else if (options.type === 'symbol') {
        base64Str = (0, _svg2base.default)(buffer, 'image/svg+xml');
      } else {
        throw new Error('not support font type' + options.type);
      }
      return base64Str;
    }

    /**
    * 设置 font 对象
    *
    * @param {Object} data font的ttfObject对象
    * @return {this}
    */
  }, {
    key: "set",
    value: function set(data) {
      this.data = data;
      return this;
    }

    /**
    * 获取 font 数据
    *
    * @return {Object} ttfObject 对象
    */
  }, {
    key: "get",
    value: function get() {
      return this.data;
    }

    /**
    * 对字形数据进行优化
    *
    * @param  {Object} out  输出结果
    * @param  {boolean|Object} out.result `true` 或者有问题的地方
    * @return {Font}
    */
  }, {
    key: "optimize",
    value: function optimize(out) {
      var result = (0, _optimizettf.default)(this.data);
      if (out) {
        out.result = result;
      }
      return this;
    }

    /**
    * 将字体中的复合字形转为简单字形
    *
    * @return {this}
    */
  }, {
    key: "compound2simple",
    value: function compound2simple() {
      var ttf = new _ttf.default(this.data);
      ttf.compound2simple();
      this.data = ttf.get();
      return this;
    }

    /**
    * 对字形按照unicode编码排序
    *
    * @return {this}
    */
  }, {
    key: "sort",
    value: function sort() {
      var ttf = new _ttf.default(this.data);
      ttf.sortGlyf();
      this.data = ttf.get();
      return this;
    }

    /**
    * 查找相关字形
    *
    * @param  {Object} condition 查询条件
    * @param  {Array|number} condition.unicode unicode编码列表或者单个unicode编码
    * @param  {string} condition.name glyf名字，例如`uniE001`, `uniE`
    * @param  {Function} condition.filter 自定义过滤器
    * @example
    *     condition.filter(glyf) {
    *         return glyf.name === 'logo';
    *     }
    * @return {Array}  glyf字形列表
    */
  }, {
    key: "find",
    value: function find(condition) {
      var ttf = new _ttf.default(this.data);
      var indexList = ttf.findGlyf(condition);
      return indexList.length ? ttf.getGlyf(indexList) : indexList;
    }

    /**
    * 合并 font 到当前的 font
    *
    * @param {Object} font Font 对象
    * @param {Object} options 参数选项
    * @param {boolean} options.scale 是否自动缩放
    * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
    *                                     (和 options.scale 参数互斥)
    *
    * @return {Font}
    */
  }, {
    key: "merge",
    value: function merge(font, options) {
      var ttf = new _ttf.default(this.data);
      ttf.mergeGlyf(font.get(), options);
      this.data = ttf.get();
      return this;
    }
  }], [{
    key: "create",
    value: function create(buffer, options) {
      return new Font(buffer, options);
    }
  }]);
}();
/**
 * base64序列化buffer 数据
 *
 * @param {ArrayBuffer|Buffer|string} buffer 字体数据
 * @return {Font}
 */
Font.toBase64 = function (buffer) {
  if (typeof buffer === 'string') {
    // node 环境中没有 btoa 函数
    if (typeof btoa === 'undefined') {
      return Buffer.from(buffer, 'binary').toString('base64');
    }
    return btoa(buffer);
  }
  return (0, _bytes2base.default)(buffer);
};

// 기존 방식: export default Font
// 새로운 방식: 직접 export
var _default = exports.default = Font;