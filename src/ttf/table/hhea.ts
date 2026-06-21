/**
 * @file hhea 表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hhea.html
 */

import Table from './table';
import struct from './struct';

export default class Hhea extends Table {
    name = 'hhea';
    struct: Array<[string, number, any?]> = [
        ['version', struct.Fixed],
        ['ascent', struct.Int16],
        ['descent', struct.Int16],
        ['lineGap', struct.Int16],
        ['advanceWidthMax', struct.Uint16],
        ['minLeftSideBearing', struct.Int16],
        ['minRightSideBearing', struct.Int16],
        ['xMaxExtent', struct.Int16],
        ['caretSlopeRise', struct.Int16],
        ['caretSlopeRun', struct.Int16],
        ['caretOffset', struct.Int16],
        ['reserved0', struct.Int16],
        ['reserved1', struct.Int16],
        ['reserved2', struct.Int16],
        ['reserved3', struct.Int16],
        ['metricDataFormat', struct.Int16],
        ['numOfLongHorMetrics', struct.Uint16]
    ];
}
