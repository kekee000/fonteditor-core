/**
 * @file 语言相关函数
 * @author mengke01(kekee000@gmail.com)
 */


export function isArray(obj: any): boolean {
    return obj != null && toString.call(obj).slice(8, -1) === 'Array';
}

export function isObject(obj: any): boolean {
    return obj != null && toString.call(obj).slice(8, -1) === 'Object';
}

export function isString(obj: any): boolean {
    return obj != null && toString.call(obj).slice(8, -1) === 'String';
}

export function isFunction(obj: any): boolean {
    return obj != null && toString.call(obj).slice(8, -1) === 'Function';
}

export function isDate(obj: any): boolean {
    return obj != null && toString.call(obj).slice(8, -1) === 'Date';
}

export function isEmptyObject(object: Record<string, any>): boolean {
    for (const name in object) {
        // eslint-disable-next-line no-prototype-builtins
        if (object.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
}

/**
 * 为函数提前绑定前置参数（柯里化）
 */
export function curry<T extends (...args: any[]) => any>(fn: T, ...cargs: any[]): (...rargs: any[]) => ReturnType<T> {
    return function (this: any, ...rargs: any[]) {
        const args = cargs.concat(rargs);
        // eslint-disable-next-line no-invalid-this
        return fn.apply(this, args);
    };
}


/**
 * 方法静态化, 反绑定、延迟绑定
 */
export function generic(method: Function): (...args: any[]) => any {
    return function (...fargs: any[]) {
        return Function.call.apply(method, fargs as any);
    };
}


/**
 * 设置覆盖相关的属性值
 */
export function overwrite(thisObj: any, thatObj: any, fields?: string[]): any {

    if (!thatObj) {
        return thisObj;
    }

    fields = fields || Object.keys(thatObj);
    fields.forEach(field => {
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
 */
export function clone<T = any>(source: T): T {
    if (!source || typeof source !== 'object') {
        return source;
    }

    let cloned: any = source;

    if (isArray(source)) {
        cloned = (source as any).slice().map(clone);
    }
    else if (isObject(source) && 'isPrototypeOf' in (source as any)) {
        cloned = {};
        for (const key of Object.keys(source as any)) {
            cloned[key] = clone((source as any)[key]);
        }
    }

    return cloned;
}


// @see underscore.js
export function throttle(func: (...args: any[]) => any, wait: number): (...args: any[]) => any {
    let context: any;
    let args: any[] | undefined;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let result: any;
    let previous = 0;
    const later = function () {
        previous = Date.now();
        timeout = null;
        result = func.apply(context, args as any[]);
    };

    return function (this: any, ...rargs: any[]) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        // eslint-disable-next-line no-invalid-this
        context = this;
        args = rargs;
        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
            }
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

// @see underscore.js
export function debounce(func: (...args: any[]) => any, wait: number, immediate?: boolean): (...args: any[]) => any {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let result: any;

    return function (this: any, ...args: any[]) {
        // eslint-disable-next-line no-invalid-this
        const context = this;
        const later = function () {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
            }
        };

        const callNow = immediate && !timeout;

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);

        if (callNow) {
            result = func.apply(context, args);
        }

        return result;
    };
}

/**
 * 判断两个对象的字段是否相等
 */
export function equals(thisObj: any, thatObj: any, fields?: string[]): boolean {

    if (thisObj === thatObj) {
        return true;
    }

    if (thisObj == null && thatObj == null) {
        return true;
    }

    if (thisObj == null && thatObj != null || thisObj != null && thatObj == null) {
        return false;
    }

    fields = fields || (typeof thisObj === 'object'
        ? Object.keys(thisObj)
        : []);

    if (!fields.length) {
        return thisObj === thatObj;
    }

    let equal = true;
    for (let i = 0, l = fields.length, field: string; equal && i < l; i++) {
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
