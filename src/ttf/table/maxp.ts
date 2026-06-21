/**
 * @file maxp 表
 * @author mengke01(kekee000@gmail.com)
 */

import Table from './table';
import struct from './struct';
import Writer from '../writer';
import {TTFObject} from '../ttf-types';

export default class Maxp extends Table {
    name = 'maxp';
    struct: Array<[string, number, number?]> = [
        ['version', struct.Fixed],
        ['numGlyphs', struct.Uint16],
        ['maxPoints', struct.Uint16],
        ['maxContours', struct.Uint16],
        ['maxCompositePoints', struct.Uint16],
        ['maxCompositeContours', struct.Uint16],
        ['maxZones', struct.Uint16],
        ['maxTwilightPoints', struct.Uint16],
        ['maxStorage', struct.Uint16],
        ['maxFunctionDefs', struct.Uint16],
        ['maxInstructionDefs', struct.Uint16],
        ['maxStackElements', struct.Uint16],
        ['maxSizeOfInstructions', struct.Uint16],
        ['maxComponentElements', struct.Uint16],
        ['maxComponentDepth', struct.Int16]
    ];

    write(writer: Writer, ttf: TTFObject) {
        super.write.call(this, writer, ttf.support);
    }

    size(): number {
        return 32;
    }
}
