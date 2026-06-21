/**
 * @file ttf读取和写入支持的表
 * @author mengke01(kekee000@gmail.com)
 */

import head from './head';
import maxp from './maxp';
import loca from './loca';
import cmap from './cmap';
import glyf from './glyf';
import name from './name';
import hhea from './hhea';
import hmtx from './hmtx';
import post from './post';
import OS2 from './OS2';
import fpgm from './fpgm';
import cvt from './cvt';
import prep from './prep';
import gasp from './gasp';
import GPOS from './GPOS';
import kern from './kern';
import kerx from './kerx';

export default {
    head,
    maxp,
    loca,
    cmap,
    glyf,
    name,
    hhea,
    hmtx,
    post,
    'OS/2': OS2,
    fpgm,
    cvt,
    prep,
    gasp,
    GPOS,
    kern,
    kerx
};
