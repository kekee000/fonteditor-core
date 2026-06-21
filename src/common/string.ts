/**
 * @file 字符串相关的函数
 * @author mengke01(kekee000@gmail.com)
 */

export default {

    /**
     * HTML解码字符串
     *
     * @param source 源字符串
     * @return
     */
    decodeHTML(source: string) {

        const str = String(source)
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');

        // 处理转义的中文和实体字符
        return str.replace(/&#([\d]+);/g, ($0, $1) => String.fromCodePoint(parseInt($1, 10)));
    },

    /**
     * HTML编码字符串
     *
     * @param source 源字符串
     * @return
     */
    encodeHTML(source: string) {
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    /**
     * 获取string字节长度
     *
     * @param source 源字符串
     * @return 长度
     */
    getLength(source: string) {
        // eslint-disable-next-line no-control-regex
        return String(source).replace(/[^\x00-\xff]/g, '11').length;
    },

    /**
     * 字符串格式化，支持如 ${xxx.xxx} 的语法
     *
     * @param source 模板字符串
     * @param data 数据
     * @return 格式化后字符串
     */
    format(source: string, data?: any) {
        return source.replace(/\$\{([\w.]+)\}/g, ($0, $1) => {
            const ref = $1.split('.');
            let refObject: any = data;
            let level;

            while (refObject != null && (level = ref.shift())) {
                refObject = refObject[level];
            }

            return refObject != null ? refObject : '';
        });
    },

    /**
     * 使用指定字符填充字符串,默认`0`
     *
     * @param str 字符串
     * @param size 填充到的大小
     * @param 填充字符
     * @return 字符串
     */
    pad(str: string | number, size: number, ch?: string) {
        str = String(str);
        if (str.length > size) {
            return str.slice(str.length - size);
        }
        return new Array(size - str.length + 1).join(ch || '0') + str;
    },

    /**
     * 获取字符串哈希编码
     *
     * @param str 字符串
     * @return 哈希值
     */
    hashcode(str: string) {
        if (!str) {
            return 0;
        }

        let hash = 0;
        for (let i = 0, l = str.length; i < l; i++) {
            hash = 0x7FFFFFFFF & (hash * 31 + str.charCodeAt(i));
        }
        return hash;
    }
};
