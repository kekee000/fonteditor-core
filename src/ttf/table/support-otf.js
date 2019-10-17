/**
 * @file otf字体格式支持的表
 * @author mengke01(kekee000@gmail.com)
 */

import head from './head';
import maxp from './maxp';
import cmap from './cmap';
import name from './name';
import hhea from './hhea';
import hmtx from './hmtx';
import post from './post';
import OS2 from './OS2';
import CFF from './CFF';

export default {
    head,
    maxp,
    cmap,
    name,
    hhea,
    hmtx,
    post,
    'OS/2': OS2,
    CFF
};
