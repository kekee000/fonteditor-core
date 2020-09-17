/**
 * @file ttf 相关错误号定义
 * @author mengke01(kekee000@gmail.com)
 */

import string from '../common/string';
import i18n from './i18n';

export default {

    /**
     * 抛出一个异常
     *
     * @param  {Object} e 异常号或者异常对象
     * @param  {...Array} fargs args 参数
     *
     * 例如：
     * e = 1001
     * e = {
     *     number: 1001,
     *     data: 错误数据
     * }
     */
    raise(e, ...fargs) {
        let number;
        let data;
        if (typeof e === 'object') {
            number = e.number || 0;
            data = e.data;
        }
        else {
            number = e;
        }

        let message = i18n.lang[number];
        if (fargs.length > 0) {
            const args = typeof fargs[0] === 'object'
                ? fargs[0]
                : fargs;
            message = string.format(message, args);
        }

        const event = new Error(message);
        event.number = number;
        if (data) {
            event.data = data;
        }

        throw event;
    }
};


