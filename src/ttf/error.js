/**
 * @file ttf 相关错误号定义
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var string = require('../common/string');

    var error = require('./i18n').lang;

    /**
     * 抛出一个异常
     *
     * @param  {Object} e 异常号或者异常对象
     * 例如：
     * e = 1001
     * e = {
     *     number: 1001,
     *     data: 错误数据
     * }
     */
    error.raise = function (e) {
        var number;
        var data;
        if (typeof e === 'object') {
            number = e.number || 0;
            data = e.data;
        }
        else {
            number = e;
        }

        var message = error[number];
        if (arguments.length > 1) {
            var args = typeof arguments[1] === 'object'
                ? arguments[1]
                : Array.prototype.slice.call(arguments, 1);
            message = string.format(message, args);
        }

        var event = new Error(message);
        event.number = number;
        if (data) {
            event.data = data;
        }

        throw event;
    };

    return error;
});
