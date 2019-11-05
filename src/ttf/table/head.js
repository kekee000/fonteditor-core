/**
 * @file head表
 * @author mengke01(kekee000@gmail.com)
 */

import table from './table';
import struct from './struct';

export default table.create(
    'head',
    [
        ['version', struct.Fixed],
        ['fontRevision', struct.Fixed],
        ['checkSumAdjustment', struct.Uint32],
        ['magickNumber', struct.Uint32],
        ['flags', struct.Uint16],
        ['unitsPerEm', struct.Uint16],
        ['created', struct.LongDateTime],
        ['modified', struct.LongDateTime],
        ['xMin', struct.Int16],
        ['yMin', struct.Int16],
        ['xMax', struct.Int16],
        ['yMax', struct.Int16],
        ['macStyle', struct.Uint16],
        ['lowestRecPPEM', struct.Uint16],
        ['fontDirectionHint', struct.Int16],
        ['indexToLocFormat', struct.Int16],
        ['glyphDataFormat', struct.Int16]
    ]
);
