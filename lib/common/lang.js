"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.curry = curry;
exports.debounce = debounce;
exports.equals = equals;
exports.generic = generic;
exports.isArray = isArray;
exports.isDate = isDate;
exports.isEmptyObject = isEmptyObject;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isString = isString;
exports.overwrite = overwrite;
exports.throttle = throttle;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * @file 语言相关函数
 * @author mengke01(kekee000@gmail.com)
 */

function isArray(obj) {
  return obj != null && toString.call(obj).slice(8, -1) === 'Array';
}
function isObject(obj) {
  return obj != null && toString.call(obj).slice(8, -1) === 'Object';
}
function isString(obj) {
  return obj != null && toString.call(obj).slice(8, -1) === 'String';
}
function isFunction(obj) {
  return obj != null && toString.call(obj).slice(8, -1) === 'Function';
}
function isDate(obj) {
  return obj != null && toString.call(obj).slice(8, -1) === 'Date';
}
function isEmptyObject(object) {
  for (var name in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
}

/**
 * 为函数提前绑定前置参数（柯里化）
 *
 * @see http://en.wikipedia.org/wiki/Currying
 * @param {Function} fn 要绑定的函数
 * @param {...Array} cargs cargs
 * @return {Function}
 */
function curry(fn) {
  for (var _len = arguments.length, cargs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    cargs[_key - 1] = arguments[_key];
  }
  return function () {
    for (var _len2 = arguments.length, rargs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      rargs[_key2] = arguments[_key2];
    }
    var args = cargs.concat(rargs);
    // eslint-disable-next-line no-invalid-this
    return fn.apply(this, args);
  };
}

/**
 * 方法静态化, 反绑定、延迟绑定
 *
 * @param {Function} method 待静态化的方法
 * @return {Function} 静态化包装后方法
 */
function generic(method) {
  return function () {
    for (var _len3 = arguments.length, fargs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      fargs[_key3] = arguments[_key3];
    }
    return Function.call.apply(method, fargs);
  };
}

/**
 * 设置覆盖相关的属性值
 *
 * @param {Object} thisObj 覆盖对象
 * @param {Object} thatObj 值对象
 * @param {Array.<string>} fields 字段
 * @return {Object} thisObj
 */
function overwrite(thisObj, thatObj, fields) {
  if (!thatObj) {
    return thisObj;
  }

  // 这里`fields`未指定则仅overwrite自身可枚举的字段，指定`fields`则不做限制
  fields = fields || Object.keys(thatObj);
  fields.forEach(function (field) {
    // 拷贝对象
    if (thisObj[field] && _typeof(thisObj[field]) === 'object' && thatObj[field] && _typeof(thatObj[field]) === 'object') {
      overwrite(thisObj[field], thatObj[field]);
    } else {
      thisObj[field] = thatObj[field];
    }
  });
  return thisObj;
}

/**
 * 深复制对象，仅复制数据
 *
 * @param {Object} source 源数据
 * @return {Object} 复制的数据
 */
function clone(source) {
  if (!source || _typeof(source) !== 'object') {
    return source;
  }
  var cloned = source;
  if (isArray(source)) {
    cloned = source.slice().map(clone);
  } else if (isObject(source) && 'isPrototypeOf' in source) {
    cloned = {};
    for (var _i = 0, _Object$keys = Object.keys(source); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      cloned[key] = clone(source[key]);
    }
  }
  return cloned;
}

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time.
// @see underscore.js
function throttle(func, wait) {
  var context;
  var args;
  var timeout;
  var result;
  var previous = 0;
  var later = function later() {
    previous = new Date();
    timeout = null;
    result = func.apply(context, args);
  };
  return function () {
    var now = new Date();
    var remaining = wait - (now - previous);
    // eslint-disable-next-line no-invalid-this
    context = this;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      result = func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// @see underscore.js
function debounce(func, wait, immediate) {
  var timeout;
  var result;
  return function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    // eslint-disable-next-line no-invalid-this
    var context = this;
    var later = function later() {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
    }
    return result;
  };
}

/**
 * 判断两个对象的字段是否相等
 *
 * @param  {Object} thisObj 要比较的对象
 * @param  {Object} thatObj 参考对象
 * @param  {Array} fields 指定字段
 * @return {boolean}  是否相等
 */
function equals(thisObj, thatObj, fields) {
  if (thisObj === thatObj) {
    return true;
  }
  if (thisObj == null && thatObj == null) {
    return true;
  }
  if (thisObj == null && thatObj != null || thisObj != null && thatObj == null) {
    return false;
  }

  // 这里`fields`未指定则仅overwrite自身可枚举的字段，指定`fields`则不做限制
  fields = fields || (_typeof(thisObj) === 'object' ? Object.keys(thisObj) : []);
  if (!fields.length) {
    return thisObj === thatObj;
  }
  var equal = true;
  for (var i = 0, l = fields.length, field; equal && i < l; i++) {
    field = fields[i];
    if (thisObj[field] && _typeof(thisObj[field]) === 'object' && thatObj[field] && _typeof(thatObj[field]) === 'object') {
      equal = equal && equals(thisObj[field], thatObj[field]);
    } else {
      equal = equal && thisObj[field] === thatObj[field];
    }
  }
  return equal;
}