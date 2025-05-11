"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @file 用于国际化的字符串管理类
 * @author mengke01(kekee000@gmail.com)
 */

function appendLanguage(store, languageList) {
  languageList.forEach(function (item) {
    var language = item[0];
    store[language] = Object.assign(store[language] || {}, item[1]);
  });
  return store;
}

/**
 * 管理国际化字符，根据lang切换语言版本
 *
 * @class I18n
 * @param {Array} languageList 当前支持的语言列表
 * @param {string=} defaultLanguage 默认语言
 * languageList = [
 *     'en-us', // 语言名称
 *     langObject // 语言字符串列表
 * ]
 */
var I18n = exports.default = /*#__PURE__*/function () {
  function I18n(languageList, defaultLanguage) {
    _classCallCheck(this, I18n);
    this.store = appendLanguage({}, languageList);
    this.setLanguage(defaultLanguage || typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase() || 'en-us');
  }

  /**
   * 设置语言
   *
   * @param {string} language 语言
   * @return {this}
   */
  return _createClass(I18n, [{
    key: "setLanguage",
    value: function setLanguage(language) {
      if (!this.store[language]) {
        language = 'en-us';
      }
      this.lang = this.store[this.language = language];
      return this;
    }

    /**
     * 添加一个语言字符串
     *
     * @param {string} language 语言
     * @param {Object} langObject 语言对象
     * @return {this}
     */
  }, {
    key: "addLanguage",
    value: function addLanguage(language, langObject) {
      appendLanguage(this.store, [[language, langObject]]);
      return this;
    }

    /**
     * 获取当前语言字符串
     *
     * @param  {string} path 语言路径
     * @return {string}      语言字符串
     */
  }, {
    key: "get",
    value: function get(path) {
      var ref = path.split('.');
      var refObject = this.lang;
      var level;
      while (refObject != null && (level = ref.shift())) {
        refObject = refObject[level];
      }
      return refObject != null ? refObject : '';
    }
  }]);
}();