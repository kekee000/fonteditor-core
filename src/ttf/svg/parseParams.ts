/**
 * @file 解析参数数组
 * @author mengke01(kekee000@gmail.com)
 */

const SEGMENT_REGEX = /-?\d+(?:\.\d+)?(?:e[-+]?\d+)?\b/g;

/**
 * 获取参数值
 *
 * @param d 参数
 * @return 参数值
 */
function getSegment(d: string) {
    return +d.trim();
}

/**
 * 解析参数数组
 *
 * @param str 参数字符串
 * @return 参数数组
 */
export default function parseParams(str: string) {
    if (!str) {
        return [];
    }
    const matchs = str.match(SEGMENT_REGEX);
    return matchs ? matchs.map(getSegment) : [];
}
