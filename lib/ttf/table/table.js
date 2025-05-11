"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _struct = _interopRequireDefault(require("./struct"));
var _error = _interopRequireDefault(require("../error"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); } /**
 * @file ttf表基类
 * @author mengke01(kekee000@gmail.com)
 */
/* eslint-disable no-invalid-this */
/**
 * 读取表结构
 *
 * @param {Reader} reader reader对象
 * @return {Object} 当前对象
 */
function read(reader) {
  var offset = this.offset;
  if (undefined !== offset) {
    reader.seek(offset);
  }
  var me = this;
  this.struct.forEach(function (item) {
    var name = item[0];
    var type = item[1];
    var typeName = null;
    switch (type) {
      case _struct.default.Int8:
      case _struct.default.Uint8:
      case _struct.default.Int16:
      case _struct.default.Uint16:
      case _struct.default.Int32:
      case _struct.default.Uint32:
        typeName = _struct.default.names[type];
        me[name] = reader.read(typeName);
        break;
      case _struct.default.Fixed:
        me[name] = reader.readFixed();
        break;
      case _struct.default.LongDateTime:
        me[name] = reader.readLongDateTime();
        break;
      case _struct.default.Bytes:
        me[name] = reader.readBytes(reader.offset, item[2] || 0);
        break;
      case _struct.default.Char:
        me[name] = reader.readChar();
        break;
      case _struct.default.String:
        me[name] = reader.readString(reader.offset, item[2] || 0);
        break;
      default:
        _error.default.raise(10003, name, type);
    }
  });
  return this.valueOf();
}

/**
 * 写表结构
 *
 * @param {Object} writer writer对象
 * @param {Object} ttf 已解析的ttf对象
 *
 * @return {Writer} 返回writer对象
 */
function write(writer, ttf) {
  var table = ttf[this.name];
  if (!table) {
    _error.default.raise(10203, this.name);
  }
  this.struct.forEach(function (item) {
    var name = item[0];
    var type = item[1];
    var typeName = null;
    switch (type) {
      case _struct.default.Int8:
      case _struct.default.Uint8:
      case _struct.default.Int16:
      case _struct.default.Uint16:
      case _struct.default.Int32:
      case _struct.default.Uint32:
        typeName = _struct.default.names[type];
        writer.write(typeName, table[name]);
        break;
      case _struct.default.Fixed:
        writer.writeFixed(table[name]);
        break;
      case _struct.default.LongDateTime:
        writer.writeLongDateTime(table[name]);
        break;
      case _struct.default.Bytes:
        writer.writeBytes(table[name], item[2] || 0);
        break;
      case _struct.default.Char:
        writer.writeChar(table[name]);
        break;
      case _struct.default.String:
        writer.writeString(table[name], item[2] || 0);
        break;
      default:
        _error.default.raise(10003, name, type);
    }
  });
  return writer;
}

/**
 * 获取ttf表的size大小
 *
 * @param {string} name 表名
 * @return {number} 表大小
 */
function size() {
  var sz = 0;
  this.struct.forEach(function (item) {
    var type = item[1];
    switch (type) {
      case _struct.default.Int8:
      case _struct.default.Uint8:
        sz += 1;
        break;
      case _struct.default.Int16:
      case _struct.default.Uint16:
        sz += 2;
        break;
      case _struct.default.Int32:
      case _struct.default.Uint32:
      case _struct.default.Fixed:
        sz += 4;
        break;
      case _struct.default.LongDateTime:
        sz += 8;
        break;
      case _struct.default.Bytes:
        sz += item[2] || 0;
        break;
      case _struct.default.Char:
        sz += 1;
        break;
      case _struct.default.String:
        sz += item[2] || 0;
        break;
      default:
        _error.default.raise(10003, name, type);
    }
  });
  return sz;
}

/**
 * 获取对象的值
 *
 * @return {*} 当前对象的值
 */
function valueOf() {
  var val = {};
  var me = this;
  this.struct.forEach(function (item) {
    val[item[0]] = me[item[0]];
  });
  return val;
}
var _default = exports.default = {
  read: read,
  write: write,
  size: size,
  valueOf: valueOf,
  /**
   * 创建一个表结构
   *
   * @param {string} name 表名
   * @param {Array<[string, number]>} struct 表结构
   * @param {Object} proto 原型
   * @return {Function} 表构造函数
   */
  create: function create(name, struct, proto) {
    var Table = /*#__PURE__*/_createClass(function Table(offset) {
      _classCallCheck(this, Table);
      this.name = name;
      this.struct = struct;
      this.offset = offset;
    });
    Table.prototype.read = read;
    Table.prototype.write = write;
    Table.prototype.size = size;
    Table.prototype.valueOf = valueOf;
    Object.assign(Table.prototype, proto);
    return Table;
  }
};