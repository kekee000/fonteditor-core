/**
 * @file cmap 表
 * @author mengke01(kekee000@gmail.com)
 *
 * @see
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
 */

import table from './table';
import parse from './cmap/parse';
import write from './cmap/write';
import sizeof from './cmap/sizeof';

export default table.create(
    'cmap',
    [],
    {
        write,
        read: parse,
        size: sizeof
    }
);

