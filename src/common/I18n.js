/**
 * @file 用于国际化的字符串管理类
 * @author mengke01(kekee000@gmail.com)
 */

function appendLanguage(store, languageList) {
    languageList.forEach(item => {
        const language = item[0];
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
export default class I18n {
    constructor(languageList, defaultLanguage) {
        this.store = appendLanguage({}, languageList);
        this.setLanguage(
            defaultLanguage
            || typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase()
            || 'en-us'
        );
    }

    /**
     * 设置语言
     *
     * @param {string} language 语言
     * @return {this}
     */
    setLanguage(language) {
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
    addLanguage(language, langObject) {
        appendLanguage(this.store, [[language, langObject]]);
        return this;
    }

    /**
     * 获取当前语言字符串
     *
     * @param  {string} path 语言路径
     * @return {string}      语言字符串
     */
    get(path) {
        const ref = path.split('.');
        let refObject = this.lang;
        let level;
        while (refObject != null && (level = ref.shift())) {
            refObject = refObject[level];
        }
        return refObject != null ? refObject : '';
    }
}
