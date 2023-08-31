/**
 * @file 解析glyf轮廓
 * @author mengke01(kekee000@gmail.com)
 */

import glyFlag from '../../enum/glyFlag';
import componentFlag from '../../enum/componentFlag';

const MAX_INSTRUCTION_LENGTH = 5000; // 设置instructions阈值防止读取错误
const MAX_NUMBER_OF_COORDINATES = 20000; // 设置坐标最大个数阈值，防止glyf读取错误

/**
 * 读取简单字形
 *
 * @param {Reader} reader Reader对象
 * @param {Object} glyf 空glyf
 * @return {Object} 解析后的glyf
 */
function parseSimpleGlyf(reader, glyf) {
    const offset = reader.offset;

    // 轮廓点个数
    const numberOfCoordinates = glyf.endPtsOfContours[
        glyf.endPtsOfContours.length - 1
    ] + 1;

    // 判断坐标是否超过最大个数
    if (numberOfCoordinates > MAX_NUMBER_OF_COORDINATES) {
        console.warn('error read glyf coordinates:' + offset);
        return glyf;
    }

    // 获取flag标志
    let i;
    let length;
    const flags = [];
    let flag;

    i = 0;
    while (i < numberOfCoordinates) {
        flag = reader.readUint8();
        flags.push(flag);
        i++;

        // 标志位3重复flag
        if ((flag & glyFlag.REPEAT) && i < numberOfCoordinates) {
            // 重复个数
            const repeat = reader.readUint8();
            for (let j = 0; j < repeat; j++) {
                flags.push(flag);
                i++;
            }
        }
    }

    // 坐标集合
    const coordinates = [];
    const xCoordinates = [];
    let prevX = 0;
    let x;

    for (i = 0, length = flags.length; i < length; ++i) {
        x = 0;
        flag = flags[i];

        // 标志位1
        // If set, the corresponding y-coordinate is 1 byte long, not 2
        if (flag & glyFlag.XSHORT) {
            x = reader.readUint8();

            // 标志位5
            x = (flag & glyFlag.XSAME) ? x : -1 * x;
        }
        // 与上一值一致
        else if (flag & glyFlag.XSAME) {
            x = 0;
        }
        // 新值
        else {
            x = reader.readInt16();
        }

        prevX += x;
        xCoordinates[i] = prevX;
        coordinates[i] = {
            x: prevX,
            y: 0
        };
        if (flag & glyFlag.ONCURVE) {
            coordinates[i].onCurve = true;
        }
    }

    const yCoordinates = [];
    let prevY = 0;
    let y;

    for (i = 0, length = flags.length; i < length; i++) {
        y = 0;
        flag = flags[i];

        if (flag & glyFlag.YSHORT) {
            y = reader.readUint8();
            y = (flag & glyFlag.YSAME) ? y : -1 * y;
        }
        else if (flag & glyFlag.YSAME) {
            y = 0;
        }
        else {
            y = reader.readInt16();
        }

        prevY += y;
        yCoordinates[i] = prevY;
        if (coordinates[i]) {
            coordinates[i].y = prevY;
        }
    }

    // 计算轮廓集合
    if (coordinates.length) {
        const endPtsOfContours = glyf.endPtsOfContours;
        const contours = [];
        contours.push(coordinates.slice(0, endPtsOfContours[0] + 1));

        for (i = 1, length = endPtsOfContours.length; i < length; i++) {
            contours.push(coordinates.slice(endPtsOfContours[i - 1] + 1, endPtsOfContours[i] + 1));
        }

        glyf.contours = contours;
    }

    return glyf;
}

/**
 * 读取复合字形
 *
 * @param {Reader} reader Reader对象
 * @param {Object} glyf glyf对象
 * @return {Object} glyf对象
 */
