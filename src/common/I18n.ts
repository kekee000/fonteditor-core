/**
 * @file 用于国际化的字符串管理类
 * @author mengke01(kekee000@gmail.com)
 */

type LangObject = Record<string, any>;
type LanguageEntry = [string, LangObject];

function appendLanguage(store: Record<string, LangObject>, languageList: LanguageEntry[]): Record<string, LangObject> {
    languageList.forEach(item => {
        const language = item[0];
        store[language] = Object.assign(store[language] || {}, item[1]);
    });
    return store;
}

/**
 * 管理国际化字符，根据lang切换语言版本
 */
export default class I18n {

    store: Record<string, LangObject>;
    lang!: LangObject;
    language!: string;

    constructor(languageList: LanguageEntry[], defaultLanguage?: string) {
        this.store = appendLanguage({}, languageList);
        this.setLanguage(
            defaultLanguage
            || (typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase())
            || 'en-us'
        );
    }

    setLanguage(language: string): this {
        if (!this.store[language]) {
            language = 'en-us';
        }
        this.lang = this.store[this.language = language];
        return this;
    }

    addLanguage(language: string, langObject: LangObject): this {
        appendLanguage(this.store, [[language, langObject]]);
        return this;
    }

    get(path: string): string {
        const ref = path.split('.');
        let refObject: any = this.lang;
        let level: string | undefined;
        while (refObject != null && (level = ref.shift())) {
            refObject = refObject[level];
        }
        return refObject != null ? refObject : '';
    }
}
