/**
 * @file 语言相关函数
 * @author mengke01(kekee000@gmail.com)
 */


export function isArray(obj) {
    return obj != null && toString.call(obj).slice(8, -1) === 'Array';
}

export function isObject(obj) {
    return obj != null && toString.call(obj).slice(8, -1) === 'Object';
}

export function isString(obj) {
    return obj != null && toString.call(obj).slice(8, -1) === 'String';
}

export function isFunction(obj) {
    return obj != null && toString.call(obj).slice(8, -1) === 'Function';
}

export function isDate(obj) {
    return obj != null && toString.call(obj).slice(8, -1) === 'Date';
}

export function isEmptyObject(object) {
    for (let name in object) {
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
export function curry(fn, ...cargs) {
    return function (...rargs) {
        let args = cargs.concat(rargs);
        return fn.apply(this, args);
    };
}


/**
 * 方法静态化, 反绑定、延迟绑定
 *
 * @param {Function} method 待静态化的方法
 * @return {Function} 静态化包装后方法
 */
export function generic(method) {
    return function (...fargs) {
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
export function overwrite(thisObj, thatObj, fields) {

    if (!thatObj) {
        return thisObj;
    }

    // 这里`fields`未指定则仅overwrite自身可枚举的字段，指定`fields`则不做限制
    fields = fields || Object.keys(thatObj);
    fields.forEach(function (field) {
        // 拷贝对象
        if (
            thisObj[field] && typeof thisObj[field] === 'object'
            && thatObj[field] && typeof thatObj[field] === 'object'
        ) {
            overwrite(thisObj[field], thatObj[field]);
        }
        else {
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
export function clone(source) {
    if (!source || typeof source !== 'object') {
        return source;
    }

    let cloned = source;

    if (isArray(source)) {
        cloned = source.slice().map(clone);
    }
    else if (isObject(source) && 'isPrototypeOf' in source) {
        cloned = {};
        for (let key of Object.keys(source)) {
            cloned[key] = clone(source[key]);
        }
    }

    return cloned;
}


// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time.
// @see underscore.js
export function throttle(func, wait) {
    let context;
    let args;
    let timeout;
    let result;
    let previous = 0;
    let later = function () {
        previous = new Date();
        timeout = null;
        result = func.apply(context, args);
    };

    return function (...args) {
        let now = new Date();
        let remaining = wait - (now - previous);
        context = this;
        if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
        }
        else if (!timeout) {
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
export function debounce(func, wait, immediate) {
    let timeout;
    let result;

    return function (...args) {
        let context = this;
        let later = function () {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
            }
        };

        let callNow = immediate && !timeout;

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
export function equals(thisObj, thatObj, fields) {

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
    fields = fields || (typeof thisObj === 'object'
            ? Object.keys(thisObj)
            : []);

    if (!fields.length) {
        return thisObj === thatObj;
    }

    let equal = true;
    for (let i = 0, l = fields.length, field; equal && i < l; i++) {
        field = fields[i];

        if (
            thisObj[field] && typeof thisObj[field] === 'object'
            && thatObj[field] && typeof thatObj[field] === 'object'
        ) {
            equal = equal && equals(thisObj[field], thatObj[field]);
        }
        else {
            equal = equal && (thisObj[field] === thatObj[field]);
        }
    }

    return equal;
}
