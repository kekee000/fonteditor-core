"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lang = require("../common/lang");
var _error = _interopRequireDefault(require("./error"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @file 数据写入器
 * @author mengke01(kekee000@gmail.com)
 */
// 检查数组支持情况
if (typeof ArrayBuffer === 'undefined' || typeof DataView === 'undefined') {
  throw new Error('not support ArrayBuffer and DataView');
}

// 数据类型
var dataType = {
  Int8: 1,
  Int16: 2,
  Int32: 4,
  Uint8: 1,
  Uint16: 2,
  Uint32: 4,
  Float32: 4,
  Float64: 8
};

/**
 * 读取器
 *
 * @constructor
 * @param {Array.<byte>} buffer 缓冲数组
 * @param {number} offset 起始偏移
 * @param {number=} length 数组长度
 * @param {boolean=} littleEndian 是否小尾
 */
var Writer = /*#__PURE__*/function () {
  function Writer(buffer, offset, length, littleEndian) {
    _classCallCheck(this, Writer);
    var bufferLength = buffer.byteLength || buffer.length;
    this.offset = offset || 0;
    this.length = length || bufferLength - this.offset;
    this.littleEndian = littleEndian || false;
    this.view = new DataView(buffer, this.offset, this.length);
  }

  /**
   * 读取指定的数据类型
   *
   * @param {string} type 数据类型
   * @param {number} value value值
   * @param {number=} offset 位移
   * @param {boolean=} littleEndian 是否小尾
   *
   * @return {this}
   */
  return _createClass(Writer, [{
    key: "write",
    value: function write(type, value, offset, littleEndian) {
      // 使用当前位移
      if (undefined === offset) {
        offset = this.offset;
      }

      // 使用小尾
      if (undefined === littleEndian) {
        littleEndian = this.littleEndian;
      }

      // 扩展方法
      if (undefined === dataType[type]) {
        return this['write' + type](value, offset, littleEndian);
      }
      var size = dataType[type];
      this.offset = offset + size;
      this.view['set' + type](offset, value, littleEndian);
      return this;
    }

    /**
     * 写入指定的字节数组
     *
     * @param {ArrayBuffer} value 写入值
     * @param {number=} length 数组长度
     * @param {number=} offset 起始偏移
     * @return {this}
     */
  }, {
    key: "writeBytes",
    value: function writeBytes(value, length, offset) {
      length = length || value.byteLength || value.length;
      var i;
      if (!length) {
        return this;
      }
      if (undefined === offset) {
        offset = this.offset;
      }
      if (length < 0 || offset + length > this.length) {
        _error.default.raise(10002, this.length, offset + length);
      }
      var littleEndian = this.littleEndian;
      if (value instanceof ArrayBuffer) {
        var view = new DataView(value, 0, length);
        for (i = 0; i < length; ++i) {
          this.view.setUint8(offset + i, view.getUint8(i, littleEndian), littleEndian);
        }
      } else {
        for (i = 0; i < length; ++i) {
          this.view.setUint8(offset + i, value[i], littleEndian);
        }
      }
      this.offset = offset + length;
      return this;
    }

    /**
     * 写空数据
     *
     * @param {number} length 长度
     * @param {number=} offset 起始偏移
     * @return {this}
     */
  }, {
    key: "writeEmpty",
    value: function writeEmpty(length, offset) {
      if (length < 0) {
        _error.default.raise(10002, this.length, length);
      }
      if (undefined === offset) {
        offset = this.offset;
      }
      var littleEndian = this.littleEndian;
      for (var i = 0; i < length; ++i) {
        this.view.setUint8(offset + i, 0, littleEndian);
      }
      this.offset = offset + length;
      return this;
    }

    /**
     * 写入一个string
     *
     * @param {string} str 字符串
     * @param {number=} length 长度
     * @param {number=} offset 偏移
     *
     * @return {this}
     */
  }, {
    key: "writeString",
    value: function writeString() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var length = arguments.length > 1 ? arguments[1] : undefined;
      var offset = arguments.length > 2 ? arguments[2] : undefined;
      if (undefined === offset) {
        offset = this.offset;
      }

      // eslint-disable-next-line no-control-regex
      length = length || str.replace(/[^\x00-\xff]/g, '11').length;
      if (length < 0 || offset + length > this.length) {
        _error.default.raise(10002, this.length, offset + length);
      }
      this.seek(offset);
      for (var i = 0, l = str.length, charCode; i < l; ++i) {
        charCode = str.charCodeAt(i) || 0;
        if (charCode > 127) {
          // unicode编码可能会超出2字节,
          // 写入与编码有关系，此处不做处理
          this.writeUint16(charCode);
        } else {
          this.writeUint8(charCode);
        }
      }
      this.offset = offset + length;
      return this;
    }

    /**
     * 写入一个字符
     *
     * @param {string} value 字符
     * @param {number=} offset 偏移
     * @return {this}
     */
  }, {
    key: "writeChar",
    value: function writeChar(value, offset) {
      return this.writeString(value, offset);
    }

    /**
     * 写入fixed类型
     *
     * @param {number} value 写入值
     * @param {number=} offset 偏移
     * @return {number} float
     */
  }, {
    key: "writeFixed",
    value: function writeFixed(value, offset) {
      if (undefined === offset) {
        offset = this.offset;
      }
      this.writeInt32(Math.round(value * 65536), offset);
      return this;
    }

    /**
     * 写入长日期
     *
     * @param {Date} value 日期对象
     * @param {number=} offset 偏移
     *
     * @return {Date} Date对象
     */
  }, {
    key: "writeLongDateTime",
    value: function writeLongDateTime(value, offset) {
      if (undefined === offset) {
        offset = this.offset;
      }

      // new Date(1970, 1, 1).getTime() - new Date(1904, 1, 1).getTime();
      var delta = -2077545600000;
      if (typeof value === 'undefined') {
        value = delta;
      } else if (typeof value.getTime === 'function') {
        value = value.getTime();
      } else if (/^\d+$/.test(value)) {
        value = +value;
      } else {
        value = Date.parse(value);
      }
      var time = Math.round((value - delta) / 1000);
      this.writeUint32(0, offset);
      this.writeUint32(time, offset + 4);
      return this;
    }

    /**
     * 跳转到指定偏移
     *
     * @param {number=} offset 偏移
     * @return {this}
     */
  }, {
    key: "seek",
    value: function seek(offset) {
      if (undefined === offset) {
        this.offset = 0;
      }
      if (offset < 0 || offset > this.length) {
        _error.default.raise(10002, this.length, offset);
      }
      this._offset = this.offset;
      this.offset = offset;
      return this;
    }

    /**
     * 跳转到写入头部位置
     *
     * @return {this}
     */
  }, {
    key: "head",
    value: function head() {
      this.offset = this._offset || 0;
      return this;
    }

    /**
     * 获取缓存的byte数组
     *
     * @return {ArrayBuffer}
     */
  }, {
    key: "getBuffer",
    value: function getBuffer() {
      return this.view.buffer;
    }

    /**
     * 注销
     */
  }, {
    key: "dispose",
    value: function dispose() {
      delete this.view;
    }
  }]);
}(); // 直接支持的数据类型
Object.keys(dataType).forEach(function (type) {
  Writer.prototype['write' + type] = (0, _lang.curry)(Writer.prototype.write, type);
});
var _default = exports.default = Writer;