/**
 * @file 解析cff编码
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 解析cff encoding数据
 * See Adobe TN #5176 chapter 12, "Encodings".
 *
 * @param  {Reader} reader 读取器
 * @param  {number=} start  偏移
 * @return {Object}        编码表
 */
export default function parseCFFEncoding(reader, start) {
    if (null != start) {
        reader.seek(start);
    }

    let i;
    let code;
    const encoding = {};
    const format = reader.readUint8();

    if (format === 0) {
        const nCodes = reader.readUint8();
        for (i = 0; i < nCodes; i += 1) {
            code = reader.readUint8();
            encoding[code] = i;
        }
    }
    else if (format === 1) {
        const nRanges = reader.readUint8();
        code = 1;
        for (i = 0; i < nRanges; i += 1) {
            const first = reader.readUint8();
            const nLeft = reader.readUint8();
            for (let j = first; j <= first + nLeft; j += 1) {
                encoding[j] = code;
                code += 1;
            }
        }
    }
    else {
        console.warn('unknown encoding format:' + format);
    }

    return encoding;
}