function parseCompoundGlyf(reader, glyf) {
    glyf.compound = true;
    glyf.glyfs = [];

    let flags;
    let g;

    // 读取复杂字形
    do {
        flags = reader.readUint16();
        g = {};
        g.flags = flags;
        g.glyphIndex = reader.readUint16();

        let arg1 = 0;
        let arg2 = 0;
        let scaleX = 16384;
        let scaleY = 16384;
        let scale01 = 0;
        let scale10 = 0;

        if (componentFlag.ARG_1_AND_2_ARE_WORDS & flags) {
            arg1 = reader.readInt16();
            arg2 = reader.readInt16();

        }
        else {
            arg1 = reader.readInt8();
            arg2 = reader.readInt8();
        }

        if (componentFlag.ROUND_XY_TO_GRID & flags) {
            arg1 = Math.round(arg1);
            arg2 = Math.round(arg2);
        }

        if (componentFlag.WE_HAVE_A_SCALE & flags) {
            scaleX = reader.readInt16();
            scaleY = scaleX;
        }
        else if (componentFlag.WE_HAVE_AN_X_AND_Y_SCALE & flags) {
            scaleX = reader.readInt16();
            scaleY = reader.readInt16();
        }
        else if (componentFlag.WE_HAVE_A_TWO_BY_TWO & flags) {
            scaleX = reader.readInt16();
            scale01 = reader.readInt16();
            scale10 = reader.readInt16();
            scaleY = reader.readInt16();
        }

        if (componentFlag.ARGS_ARE_XY_VALUES & flags) {
            g.useMyMetrics = !!flags & componentFlag.USE_MY_METRICS;
            g.overlapCompound = !!flags & componentFlag.OVERLAP_COMPOUND;

            g.transform = {
                a: Math.round(10000 * scaleX / 16384) / 10000,
                b: Math.round(10000 * scale01 / 16384) / 10000,
                c: Math.round(10000 * scale10 / 16384) / 10000,
                d: Math.round(10000 * scaleY / 16384) / 10000,
                e: arg1,
                f: arg2
            };
        }
        else {
            g.points = [arg1, arg2];
            g.transform = {
                a: Math.round(10000 * scaleX / 16384) / 10000,
                b: Math.round(10000 * scale01 / 16384) / 10000,
                c: Math.round(10000 * scale10 / 16384) / 10000,
                d: Math.round(10000 * scaleY / 16384) / 10000,
                e: 0,
                f: 0
            };
        }

        glyf.glyfs.push(g);

    } while (componentFlag.MORE_COMPONENTS & flags);

    if (componentFlag.WE_HAVE_INSTRUCTIONS & flags) {
        const length = reader.readUint16();
        if (length < MAX_INSTRUCTION_LENGTH) {
            const instructions = [];
            for (let i = 0; i < length; ++i) {
                instructions.push(reader.readUint8());
            }
            glyf.instructions = instructions;
        }
        else {
            console.warn(length);
        }
    }

    return glyf;
}



/**
 * 解析glyf轮廓
 *
 * @param  {Reader} reader 读取器
 * @param  {Object} ttf    ttf对象
 * @param  {number=} offset 偏移
 * @return {Object}        glyf对象
 */
export default function parseGlyf(reader, ttf, offset) {

    if (null != offset) {
        reader.seek(offset);
    }

    const glyf = {};
    let i;
    let length;
    let instructions;

    // 边界值
    const numberOfContours = reader.readInt16();
    glyf.xMin = reader.readInt16();
    glyf.yMin = reader.readInt16();
    glyf.xMax = reader.readInt16();
    glyf.yMax = reader.readInt16();

    // 读取简单字形
    if (numberOfContours >= 0) {
        // endPtsOfConturs
        glyf.endPtsOfContours = [];
        if (numberOfContours > 0) {
            for (i = 0; i < numberOfContours; i++) {
                glyf.endPtsOfContours.push(reader.readUint16());
            }
        }
        else {
            delete glyf.xMin;
            delete glyf.yMin;
            delete glyf.xMax;
            delete glyf.yMax;
        }

        // instructions
        length = reader.readUint16();
        if (length) {
            // range错误
            if (length < MAX_INSTRUCTION_LENGTH) {
                instructions = [];
                for (i = 0; i < length; ++i) {
                    instructions.push(reader.readUint8());
                }
                glyf.instructions = instructions;
            }
            else {
                console.warn(length);
            }
        }

        parseSimpleGlyf(reader, glyf);
        delete glyf.endPtsOfContours;
    }
    else {
        parseCompoundGlyf(reader, glyf);
    }

    return glyf;
}
